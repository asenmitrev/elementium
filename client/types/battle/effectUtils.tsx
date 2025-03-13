import { Land, UnitTypeUserFacing } from "..";


export type RoundArgs = {
    attacker:UnitTypeUserFacing;
    defender:UnitTypeUserFacing;
    attackerDeck:UnitTypeUserFacing[];
    defenderDeck:UnitTypeUserFacing[],
    attackerGraveyard:UnitTypeUserFacing[];
    defenderGraveyard:UnitTypeUserFacing[];
    land : Land;
}

export type EffectMethods = {
    stage: 'pre' | 'after'
    methodArgs: unknown[] | undefined,
    method: string
}

export type BattleEvaluationArgs = {
    attacker:UnitTypeUserFacing;
    defender:UnitTypeUserFacing;
    land: Land;
}



export type KillCardArgs = {
    graveyard:UnitTypeUserFacing[];
    deck:UnitTypeUserFacing[];
    UnitTypeUserFacing:UnitTypeUserFacing
}

export type EffectNarration = {
    text:string;
    value: number;
    stat: Land | null;
    effect: 'buff' | 'debuff';
}