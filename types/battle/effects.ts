import { Land, UnitType } from "..";
import { EffectMethods, EffectNarration, MethodArgsConfig } from "./effectUtils";
import { distributePoints } from "./distributeEffectPoints";
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
  string,
  { methodArgs: MethodArgsConfig; stages: { pre: number; post: number } }
>([
  [
    "removeEnemyEffectEffect",
    {
      methodArgs: {},
      stages: {
        pre: 4,
        post: 0,
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
        post: 1,
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
        post: 1,
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
        post: 0,
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
        post: 0,
      },
    },
  ],
]);

export const effectGeneration = function (points: number): {
  effect: EffectMethods | null;
  remainder: number;
} {
  let chosenEffect = getRandomEffectCost();
  let possibleStages = [];
  if(points >= chosenEffect.stages.pre){
    possibleStages.push('pre');
  }
  if(points>= chosenEffect.stages.post){
    possibleStages.push('post');
  }

  const randomStageIndex = Math.floor(Math.random() * possibleStages.length);
  const chosenStage = possibleStages[randomStageIndex] as 'pre' | 'post';
  points -= chosenEffect.stages[chosenStage];
  const {remainderPoints, effectValueDistribution  } = distributePoints(
    points,
    chosenEffect.methodArgs
  );

  console.log(JSON.stringify(effectValueDistribution), chosenStage, chosenEffect.key);
  
  return {
    remainder: remainderPoints,
    effect: null,
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
export function getRandomEffectCost(): { methodArgs: MethodArgsConfig; key: string, stages: { pre: number; post: number } } {
  const effects = Array.from(effectCostsDictionary.entries());
  const randomIndex = Math.floor(Math.random() * effects.length);
  const [key, { methodArgs, stages }] = effects[randomIndex];
  return { key, methodArgs, stages };
}

effectGeneration(20)