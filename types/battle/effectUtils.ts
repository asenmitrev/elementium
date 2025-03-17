import { Land, UnitType } from "..";

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
  methodArgs: unknown[] | undefined;
  method: string;
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
