import { UnitType } from "..";
import { EffectNarration } from "./effectUtils";

export type BattleEvaluation = {
  winner: UnitType | null;
  text: string;
};
export type RoundNarration = {
  preAttacker: EffectNarration | undefined;
  preDefender: EffectNarration | undefined;
  battle: BattleEvaluation | undefined;
  postAttacker: EffectNarration | undefined;
  postDefender: EffectNarration | undefined;
};
