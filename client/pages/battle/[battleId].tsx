import { GetServerSideProps } from "next";
import { useState } from "react";
import { BattleResult } from "types/battle/effectUtils";
import ProtectedRoute from "@/components/protected-route";
import { BattleService } from "@/services/battle.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { UnitTypeSimple } from "types";

interface BattlePageProps {
  battle: BattleResult;
}

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

  const handleNextRound = () => {
    if (currentRound < battle.rounds.length - 1) {
      setCurrentRound(currentRound + 1);
    }
  };

  const handlePrevRound = () => {
    if (currentRound > 0) {
      setCurrentRound(currentRound - 1);
    }
  };

  // Helper function to render a unit card
  const renderUnit = (unit: UnitTypeSimple | undefined | null) => {
    if (!unit)
      return <div className="bg-gray-200 rounded p-4 text-center">No unit</div>;

    return (
      <div className="border rounded-lg p-4 bg-white shadow">
        <div className="font-bold text-lg">{unit.name}</div>
        <div className="flex justify-between mt-2">
          <span className="text-red-500">Fire: {unit.fire}</span>
          <span className="text-blue-500">Water: {unit.water}</span>
          <span className="text-green-500">Earth: {unit.earth}</span>
        </div>
        {unit.specialExplanation && (
          <div className="mt-2 text-sm italic">{unit.specialExplanation}</div>
        )}
      </div>
    );
  };

  if (!battle) {
    return <div>Battle not found</div>;
  }

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
        <div className="mb-8 bg-gray-100 p-4 rounded-lg">
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
            <h2 className="text-xl font-semibold">
              Round {currentRound + 1} of {battle.rounds.length}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevRound}
                disabled={currentRound === 0}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextRound}
                disabled={currentRound === battle.rounds.length - 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {battle?.rounds.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium mb-3">Attacker</h3>
                  {renderUnit(battle.rounds[currentRound].battle?.attacker)}

                  {battle.rounds[currentRound].preAttacker && (
                    <div className="mt-3 text-sm border-l-4 pl-2 border-blue-400">
                      <div>
                        Pre-battle:{" "}
                        {battle?.rounds[currentRound]?.preAttacker?.text}
                      </div>
                      <div
                        className={`${
                          battle.rounds[currentRound]?.preAttacker?.effect ===
                          "buff"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {battle.rounds[currentRound]?.preAttacker?.stat &&
                          `${battle.rounds[currentRound]?.preAttacker?.stat}: ${battle.rounds[currentRound]?.preAttacker?.value}`}
                      </div>
                    </div>
                  )}

                  {battle.rounds[currentRound].postAttacker && (
                    <div className="mt-3 text-sm border-l-4 pl-2 border-purple-400">
                      <div>
                        Post-battle:{" "}
                        {battle.rounds[currentRound]?.postAttacker?.text}
                      </div>
                      <div
                        className={`${
                          battle.rounds[currentRound]?.postAttacker?.effect ===
                          "buff"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {battle.rounds[currentRound]?.postAttacker?.stat &&
                          `${battle.rounds[currentRound]?.postAttacker?.stat}: ${battle.rounds[currentRound]?.postAttacker?.value}`}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-3">Defender</h3>
                  {renderUnit(battle.rounds[currentRound]?.battle?.defender)}

                  {battle.rounds[currentRound]?.preDefender && (
                    <div className="mt-3 text-sm border-l-4 pl-2 border-blue-400">
                      <div>
                        Pre-battle:{" "}
                        {battle?.rounds[currentRound]?.preDefender?.text}
                      </div>
                      <div
                        className={`${
                          battle.rounds[currentRound]?.preDefender?.effect ===
                          "buff"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {battle.rounds[currentRound]?.preDefender?.stat &&
                          `${battle.rounds[currentRound]?.preDefender?.stat}: ${battle.rounds[currentRound]?.preDefender?.value}`}
                      </div>
                    </div>
                  )}

                  {battle.rounds[currentRound]?.postDefender && (
                    <div className="mt-3 text-sm border-l-4 pl-2 border-purple-400">
                      <div>
                        Post-battle:{" "}
                        {battle.rounds[currentRound]?.postDefender?.text}
                      </div>
                      <div
                        className={`${
                          battle.rounds[currentRound]?.postDefender?.effect ===
                          "buff"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {battle.rounds[currentRound]?.postDefender?.stat &&
                          `${battle.rounds[currentRound]?.postDefender?.stat}: ${battle.rounds[currentRound]?.postDefender?.value}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {battle.rounds[currentRound]?.battle && (
                <div className="mt-4 p-3 bg-gray-100 rounded text-center">
                  <p className="font-medium">
                    {battle?.rounds[currentRound]?.battle?.text}
                  </p>
                  {battle?.rounds[currentRound]?.battle?.winner && (
                    <p className="mt-2 text-green-600">
                      Winner:{" "}
                      {battle?.rounds[currentRound]?.battle?.winner?.name}
                    </p>
                  )}
                </div>
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
                  <div key={index} className="border p-2 rounded text-sm">
                    <div className="font-medium">{unit.name}</div>
                    <div className="flex justify-between mt-1 text-xs">
                      <span className="text-red-500">F:{unit.fire}</span>
                      <span className="text-blue-500">W:{unit.water}</span>
                      <span className="text-green-500">E:{unit.earth}</span>
                    </div>
                  </div>
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
                  <div key={index} className="border p-2 rounded text-sm">
                    <div className="font-medium">{unit.name}</div>
                    <div className="flex justify-between mt-1 text-xs">
                      <span className="text-red-500">F: {unit.fire}</span>
                      <span className="text-blue-500">W: {unit.water}</span>
                      <span className="text-green-500">E: {unit.earth}</span>
                    </div>
                  </div>
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
