import { Flame, Droplets, Mountain } from "lucide-react";
import { BattleResult } from "types/battle/effectUtils";

interface BattleSummaryProps {
  battle: BattleResult;
}

export default function BattleSummary({ battle }: BattleSummaryProps) {
  const isAttackerWinner = battle.winner === "attacker";
  const isDefenderWinner = battle.winner === "defender";
  const isDraw = !isAttackerWinner && !isDefenderWinner;

  // Get battlefield element
  const land = battle.rounds[0]?.startingRound?.land || "";

  return (
    <div className="bg-black/30 text-white p-2 border border-gray-800 rounded-md">
      <div className="flex justify-between items-center border-b border-gray-800 pb-1 mb-1">
        <h2
          className={`text-sm font-medium ${
            isAttackerWinner
              ? "text-red-400"
              : isDefenderWinner
              ? "text-green-400"
              : "text-gray-400"
          }`}
        >
          {isAttackerWinner
            ? "Attacker Won"
            : isDefenderWinner
            ? "Defender Won"
            : "Draw"}
        </h2>

        {land && (
          <div className="flex items-center gap-1">
            {land.toLowerCase().includes("fire") && (
              <Flame className="h-3 w-3 text-orange-400 fill-orange-400" />
            )}
            {land.toLowerCase().includes("water") && (
              <Droplets className="h-3 w-3 text-blue-400 fill-blue-400" />
            )}
            {land.toLowerCase().includes("earth") && (
              <Mountain className="h-3 w-3 text-green-400 fill-green-400" />
            )}
            <span className="text-xs text-gray-300">{land.toLowerCase()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between text-xs">
        <div>
          <span
            className={`${isAttackerWinner ? "text-red-400" : "text-gray-400"}`}
          >
            Attacker:
          </span>{" "}
          {battle.remainingAttackerDeck.length}
        </div>
        <div>
          <span
            className={`${
              isDefenderWinner ? "text-green-400" : "text-gray-400"
            }`}
          >
            Defender:
          </span>{" "}
          {battle.remainingDefenderDeck.length}
        </div>
      </div>

      <div className="mt-1">
        <p className="text-gray-400 text-[10px] italic">
          Units with matching element receive advantage
        </p>
      </div>
    </div>
  );
}
