import {UnitTypeSimple } from "..";
import { EffectNarration } from "./effectUtils";

export type BattleEvaluation = {
  winner: UnitTypeSimple | null;
  loser: UnitTypeSimple | null;
  attacker: UnitTypeSimple;
  defender: UnitTypeSimple;
  text: string;
};
export type RoundNarration = {
  preAttacker: EffectNarration | undefined;
  preDefender: EffectNarration | undefined;
  battle: BattleEvaluation | undefined;
  postAttacker: EffectNarration | undefined;
  postDefender: EffectNarration | undefined;
};
