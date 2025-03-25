import { Land, UnitType } from "..";
import { EffectMethods, EffectNarration, MethodArgsConfig } from "./effectUtils";
import { distributePoints } from "./distributeEffectPoints";
import { buyOptions, BuyOptionsResult } from "../../server/src/unitAndHeroGenerationLogic/buyOptions";
export interface BuffMeEffectMethod extends EffectMethods {
  method: "buffMeEffect";
  methodArgs: {land: Land, value: number};
}

export interface BuffActiveEffectMethod extends EffectMethods {
  merhod: "buffActiveEffect";
  methodArgs: {value: number};
}

export interface DebuffActiveEffectMethod extends EffectMethods {
  method: "debuffActiveEffect";
  methodArgs: {value: number};
}

export interface DebuffEnemyEffectMethod extends EffectMethods {
  method: "debuffEnemyEffect";
  methodArgs: {land: Land, value: number};
}
export interface RemoveEnemyEffectEffectMethod extends EffectMethods {
  method: "removeEnemyEffectEffect";
  methodArgs: {};
}

export type EffectMethodMap = {
  removeEnemyEffectEffect: RemoveEnemyEffectEffectMethod;
  debuffActiveEffect: DebuffActiveEffectMethod;
  buffActiveEffect: BuffActiveEffectMethod;
  buffMeEffect: BuffMeEffectMethod;
  debuffEnemyEffect: DebuffEnemyEffectMethod;
};

export type GeneralArguments = {
  me: UnitType;
  enemy: UnitType;
  perspective: "attacker" | "defender";
  ActiveLand: Land;
};

export type EffectKeys = "removeEnemyEffectEffect" | "debuffActiveEffect" | "buffActiveEffect" | "buffMe" | "debuffEnemy"

export const effectExplanations = {
  removeEnemyEffectEffect: function(effectMethods:RemoveEnemyEffectEffectMethod){
    if (effectMethods.stage === 'pre'){
      return {
        text: "Before the battle remove the opponents special effect",
      }
    }
    return {
      text: "After the battle remove the opponents special effect",
    }
  },
  debuffActiveEffect: function(effectMethods: DebuffEnemyEffectMethod){
    let narration = ''
    if (effectMethods.stage === 'pre'){
      narration+= "Before the battle"
    }
    else{
      narration+= "After the battle"
    }
    narration+= ` debuff your active effect by ${effectMethods.methodArgs.value}`

    return this.debuffActiveEffect;
  },
  buffActiveEffect: function(effectMethods: BuffActiveEffectMethod){
    let narration = ''
    if (effectMethods.stage === 'pre'){
      narration+= "Before the battle"
    }
    else{
      narration+= "After the battle"
    }
    narration+= ` buff your active stat by ${effectMethods.methodArgs.value}`

    return narration;
  },
  buffMeEffect: function(effectMethods: BuffMeEffectMethod){
    let narration = ''
    if (effectMethods.stage === 'pre'){
      narration+= "Before the battle"
    }
    else{
      narration+= "After the battle"
    }
    narration+= ` buff your ${effectMethods.methodArgs.land} stat by ${effectMethods.methodArgs.value}`

    return narration;
  },
  debuffEnemyEffect: function(effectMethods: DebuffEnemyEffectMethod){
    let narration = ''
    if (effectMethods.stage === 'pre'){
      narration+= "Before the battle"
    }
    else{
      narration+= "After the battle"
    } 
    narration+= ` debuff your opponents ${effectMethods.methodArgs.land} stat by ${effectMethods.methodArgs.value}`

    return narration;
  },
}

export const effectMethods = {
  removeEnemyEffectEffect: function (
    EMethods: RemoveEnemyEffectEffectMethod,
    generalArguments: GeneralArguments
  ): EffectNarration {
    const { me, enemy } = generalArguments;
    enemy.effect = null;
    return {
      text: `${me.name} removed ${enemy.name}'s special effect.`,
      stat: null,
      value: 0,
      effect: "debuff",
    };
  },
  debuffActiveEffect: function (
    EMethods: DebuffActiveEffectMethod,
    generalArguments: GeneralArguments
  ): EffectNarration {
    const { enemy, ActiveLand } = generalArguments;
    const methodArgs = EMethods.methodArgs;
    enemy[ActiveLand] += methodArgs.value;
    return {
      text: `${enemy.name} got it's ${ActiveLand} stat debuffed by ${methodArgs.value}.`,
      value: methodArgs.value,
      stat: ActiveLand,
      effect: "debuff",
    };
  },
  buffActiveEffect: function (
    EMethods: BuffActiveEffectMethod,
    generalArguments: GeneralArguments
  ): EffectNarration {
    const { me, ActiveLand } = generalArguments;
    const methodArgs = EMethods.methodArgs;
    me[ActiveLand] += methodArgs.value;
    return {
      text: `${me.name} got it's ${ActiveLand} stat buffed by ${methodArgs.value}.`,
      value: methodArgs.value,
      stat: ActiveLand,
      effect: "buff",
    };
  },
  buffMeEffect: function (
    EMethods: BuffMeEffectMethod,
    generalArguments: GeneralArguments
  ): EffectNarration {
    const { me } = generalArguments;
    const methodArgs = EMethods.methodArgs;
    me[methodArgs.land] += methodArgs.value;
    return {
      text: `${me.name} got it's ${methodArgs.land} stat buffed by ${methodArgs.value}.`,
      value: methodArgs.value,
      stat: methodArgs.land,
      effect: "buff",
    };
  },
  debuffEnemyEffect: function (
    EMethods: DebuffEnemyEffectMethod,
    generalArguments: GeneralArguments
  ): EffectNarration {
    const { enemy } = generalArguments;
    const methodArgs = EMethods.methodArgs;
    enemy[methodArgs.land] -= methodArgs.value;
    return {
      text: `${enemy.name} got it's ${methodArgs.land} stat debuffed by ${methodArgs.value}.`,
      value: methodArgs.value,
      stat: methodArgs.land,
      effect: "debuff",
    };
  },
};

export const effectCostsDictionary = new Map<
  EffectKeys,
  { methodArgs: MethodArgsConfig; stages: { pre: number; after: number } }
>([
  [
    "removeEnemyEffectEffect",
    {
      methodArgs: {},
      stages: {
        pre: 4,
        after: 0,
      },
    },
  ],
  [
    "debuffActiveEffect",
    {
      methodArgs: {
        value:{
          type: "additive",
          costPerValue: 3
        }
      },
      stages: {
        pre: 3,
        after: 1,
      },
    },
  ],
  [
    "buffActiveEffect",
    {
      methodArgs: {
        value:{
          type: "additive",
          costPerValue: 3
        }
      },
      stages: {
        pre: 3,
        after: 1,
      },
    },
  ],
  [
    "buffMe",
    {
      methodArgs: {
        value:{
          type: "additive",
          costPerValue: 2
        },
        land:{
          type:"selectable",
          options:{
            water:{
              cost: 0
            },
            earth:{
              cost: 0
            },
            fire:{
              cost: 0
            }
          }
        }
      },
      stages: {
        pre: 2,
        after: 0,
      },
    },
  ],
  [
    "debuffEnemy",
    {
      methodArgs: {
        value:{
          type: "additive",
          costPerValue: 2
        },
        land:{
          type:"selectable",
          options:{
            water:{
              cost: 0
            },
            earth:{
              cost: 0
            },
            fire:{
              cost: 0
            }
          }
        }
      },
      stages: {
        pre: 2,
        after: 0,
      },
    },
  ],
]);

export const effectGeneration = function (points: number): {
  effect: EffectMethods | null;
  remainder: number;
} {
  let chosenEffect = getRandomEffectCost();
  let possibleStages: Array<'pre' | 'after'> = [];
  if(points >= chosenEffect.stages.pre){
    possibleStages.push('pre');
  }
  if(points>= chosenEffect.stages.after){
    possibleStages.push('after');
  }

  //Pick stage and pay
  const randomStageIndex = Math.floor(Math.random() * possibleStages.length);
  const chosenStage = possibleStages[randomStageIndex] as 'pre' | 'after';
  points -= chosenEffect.stages[chosenStage];

  

  let boughtOptions = buyOptions(points, chosenEffect.methodArgs);

  if(boughtOptions === undefined){
    //vurni ot funkciqta shtoto ne stigat parite
    return {
      remainder: points,
      effect: null
    };
  }
  //Pick options and pay
  const {selectedOptionsRecord, remainingPoints} = buyOptions(points, chosenEffect.methodArgs) as BuyOptionsResult;


  const {remainderPoints, effectValueDistribution  } = distributePoints(
    remainingPoints,
    chosenEffect.methodArgs
  );

const combinedMethodArgs = {
  ...selectedOptionsRecord,
  ...effectValueDistribution
};

  
  return {
    remainder: remainderPoints,
    effect: {
      stage: chosenStage,
      method: chosenEffect.key,
      methodArgs: combinedMethodArgs,
      explanation: effectExplanations[chosenEffect.key as keyof typeof effectExplanations](combinedMethodArgs as any) as string
    },
  };
};

/*

const methodArgs = {
    "arg1": {
        "type": "additive",
        "costPerValue": 8
    },
    "arg2": {
        "type": "additive",
        "costPerValue": 3
    },

    "arg3": {
        "type": "selectable",
        "options": {
            "option1": {
                "cost": 5
            },
            "option2": {
                "cost": 10
                } 
        }
};
*/
export function getRandomEffectCost(): { methodArgs: MethodArgsConfig; key: EffectKeys, stages: { pre: number; after: number } } {
  const effects = Array.from(effectCostsDictionary.entries());
  const randomIndex = Math.floor(Math.random() * effects.length);
  const [key, { methodArgs, stages }] = effects[randomIndex];
  return { key, methodArgs, stages };
}

effectGeneration(20)