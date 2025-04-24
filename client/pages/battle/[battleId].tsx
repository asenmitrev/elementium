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

export default function BattlePage({ battle }: BattlePageProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<BattlePhase>("starting");
  const [autoPlay, setAutoPlay] = useState(false);
  const [phaseDelay, setPhaseDelay] = useState(1500); // milliseconds between phases

  // Function to advance through battle phases
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
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
        {/* Victory Banner */}
        <div className="relative mb-8">
          <h1
            className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${winnerColor}`}
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
        <div
          className={`mb-8 border-l-4 ${
            isAttackerWinner
              ? "border-red-500"
              : isDefenderWinner
              ? "border-emerald-500"
              : "border-gray-500"
          } pl-4`}
        >
          <h2 className="text-2xl font-bold mb-4">Battle Summary</h2>

          {/* Terrain / Land */}
          {land && (
            <div className="mt-6 mb-4 bg-black/20 rounded-lg p-3">
              <h3 className="text-lg font-semibold mb-2">Battlefield</h3>
              <div className="flex items-center gap-2">
                {land.toLowerCase().includes("fire") && (
                  <Flame className="w-5 h-5 text-orange-400" />
                )}
                {land.toLowerCase().includes("water") && (
                  <Droplets className="w-5 h-5 text-blue-400" />
                )}
                {land.toLowerCase().includes("earth") && (
                  <Mountain className="w-5 h-5 text-green-400" />
                )}
                <div className="text-gray-200">{land}</div>
                <div className="ml-auto text-xs text-gray-400 italic">
                  Units with matching element receive a battlefield advantage
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between">
            <div className={isDefenderWinner ? "opacity-50" : ""}>
              <h3
                className={`text-xl mb-2 ${
                  isAttackerWinner ? "text-red-400" : ""
                }`}
              >
                Attacker
              </h3>
              <p>
                Remaining Units:{" "}
                {isAttackerWinner && (
                  <span className="text-red-400 font-bold">
                    {battle.remainingAttackerDeck.length}
                  </span>
                )}
                {!isAttackerWinner && battle.remainingAttackerDeck.length}
              </p>
            </div>

            <div className={isAttackerWinner ? "opacity-50" : ""}>
              <h3
                className={`text-xl mb-2 ${
                  isDefenderWinner ? "text-emerald-400" : ""
                }`}
              >
                Defender
              </h3>
              <p>
                Remaining Units:{" "}
                {isDefenderWinner && (
                  <span className="text-emerald-400 font-bold">
                    {battle.remainingDefenderDeck.length}
                  </span>
                )}
                {!isDefenderWinner && battle.remainingDefenderDeck.length}
              </p>
            </div>
          </div>
        </div>

        {/* Round Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              Round {currentRound + 1} of {battle.rounds.length}
            </h2>
            <p className="text-gray-400">
              Phase: {phase.charAt(0).toUpperCase() + phase.slice(1)}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`${
                autoPlay
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } text-white px-4 py-2 rounded-md flex items-center gap-1 transition-colors`}
            >
              <Play size={16} />
              {autoPlay ? "Pause" : "Auto Play"}
            </button>
            <button
              onClick={handlePrevRound}
              disabled={currentRound === 0}
              className="border border-gray-600 hover:bg-gray-800 px-4 py-2 rounded-md flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <button
              onClick={advancePhase}
              disabled={
                phase === "complete" &&
                currentRound === battle.rounds.length - 1
              }
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              {phase === "complete" ? "Next Round" : "Next Phase"}
              <ChevronRight size={16} />
            </button>
            <button
              onClick={handleNextRound}
              disabled={currentRound === battle.rounds.length - 1}
              className="border border-gray-600 hover:bg-gray-800 px-4 py-2 rounded-md flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
            {autoPlay && (
              <div className="flex items-center gap-2">
                <span>Speed:</span>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={phaseDelay}
                  onChange={(e) => setPhaseDelay(parseInt(e.target.value))}
                  className="w-24"
                />
              </div>
            )}
          </div>
        </div>

        {/* Battle Content */}
        {battle?.rounds.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-8">
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
                  className={`text-xl font-bold mb-4 border-b border-gray-700 pb-2 ${
                    isAttackerWinner ? "text-red-400" : ""
                  }`}
                >
                  Attacker
                </h3>

                {attacker ? (
                  <div className="relative">
                    <div className="bg-black/30 p-4 rounded-lg">
                      <SoldierCard
                        unit={attacker}
                        previousUnit={prevAttacker}
                        showChanges={phase !== "starting"}
                        battlefieldElement={land}
                      />
                      {attacker.specialExplanation && (
                        <div className="mt-2 text-sm italic text-gray-300">
                          {attacker.specialExplanation}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded p-4 text-center">
                    No unit
                  </div>
                )}

                {phase === "pre" && currentRoundData?.preAttacker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm border-l-4 pl-2 border-blue-400"
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-sm border-l-4 pl-2 border-purple-400"
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
                  className={`text-xl font-bold mb-4 border-b border-gray-700 pb-2 ${
                    isDefenderWinner ? "text-emerald-400" : ""
                  }`}
                >
                  Defender
                </h3>

                {defender ? (
                  <div className="relative">
                    <div className="bg-black/30 p-4 rounded-lg">
                      <SoldierCard
                        unit={defender}
                        previousUnit={prevDefender}
                        showChanges={phase !== "starting"}
                        battlefieldElement={land}
                      />
                      {defender.specialExplanation && (
                        <div className="mt-2 text-sm italic text-gray-300">
                          {defender.specialExplanation}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded p-4 text-center">
                    No unit
                  </div>
                )}

                {phase === "pre" && currentRoundData?.preDefender && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm border-l-4 pl-2 border-blue-400"
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-sm border-l-4 pl-2 border-purple-400"
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

            {/* Decks and Graveyards */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <div className="grid grid-cols-2 gap-2">
                      {attackerDeck.map((unit, index) => (
                        <div key={index} className="bg-black/20 p-2 rounded">
                          <SoldierCard unit={unit} battlefieldElement={land} />
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
                    <div className="grid grid-cols-2 gap-2">
                      {attackerGraveyard.map((unit, index) => (
                        <div
                          key={index}
                          className="bg-black/20 p-2 rounded opacity-70"
                        >
                          <SoldierCard unit={unit} battlefieldElement={land} />
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
                    <div className="grid grid-cols-2 gap-2">
                      {defenderDeck.slice(0, 4).map((unit, index) => (
                        <div key={index} className="bg-black/20 p-2 rounded">
                          <SoldierCard unit={unit} battlefieldElement={land} />
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
                    <div className="grid grid-cols-2 gap-2">
                      {defenderGraveyard.slice(0, 4).map((unit, index) => (
                        <div
                          key={index}
                          className="bg-black/20 p-2 rounded opacity-70"
                        >
                          <SoldierCard unit={unit} battlefieldElement={land} />
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

        {/* Battle Result */}
        {(phase === "battle" || phase === "post" || phase === "complete") &&
          currentRoundData?.battle && (
            <div className="text-center mb-8">
              {currentRoundData.battle.winner && (
                <>
                  <p className="text-xl mb-2">
                    {currentRoundData.battle.winner.name} defeated{" "}
                    {currentRoundData.battle.winner.name === attacker?.name
                      ? defender?.name
                      : attacker?.name}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
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

        {/* Castle Narrations */}
        {battle.HeroTypeUserFacingCastleNarrations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Castle Effects</h2>
            <ul className="list-disc pl-5 space-y-2">
              {battle.HeroTypeUserFacingCastleNarrations.map(
                (narration, index) => (
                  <li key={index}>{narration}</li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Remaining Army */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={isDefenderWinner ? "opacity-75" : ""}>
            <h2
              className={`text-2xl font-bold mb-4 ${
                isAttackerWinner ? "text-red-400" : ""
              }`}
            >
              Attacker's Remaining Army
            </h2>
            {battle.remainingAttackerDeck.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {battle.remainingAttackerDeck.map((unit, index) => (
                  <SoldierCard
                    key={index}
                    unit={unit}
                    battlefieldElement={land}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No units remaining</p>
            )}
          </div>

          <div className={isAttackerWinner ? "opacity-75" : ""}>
            <h2
              className={`text-2xl font-bold mb-4 ${
                isDefenderWinner ? "text-emerald-400" : ""
              }`}
            >
              Defender's Remaining Army
            </h2>
            {battle.remainingDefenderDeck.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {battle.remainingDefenderDeck.map((unit, index) => (
                  <SoldierCard
                    key={index}
                    unit={unit}
                    battlefieldElement={land}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No units remaining</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
