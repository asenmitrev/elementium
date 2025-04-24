import { Land, UnitType, UnitTypeSimple } from "..";
import { RoundNarration } from "./main";

export type AdditiveArg = {
  type: "additive";
  costPerValue: number;
};

export type SelectableArg = {
  type: "selectable";
  options: Record<string, { cost: number }>;
};

export type MethodArgument = AdditiveArg | SelectableArg;

export type MethodArgsConfig = Record<string, MethodArgument>;

export type RoundArgs = {
  attacker: UnitType;
  defender: UnitType;
  attackerDeck: UnitType[];
  defenderDeck: UnitType[];
  attackerGraveyard: UnitType[];
  defenderGraveyard: UnitType[];
  land: Land;
};

export type EffectMethods = {
  stage: "pre" | "after";
  methodArgs: Record<string, number | string> | undefined;
  method: string;
  explanation: string;
};

export type BattleEvaluationArgs = {
  attacker: UnitType;
  defender: UnitType;
  land: Land;
};

export type KillCardArgs = {
  graveyard: UnitType[];
  deck: UnitType[];
  UnitTypeUserFacing: UnitType;
};

export type EffectNarration = {
  text: string;
  value: number;
  stat: Land | null;
  effect: "buff" | "debuff";
};

export type BattleResult = {
  winner: "attacker" | "defender" | "draw";
  remainingAttackerDeck: UnitTypeSimple[];
  remainingDefenderDeck: UnitTypeSimple[];
  HeroTypeUserFacingCastleNarrations: string[];
  rounds: RoundNarration[];
};
