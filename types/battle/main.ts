import { UnitTypeUserFacing } from ".."
import { EffectNarration } from "./effectUtils"

export type BattleEvaluation = {
    winner:UnitTypeUserFacing | null,
    text: string
}
export type RoundNarration = {
    preAttacker: EffectNarration | undefined,
    preDefender: EffectNarration | undefined,
    battle: BattleEvaluation | undefined,
    postAttacker: EffectNarration | undefined,
    postDefender: EffectNarration | undefined
}
