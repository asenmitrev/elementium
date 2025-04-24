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
  startingRound:{
    attacker: UnitTypeSimple;
    defender: UnitTypeSimple;
  },
  preAttacker: EffectNarration | undefined;
  preDefender: EffectNarration | undefined;
  preRound: {
    attacker: UnitTypeSimple;
    defender: UnitTypeSimple;
  }
  battle: BattleEvaluation | undefined;
  postAttacker: EffectNarration | undefined;
  postDefender: EffectNarration | undefined;
  postRound: {
    attacker: UnitTypeSimple;
    defender: UnitTypeSimple;
  }
};
