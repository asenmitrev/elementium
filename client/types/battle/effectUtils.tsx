import { Land, UnitTypeUserFacing } from "..";

export type Effect = {
    method:string;
    args:unknown[];
    stage:'pre'|'after';
}

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
    me:UnitTypeUserFacing,
    enemy:UnitTypeUserFacing,
    perspective:'attacker' | 'defender',
    activeLand: Land,
    args: RoundArgs,
    methodArgs: unknown[] | undefined
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