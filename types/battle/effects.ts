import { Land, UnitType } from "..";
import { EffectMethods, EffectNarration } from "./effectUtils";

export interface BuffMeEffectMethod extends EffectMethods {
  method: "buffMeEffect";
  methodArgs: [land: Land, value: number];
}

export interface BuffActiveEffectMethod extends EffectMethods {
  merhod: "buffActiveEffect";
  methodArgs: [value: number];
}

export interface DebuffActiveEffectMethod extends EffectMethods {
  method: "debuffActiveEffect";
  methodArgs: [value: number];
}

export interface DebuffEnemyEffectMethod extends EffectMethods {
  method: "debuffEnemyEffect";
  methodArgs: [land: Land, value: number];
}
export interface RemoveEnemyEffectEffectMethod extends EffectMethods {
  method: "removeEnemyEffectEffect";
  methodArgs: [];
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
    enemy[ActiveLand] += methodArgs[0];
    return {
      text: `${enemy.name} got it's ${ActiveLand} stat debuffed by ${methodArgs[0]}.`,
      value: methodArgs[0],
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
    me[ActiveLand] += methodArgs[0];
    return {
      text: `${me.name} got it's ${ActiveLand} stat buffed by ${methodArgs[0]}.`,
      value: methodArgs[0],
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
    me[methodArgs[0]] += methodArgs[1];
    return {
      text: `${me.name} got it's ${methodArgs[0]} stat buffed by ${methodArgs[1]}.`,
      value: methodArgs[1],
      stat: methodArgs[0],
      effect: "buff",
    };
  },
  debuffEnemyEffect: function (
    EMethods: DebuffEnemyEffectMethod,
    generalArguments: GeneralArguments
  ): EffectNarration {
    const { enemy } = generalArguments;
    const methodArgs = EMethods.methodArgs;
    enemy[methodArgs[0]] -= methodArgs[1];
    return {
      text: `${enemy.name} got it's ${methodArgs[0]} stat debuffed by ${methodArgs[1]}.`,
      value: methodArgs[1],
      stat: methodArgs[0],
      effect: "debuff",
    };
  },
};

export const effectCostsDictionary = new Map<
  string,
  { methodArgs: unknown[]; stages: { pre: number; post: number } }
>([
  [
    "removeEnemyEffectEffect",
    {
      methodArgs: [],
      stages: {
        pre: 4,
        post: 0,
      },
    },
  ],
  [
    "debuffActiveEffect",
    {
      methodArgs: [3],
      stages: {
        pre: 3,
        post: 1,
      },
    },
  ],
  [
    "buffActiveEffect",
    {
      methodArgs: [3],
      stages: {
        pre: 3,
        post: 1,
      },
    },
  ],
  [
    "buffMe",
    {
      methodArgs: [0, 2],
      stages: {
        pre: 2,
        post: 0,
      },
    },
  ],
  [
    "debuffEnemy",
    {
      methodArgs: [0, 2],
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
  let remainder = points;
  return {
    remainder: remainder,
    effect: null,
  };
};

export function getRandomEffectCost(): [
  string,
  { methodArgs: unknown[]; stages: { pre: number; post: number } }
] {
  const effects = Array.from(effectCostsDictionary.entries());
  const randomIndex = Math.floor(Math.random() * effects.length);
  return effects[randomIndex];
}
