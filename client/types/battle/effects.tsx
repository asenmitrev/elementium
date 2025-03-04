import { Land } from ".."
import { EffectMethods, EffectNarration } from "./effectUtils"


export type BuffMeEffectMethod = EffectMethods  & {
    methodArgs:[
        land:Land,
        value:number
    ]
}

export type BuffActiveEffectMethod = EffectMethods  & {methodArgs:[
    value:number
]}

export type DebuffActiveEffectMethod = EffectMethods  & {methodArgs:[
    value:number
]}

export type DebuffEnemyEffectMethod = EffectMethods  & {methodArgs:[
    land:Land,
    value:number
] }

export type RemoveEnemyEffectEffectMethod = EffectMethods  & {methodArgs:[]}


export const priceEffectMethods = {
    
}

export const effectMethods = {
    removeEnemyEffectEffect: function(EffectMethods: RemoveEnemyEffectEffectMethod):EffectNarration {
        const me=  EffectMethods.me;
        const enemy=  EffectMethods.enemy;
        enemy.effect = null;
        return {
         text:`${me.name} removed ${enemy.name}'s special effect.`,
         stat:null,
         value:0,
         effect:'debuff'
        } 
    },
    debuffActiveEffect: function(EffectMethods: DebuffActiveEffectMethod):EffectNarration {
        const enemy=  EffectMethods.enemy;
        const methodArgs = EffectMethods.methodArgs;
        enemy[EffectMethods.activeLand]+=methodArgs[0];
        return {
         text:`${enemy.name} got it's ${EffectMethods.activeLand} stat debuffed by ${methodArgs[0]}.`,
         value:methodArgs[0],
         stat: EffectMethods.activeLand,
         effect:'debuff'
        } 
    },
    buffActiveEffect: function(EffectMethods: BuffActiveEffectMethod):EffectNarration {
        const me=  EffectMethods.me;
        const methodArgs = EffectMethods.methodArgs;
        me[EffectMethods.activeLand]+=methodArgs[0];
        return {
         text:`${me.name} got it's ${EffectMethods.activeLand} stat buffed by ${methodArgs[0]}.`,
         value:methodArgs[0],
         stat: EffectMethods.activeLand,
         effect:'buff'
        } 
    },
    buffMe: function(EffectMethods:BuffMeEffectMethod):EffectNarration{
        const me=  EffectMethods.me;
        const methodArgs = EffectMethods.methodArgs;
        me[methodArgs[0]]+=methodArgs[1];
        return {
         text:`${me.name} got it's ${methodArgs[0]} stat buffed by ${methodArgs[1]}.`,
         value:methodArgs[1],
         stat: methodArgs[0],
         effect:'buff'
        }
    },
    debuffEnemy: function(EffectMethods:DebuffEnemyEffectMethod):EffectNarration{
        const enemy=  EffectMethods.enemy;
        const methodArgs = EffectMethods.methodArgs;
        enemy[methodArgs[0]]-=methodArgs[1];
        return {
         text:`${enemy.name} got it's ${methodArgs[0]} stat debuffed by ${methodArgs[1]}.`,
         value:methodArgs[1],
         stat: methodArgs[0],
         effect: 'debuff'
        }
    }
}