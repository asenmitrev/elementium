import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { BattleResult } from "types/battle/effectUtils";
import ProtectedRoute from "@/components/protected-route";
import { BattleService } from "@/services/battle.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { UnitTypeSimple } from "types";
import SoldierCard from "@/components/soldier";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Flame,
  Droplets,
  Mountain,
} from "lucide-react";
import Image from "next/image";
import BattleSummary from "@/components/battle-summary";
import { useSession } from "next-auth/react";

interface BattlePageProps {
  battle: BattleResult;
}

// Define battle phase types for animation control
type BattlePhase = "starting" | "pre" | "battle" | "post" | "complete";

export const getServerSideProps: GetServerSideProps<BattlePageProps> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const battleId = context.params?.battleId as string;

  try {
    const battle = await BattleService.getBattle(
      battleId,
      session?.user.accessToken || ""
    );

    if (!battle) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        battle,
      },
    };
  } catch (error) {
    console.error("Error fetching battle:", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

function CompactUnitCard({
  unit,
  battlefieldElement = null,
}: {
  unit: UnitTypeSimple;
  battlefieldElement?: string | null;
}) {
  // Determine if this unit's strongest stat matches the battlefield
  const isEarthStrongest = unit.earth > unit.fire && unit.earth > unit.water;
  const isFireStrongest = unit.fire > unit.earth && unit.fire > unit.water;
  const isWaterStrongest = unit.water > unit.earth && unit.water > unit.fire;

  const hasElementalAdvantage =
    (battlefieldElement?.toLowerCase().includes("earth") && isEarthStrongest) ||
    (battlefieldElement?.toLowerCase().includes("fire") && isFireStrongest) ||
    (battlefieldElement?.toLowerCase().includes("water") && isWaterStrongest);

  return (
    <div
      className={`flex items-center rounded overflow-hidden ${
        hasElementalAdvantage ? "ring-1 ring-yellow-400" : ""
      }`}
    >
      {/* Unit image */}
      <div className="relative w-12 h-12 flex-shrink-0">
        <Image
          src={`/images/units/${unit.image}`}
          alt={unit.name}
          fill
          className="object-cover"
        />
        {hasElementalAdvantage && (
          <div className="absolute top-0 right-0 bg-yellow-500 w-3 h-3 rounded-full" />
        )}
      </div>

      {/* Stats section */}
      <div className="flex-1 pl-2 py-1 pr-1 bg-black/60 text-xs">
        <div className="text-white font-medium truncate w-20">{unit.name}</div>
        <div className="flex justify-between mt-1">
          <div
            className={`flex items-center gap-1 ${
              battlefieldElement?.toLowerCase().includes("earth") &&
              isEarthStrongest
                ? "text-green-300"
                : "text-white"
            }`}
          >
            <Mountain className="w-3 h-3 text-green-300" />
            {unit.earth}
          </div>
          <div
            className={`flex items-center gap-1 ${
              battlefieldElement?.toLowerCase().includes("fire") &&
              isFireStrongest
                ? "text-orange-300"
                : "text-white"
            }`}
          >
            <Flame className="w-3 h-3 text-orange-300" />
            {unit.fire}
          </div>
          <div
            className={`flex items-center gap-1 ${
              battlefieldElement?.toLowerCase().includes("water") &&
              isWaterStrongest
                ? "text-blue-300"
                : "text-white"
            }`}
          >
            <Droplets className="w-3 h-3 text-blue-300" />
            {unit.water}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BattlePage({ battle }: BattlePageProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<BattlePhase>("starting");
  const [autoPlay, setAutoPlay] = useState(false);
  const [phaseDelay, setPhaseDelay] = useState(1500); // milliseconds between phases
  // Function to advance through battle phases
  console.log(battle);
  const advancePhase = () => {
    if (phase === "starting") {
      setPhase("pre");
    } else if (phase === "pre") {
      setPhase("post");
    } else if (phase === "post") {
      setPhase("complete");
    } else if (phase === "complete") {
      // Reset to starting phase of next round or do nothing if it's the last round
      if (currentRound < battle.rounds.length - 1) {
        setCurrentRound(currentRound + 1);
        setPhase("starting");
      } else {
        setAutoPlay(false);
      }
    }
  };

  // Auto advance through phases if autoPlay is enabled
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoPlay) {
      timer = setTimeout(advancePhase, phaseDelay);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [phase, autoPlay, currentRound]);

  // Reset phase when manually changing rounds
  const handlePrevRound = () => {
    if (currentRound > 0) {
      setCurrentRound(currentRound - 1);
      setPhase("starting");
      setAutoPlay(false);
    }
  };

  const handleNextRound = () => {
    if (currentRound < battle.rounds.length - 1) {
      setCurrentRound(currentRound + 1);
      setPhase("starting");
      setAutoPlay(false);
    }
  };

  // Get the appropriate units based on the current phase
  const getCurrentPhaseUnits = () => {
    const round = battle.rounds[currentRound];
    if (!round)
      return {
        attacker: null,
        defender: null,
        prevAttacker: null,
        prevDefender: null,
      };

    switch (phase) {
      case "starting":
        return {
          attacker: round.startingRound?.attacker,
          defender: round.startingRound?.defender,
          prevAttacker: null,
          prevDefender: null,
        };
      case "pre":
        return {
          attacker: round.preRound?.attacker,
          defender: round.preRound?.defender,
          prevAttacker: round.startingRound?.attacker,
          prevDefender: round.startingRound?.defender,
        };
      case "battle":
        return {
          attacker: round.battle?.attacker,
          defender: round.battle?.defender,
          prevAttacker: round.preRound?.attacker,
          prevDefender: round.preRound?.defender,
        };
      case "post":
      case "complete":
        return {
          attacker: round.postRound?.attacker,
          defender: round.postRound?.defender,
          prevAttacker: round.battle?.attacker,
          prevDefender: round.battle?.defender,
        };
      default:
        return {
          attacker: null,
          defender: null,
          prevAttacker: null,
          prevDefender: null,
        };
    }
  };

  // Get the current phase data for decks and graveyards
  const getCurrentPhaseDecks = () => {
    const round = battle.rounds[currentRound];
    if (!round)
      return {
        attackerDeck: [],
        defenderDeck: [],
        attackerGraveyard: [],
        defenderGraveyard: [],
        land: null,
      };

    switch (phase) {
      case "starting":
        return {
          attackerDeck: round.startingRound?.attackerDeck || [],
          defenderDeck: round.startingRound?.defenderDeck || [],
          attackerGraveyard: round.startingRound?.attackerGraveyard || [],
          defenderGraveyard: round.startingRound?.defenderGraveyard || [],
          land: round.startingRound?.land,
        };
      case "pre":
        return {
          attackerDeck: round.preRound?.attackerDeck || [],
          defenderDeck: round.preRound?.defenderDeck || [],
          attackerGraveyard: round.preRound?.attackerGraveyard || [],
          defenderGraveyard: round.preRound?.defenderGraveyard || [],
          land: round.preRound?.land,
        };
      case "post":
      case "complete":
        return {
          attackerDeck: round.postRound?.attackerDeck || [],
          defenderDeck: round.postRound?.defenderDeck || [],
          attackerGraveyard: round.postRound?.attackerGraveyard || [],
          defenderGraveyard: round.postRound?.defenderGraveyard || [],
          land: round.postRound?.land,
        };
      default:
        return {
          attackerDeck: [],
          defenderDeck: [],
          attackerGraveyard: [],
          defenderGraveyard: [],
          land: null,
        };
    }
  };

  if (!battle) {
    return <div>Battle not found</div>;
  }

  const { attacker, defender, prevAttacker, prevDefender } =
    getCurrentPhaseUnits();
  const {
    attackerDeck,
    defenderDeck,
    attackerGraveyard,
    defenderGraveyard,
    land,
  } = getCurrentPhaseDecks();
  const currentRoundData = battle.rounds[currentRound];

  const isAttackerWinner = battle.winner === "attacker";
  const isDefenderWinner = battle.winner === "defender";
  const winnerColor = isAttackerWinner
    ? "from-red-400 to-orange-600"
    : isDefenderWinner
    ? "from-emerald-400 to-teal-600"
    : "from-gray-400 to-gray-600";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4">
        {/* Victory Banner */}
        <div className="relative mb-4">
          <h1
            className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${winnerColor}`}
          >
            {isAttackerWinner
              ? "Attacker Won"
              : isDefenderWinner
              ? "Defender Won"
              : "Draw"}
          </h1>
          <div
            className={`h-0.5 w-full bg-gradient-to-r ${winnerColor} to-transparent mt-2`}
          ></div>
        </div>

        {/* Battle Summary */}
        <BattleSummary battle={battle} />

        {/* Round Navigation */}
        <div className="flex items-center justify-between mb-4 mt-4">
          <div>
            <h2 className="text-xl font-bold">
              Round {currentRound + 1} of {battle.rounds.length}
            </h2>
            <p className="text-gray-400 text-sm">
              Phase: {phase.charAt(0).toUpperCase() + phase.slice(1)}
            </p>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`${
                autoPlay
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors`}
            >
              <Play size={14} />
              {autoPlay ? "Pause" : "Auto"}
            </button>
            <button
              onClick={handlePrevRound}
              disabled={currentRound === 0}
              className="border border-gray-600 hover:bg-gray-800 px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              onClick={advancePhase}
              disabled={
                phase === "complete" &&
                currentRound === battle.rounds.length - 1
              }
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              {phase === "complete" ? "Next" : "Phase"}
              <ChevronRight size={14} />
            </button>
            <button
              onClick={handleNextRound}
              disabled={currentRound === battle.rounds.length - 1}
              className="border border-gray-600 hover:bg-gray-800 px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              Next
              <ChevronRight size={14} />
            </button>
            {autoPlay && (
              <div className="flex items-center gap-1 ml-1">
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={phaseDelay}
                  onChange={(e) => setPhaseDelay(parseInt(e.target.value))}
                  className="w-16"
                />
              </div>
            )}
          </div>
        </div>

        {/* Battle Content */}
        {battle?.rounds.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Attacker */}
              <div
                className={`flex-1 ${
                  isDefenderWinner &&
                  currentRoundData?.battle?.winner?.name === defender?.name
                    ? "opacity-60"
                    : ""
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-2 border-b border-gray-700 pb-1 ${
                    isAttackerWinner ? "text-red-400" : ""
                  }`}
                >
                  Attacker
                </h3>

                {attacker ? (
                  <div className="relative">
                    <div className="bg-black/30 p-2 rounded-lg">
                      <SoldierCard
                        unit={attacker}
                        previousUnit={prevAttacker}
                        showChanges={phase !== "starting"}
                        battlefieldElement={land}
                        compact={true}
                      />
                      {attacker.specialExplanation && (
                        <div className="mt-1 text-xs italic text-gray-300">
                          {attacker.specialExplanation}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded p-2 text-center text-sm">
                    No unit
                  </div>
                )}

                {phase === "pre" && currentRoundData?.preAttacker && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs border-l-4 pl-2 border-blue-400"
                  >
                    <div>
                      Pre-battle effect: {currentRoundData.preAttacker.text}
                    </div>
                    <div
                      className={`${
                        currentRoundData.preAttacker.effect === "buff"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {currentRoundData.preAttacker.stat &&
                        `${currentRoundData.preAttacker.stat}: ${currentRoundData.preAttacker.value}`}
                    </div>
                  </motion.div>
                )}

                {(phase === "post" || phase === "complete") &&
                  currentRoundData?.postAttacker && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs border-l-4 pl-2 border-purple-400"
                    >
                      <div>
                        Post-battle effect: {currentRoundData.postAttacker.text}
                      </div>
                      <div
                        className={`${
                          currentRoundData.postAttacker.effect === "buff"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {currentRoundData.postAttacker.stat &&
                          `${currentRoundData.postAttacker.stat}: ${currentRoundData.postAttacker.value}`}
                      </div>
                    </motion.div>
                  )}
              </div>

              {/* Defender */}
              <div
                className={`flex-1 ${
                  isAttackerWinner &&
                  currentRoundData?.battle?.winner?.name === attacker?.name
                    ? "opacity-60"
                    : ""
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-2 border-b border-gray-700 pb-1 ${
                    isDefenderWinner ? "text-emerald-400" : ""
                  }`}
                >
                  Defender
                </h3>

                {defender ? (
                  <div className="relative">
                    <div className="bg-black/30 p-2 rounded-lg">
                      <SoldierCard
                        unit={defender}
                        previousUnit={prevDefender}
                        showChanges={phase !== "starting"}
                        battlefieldElement={land}
                        compact={true}
                      />
                      {defender.specialExplanation && (
                        <div className="mt-1 text-xs italic text-gray-300">
                          {defender.specialExplanation}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded p-2 text-center text-sm">
                    No unit
                  </div>
                )}

                {phase === "pre" && currentRoundData?.preDefender && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs border-l-4 pl-2 border-blue-400"
                  >
                    <div>
                      Pre-battle effect: {currentRoundData.preDefender.text}
                    </div>
                    <div
                      className={`${
                        currentRoundData.preDefender.effect === "buff"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {currentRoundData.preDefender.stat &&
                        `${currentRoundData.preDefender.stat}: ${currentRoundData.preDefender.value}`}
                    </div>
                  </motion.div>
                )}

                {(phase === "post" || phase === "complete") &&
                  currentRoundData?.postDefender && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs border-l-4 pl-2 border-purple-400"
                    >
                      <div>
                        Post-battle effect: {currentRoundData.postDefender.text}
                      </div>
                      <div
                        className={`${
                          currentRoundData.postDefender.effect === "buff"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {currentRoundData.postDefender.stat &&
                          `${currentRoundData.postDefender.stat}: ${currentRoundData.postDefender.value}`}
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>

            {/* Battle Result */}
            {(phase === "battle" || phase === "post" || phase === "complete") &&
              currentRoundData?.battle && (
                <div className="text-center mb-4">
                  {currentRoundData.battle.winner && (
                    <>
                      <p className="text-md mb-1">
                        {currentRoundData.battle.winner.name} defeated{" "}
                        {currentRoundData.battle.winner.name === attacker?.name
                          ? defender?.name
                          : attacker?.name}
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          currentRoundData.battle.winner.name === attacker?.name
                            ? "text-red-400"
                            : "text-emerald-400"
                        }`}
                      >
                        Winner: {currentRoundData.battle.winner.name}
                      </p>
                    </>
                  )}
                </div>
              )}
            {/* Decks and Graveyards */}
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Attacker Deck and Graveyard */}
              <div>
                <div className="mb-4">
                  <h3
                    className={`text-lg font-semibold mb-2 border-b border-gray-700 pb-1 ${
                      isAttackerWinner ? "text-red-400" : ""
                    }`}
                  >
                    Attacker's Deck ({attackerDeck.length})
                  </h3>
                  {attackerDeck.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {attackerDeck.map((unit, index) => (
                        <div key={index} className="bg-black/20 p-1 rounded">
                          <CompactUnitCard
                            unit={unit}
                            battlefieldElement={land}
                          />
                        </div>
                      ))}
                      {attackerDeck.length > 4 && (
                        <div className="col-span-2 text-center text-sm text-gray-400">
                          + {attackerDeck.length - 4} more units
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No units in deck
                    </div>
                  )}
                </div>

                <div>
                  <h3
                    className={`text-lg font-semibold mb-2 border-b border-gray-700 pb-1 ${
                      isAttackerWinner ? "text-red-400" : ""
                    }`}
                  >
                    Attacker's Graveyard ({attackerGraveyard.length})
                  </h3>
                  {attackerGraveyard.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {attackerGraveyard.map((unit, index) => (
                        <div
                          key={index}
                          className="bg-black/20 p-1 rounded opacity-70"
                        >
                          <CompactUnitCard
                            unit={unit}
                            battlefieldElement={land}
                          />
                        </div>
                      ))}
                      {attackerGraveyard.length > 4 && (
                        <div className="col-span-2 text-center text-sm text-gray-400">
                          + {attackerGraveyard.length - 4} more fallen units
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No units in graveyard
                    </div>
                  )}
                </div>
              </div>

              {/* Defender Deck and Graveyard */}
              <div>
                <div className="mb-4">
                  <h3
                    className={`text-lg font-semibold mb-2 border-b border-gray-700 pb-1 ${
                      isDefenderWinner ? "text-emerald-400" : ""
                    }`}
                  >
                    Defender's Deck ({defenderDeck.length})
                  </h3>
                  {defenderDeck.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {defenderDeck.map((unit, index) => (
                        <div key={index} className="bg-black/20 p-1 rounded">
                          <CompactUnitCard
                            unit={unit}
                            battlefieldElement={land}
                          />
                        </div>
                      ))}
                      {defenderDeck.length > 4 && (
                        <div className="col-span-2 text-center text-sm text-gray-400">
                          + {defenderDeck.length - 4} more units
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No units in deck
                    </div>
                  )}
                </div>

                <div>
                  <h3
                    className={`text-lg font-semibold mb-2 border-b border-gray-700 pb-1 ${
                      isDefenderWinner ? "text-emerald-400" : ""
                    }`}
                  >
                    Defender's Graveyard ({defenderGraveyard.length})
                  </h3>
                  {defenderGraveyard.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {defenderGraveyard.map((unit, index) => (
                        <div
                          key={index}
                          className="bg-black/20 p-1 rounded opacity-70"
                        >
                          <CompactUnitCard
                            unit={unit}
                            battlefieldElement={land}
                          />
                        </div>
                      ))}
                      {defenderGraveyard.length > 4 && (
                        <div className="col-span-2 text-center text-sm text-gray-400">
                          + {defenderGraveyard.length - 4} more fallen units
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No units in graveyard
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Castle Narrations */}
        {battle.HeroTypeUserFacingCastleNarrations.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Castle Effects</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {battle.HeroTypeUserFacingCastleNarrations.map(
                (narration, index) => (
                  <li key={index}>{narration}</li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Remaining Army */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className={isDefenderWinner ? "opacity-75" : ""}>
            <h2
              className={`text-lg font-bold mb-2 ${
                isAttackerWinner ? "text-red-400" : ""
              }`}
            >
              Attacker's Remaining Army
            </h2>
            {battle.remainingAttackerDeck.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {battle.remainingAttackerDeck.map((unit, index) => (
                  <SoldierCard
                    key={index}
                    unit={unit}
                    battlefieldElement={land}
                    compact={true}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No units remaining</p>
            )}
          </div>

          <div className={isAttackerWinner ? "opacity-75" : ""}>
            <h2
              className={`text-lg font-bold mb-2 ${
                isDefenderWinner ? "text-emerald-400" : ""
              }`}
            >
              Defender's Remaining Army
            </h2>
            {battle.remainingDefenderDeck.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {battle.remainingDefenderDeck.map((unit, index) => (
                  <SoldierCard
                    key={index}
                    unit={unit}
                    battlefieldElement={land}
                    compact={true}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No units remaining</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
