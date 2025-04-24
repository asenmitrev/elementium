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
import { Droplets, Flame, Mountain } from "lucide-react";

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

  // Function to check stat changes between phases
  const getStatClass = (
    currentUnit: UnitTypeSimple | undefined | null,
    previousUnit: UnitTypeSimple | undefined | null,
    stat: "earth" | "fire" | "water"
  ) => {
    if (!currentUnit || !previousUnit) return "";

    if (currentUnit[stat] > previousUnit[stat]) {
      return "text-green-400 animate-pulse font-bold";
    } else if (currentUnit[stat] < previousUnit[stat]) {
      return "text-red-400 animate-pulse font-bold";
    }
    return "";
  };

  // Function to advance through battle phases
  const advancePhase = () => {
    if (phase === "starting") {
      setPhase("pre");
    } else if (phase === "pre") {
      setPhase("battle");
    } else if (phase === "battle") {
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

  // Helper function to render a unit card with stat animations
  const renderUnit = (
    unit: UnitTypeSimple | undefined | null,
    previousUnit: UnitTypeSimple | undefined | null,
    side: "attacker" | "defender"
  ) => {
    if (!unit) {
      return <div className="bg-gray-200 rounded p-4 text-center">No unit</div>;
    }

    return (
      <div className="border rounded-lg p-4 shadow relative">
        <SoldierCard unit={unit} />

        {/* Show stat changes with animations */}
        {previousUnit && (
          <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-4 text-sm bg-black/50 p-2 rounded">
            <div
              className={`flex items-center gap-2 ${getStatClass(
                unit,
                previousUnit,
                "earth"
              )}`}
            >
              <Mountain className="w-4 h-4 text-green-300" />
              <AnimatePresence>
                {unit.earth !== previousUnit.earth && (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-bold"
                  >
                    {unit.earth > previousUnit.earth
                      ? `+${unit.earth - previousUnit.earth}`
                      : `${unit.earth - previousUnit.earth}`}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div
              className={`flex items-center gap-2 ${getStatClass(
                unit,
                previousUnit,
                "fire"
              )}`}
            >
              <Flame className="w-4 h-4 text-orange-300" />
              <AnimatePresence>
                {unit.fire !== previousUnit.fire && (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-bold"
                  >
                    {unit.fire > previousUnit.fire
                      ? `+${unit.fire - previousUnit.fire}`
                      : `${unit.fire - previousUnit.fire}`}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div
              className={`flex items-center gap-2 ${getStatClass(
                unit,
                previousUnit,
                "water"
              )}`}
            >
              <Droplets className="w-4 h-4 text-blue-300" />
              <AnimatePresence>
                {unit.water !== previousUnit.water && (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-bold"
                  >
                    {unit.water > previousUnit.water
                      ? `+${unit.water - previousUnit.water}`
                      : `${unit.water - previousUnit.water}`}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {unit.specialExplanation && (
          <div className="mt-2 text-sm italic">{unit.specialExplanation}</div>
        )}
      </div>
    );
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

  if (!battle) {
    return <div>Battle not found</div>;
  }

  const { attacker, defender, prevAttacker, prevDefender } =
    getCurrentPhaseUnits();
  const currentRoundData = battle.rounds[currentRound];

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Battle Results:{" "}
          {battle.winner === "attacker"
            ? "Attacker Won"
            : battle.winner === "defender"
            ? "Defender Won"
            : "Draw"}
        </h1>

        {/* Battle Summary */}
        <div className="mb-8 border border-white/80 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Battle Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Attacker</h3>
              <div className="text-sm mb-1">
                Remaining Units: {battle.remainingAttackerDeck.length}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Defender</h3>
              <div className="text-sm mb-1">
                Remaining Units: {battle.remainingDefenderDeck.length}
              </div>
            </div>
          </div>
        </div>

        {/* Battle Rounds */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                Round {currentRound + 1} of {battle.rounds.length}
              </h2>
              <div className="text-sm mt-1">
                Phase: {phase.charAt(0).toUpperCase() + phase.slice(1)}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`px-3 py-1 rounded ${
                  autoPlay ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
              >
                {autoPlay ? "Pause" : "Auto Play"}
              </button>
              {!autoPlay && (
                <>
                  <button
                    onClick={handlePrevRound}
                    disabled={currentRound === 0}
                    className="px-3 py-1 border border-white/80 rounded disabled:opacity-50"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={advancePhase}
                    disabled={
                      phase === "complete" &&
                      currentRound === battle.rounds.length - 1
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    {phase === "complete" ? "Next Round" : "Next Phase →"}
                  </button>
                  <button
                    onClick={handleNextRound}
                    disabled={currentRound === battle.rounds.length - 1}
                    className="px-3 py-1 border border-white/80 rounded disabled:opacity-50"
                  >
                    Next →
                  </button>
                </>
              )}
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

          {battle?.rounds.length > 0 && (
            <div className="border border-white/80 shadow rounded-lg p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium mb-3">Attacker</h3>
                  {renderUnit(attacker, prevAttacker, "attacker")}

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
                          Post-battle effect:{" "}
                          {currentRoundData.postAttacker.text}
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

                <div>
                  <h3 className="font-medium mb-3">Defender</h3>
                  {renderUnit(defender, prevDefender, "defender")}

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
                          Post-battle effect:{" "}
                          {currentRoundData.postDefender.text}
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

              {(phase === "battle" ||
                phase === "post" ||
                phase === "complete") &&
                currentRoundData?.battle && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded text-center bg-black/30"
                  >
                    <p className="font-medium">
                      {currentRoundData.battle.text}
                    </p>
                    {currentRoundData.battle.winner && (
                      <p className="mt-2 text-green-600 font-bold">
                        Winner: {currentRoundData.battle.winner.name}
                      </p>
                    )}
                  </motion.div>
                )}
            </div>
          )}
        </div>

        {/* Castle Narrations */}
        {battle.HeroTypeUserFacingCastleNarrations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Castle Effects</h2>
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
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Attacker's Remaining Army
            </h2>
            {battle.remainingAttackerDeck.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {battle.remainingAttackerDeck.map((unit, index) => (
                  <SoldierCard key={index} unit={unit} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No units remaining</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Defender's Remaining Army
            </h2>
            {battle.remainingDefenderDeck.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {battle.remainingDefenderDeck.map((unit, index) => (
                  <SoldierCard key={index} unit={unit} />
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
