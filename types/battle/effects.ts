import { Land, UnitType } from "..";
import {
  EffectMethods,
  EffectNarration,
  MethodArgsConfig,
} from "./effectUtils";
import { distributePoints } from "./distributeEffectPoints";
import {
  buyOptions,
  BuyOptionsResult,
} from "../../server/src/unitAndHeroGenerationLogic/buyOptions";
export interface BuffMeEffectMethod extends EffectMethods {
  method: "buffMe";
  methodArgs: { land: Land; value: number };
}

export interface BuffActiveEffectMethod extends EffectMethods {
  merhod: "buffActiveEffect";
  methodArgs: { value: number };
}

export interface DebuffActiveEffectMethod extends EffectMethods {
  method: "debuffActiveEffect";
  methodArgs: { value: number };
}

export interface DebuffEnemyEffectMethod extends EffectMethods {
  method: "debuffEnemyEffect";
  methodArgs: { land: Land; value: number };
}

export interface DebuffNextXCardsMethod extends EffectMethods {
  method: "debuffNextXCards";
  methodArgs: {
    value: number;
    land: Land;
    howManyCards: number;
  };
}

export interface BuffNextXCardsMethod extends EffectMethods {
  method: "debuffNextXCards";
  methodArgs: {
    value: number;
    land: Land;
    howManyCards: number;
  };
}
export interface RemoveEnemyEffectEffectMethod extends EffectMethods {
  method: "removeEnemyEffectEffect";
  methodArgs: {};
}

export interface ReviveEffectMethod extends EffectMethods {
  method: "revive";
  methodArgs: {};
}

export interface DefenderAdvantage extends EffectMethods {
  method: "defenderAdvantage";
  methodArgs: {
    value: number;
  };
}

export interface AttackerAdvantage extends EffectMethods {
  method: "attackerAdvantage";
  methodArgs: {
    value: number;
  };
}

export interface EpicBattle extends EffectMethods {
  method: "epicBattle";
  methodArgs: {
    value: number;
    land: Land | "active";
  };
}

export interface Domination extends EffectMethods {
  method: "domination";
  methodArgs: {
    value: number;
    land: Land | "active";
  };
}

export type EffectMethodMap = {
  removeEnemyEffectEffect: RemoveEnemyEffectEffectMethod;
  debuffActiveEffect: DebuffActiveEffectMethod;
  buffActiveEffect: BuffActiveEffectMethod;
  buffMe: BuffMeEffectMethod;
  debuffEnemyEffect: DebuffEnemyEffectMethod;
};

export type GeneralArguments = {
  me: UnitType;
  enemy: UnitType;
  perspective: "attacker" | "defender";
  ActiveLand: Land;
  myDeck: UnitType[];
  enemyDeck: UnitType[];
};

export type EffectKeys =
  | "removeEnemyEffectEffect"
  | "debuffActiveEffect"
  | "buffActiveEffect"
  | "buffMe"
  | "debuffEnemyEffect"
  | "defenderAdvantage"
  | "attackerAdvantage"
  | "debuffNextXCards"
  | "buffNextXCards"
  | "revive"
  | "epicBattle"
  | "domination";

export const effectExplanations = {
  epicBattle: function (effectMethods: EpicBattle) {
    let narration = "";
    if (effectMethods.stage === "pre") {
      narration += "Before the battle";
    } else {
      narration += "After the battle";
    }
    narration += ` buffs your ${effectMethods.methodArgs.land} stat by ${effectMethods.methodArgs.value} if your army is smaller than the enemies`;

    return narration;
  },
  domination: function (effectMethods: Domination) {
    let narration = "";
    if (effectMethods.stage === "pre") {
      narration += "Before the battle";
    } else {
      narration += "After the battle";
    }
    narration += ` buffs your ${effectMethods.methodArgs.land} stat by ${effectMethods.methodArgs.value} if your army is bigger than the enemies`;

    return narration;
  },
  removeEnemyEffectEffect: function (
    effectMethods: RemoveEnemyEffectEffectMethod
  ) {
    if (effectMethods.stage === "pre") {
      return "Before the battle remove the opponents special effect";
    }
    return "After the battle remove the opponents special effect";
  },
  attackerAdvantage: function (effectMethods: AttackerAdvantage) {
    let narration = "";
    if (effectMethods.stage === "pre") {
      narration += "Before the battle";
    } else {
      narration += "After the battle";
    }
    narration += ` buffs your active stat by ${effectMethods.methodArgs.value} if your are the attacker`;

    return narration;
  },
  debuffActiveEffect: function (effectMethods: DebuffActiveEffectMethod) {
    let narration = "";
    if (effectMethods.stage === "pre") {
      narration += "Before the battle";
    } else {
      narration += "After the battle";
    }
    narration += ` debuff your enemies active stat by ${effectMethods.methodArgs.value}`;

    return narration;
  },
  defenderAdvantage: function (effectMethods: DefenderAdvantage) {
    let narration = "";
    if (effectMethods.stage === "pre") {
      narration += "Before the battle";
    } else {
      narration += "After the battle";
    }
    narration += ` buffs your active stat by ${effectMethods.methodArgs.value} if your are the defender`;

    return narration;
  },
  buffActiveEffect: function (effectMethods: BuffActiveEffectMethod) {
    let narration = "";
    if (effectMethods.stage === "pre") {
      narration += "Before the battle";
    } else {
      narration += "After the battle";
    }
    narration += ` buff your active stat by ${effectMethods.methodArgs.value}`;

    return narration;
  },
  buffMe: function (effectMethods: BuffMeEffectMethod) {
    let narration = "";
    if (effectMethods.stage === "pre") {
      narration += "Before the battle";
    } else {
      narration = "After the battle";
    }
    narration += ` buff your ${effectMethods.methodArgs.land} stat by ${effectMethods.methodArgs.value}`;

    return narration;
  },
  debuffEnemyEffect: function (effectMethods: DebuffEnemyEffectMethod) {
    let narration = "";
    if (effectMethods.stage === "pre") {
      narration += "Before the battle";
    } else {
      narration += "After the battle";
    }
    narration += ` debuff your opponents ${effectMethods.methodArgs.land} stat by ${effectMethods.methodArgs.value}`;

    return narration;
  },
  debuffNextXCards: function (effectMethods: DebuffNextXCardsMethod) {
    let narration = "";
    if (effectMethods.stage === "pre") {
      narration += "Before the battle";
    } else {
      narration += "After the battle";
    }
    narration += ` debuff the next ${effectMethods.methodArgs.howManyCards} cards of your opponents deck by ${effectMethods.methodArgs.value} on their ${effectMethods.methodArgs.land} stat`;

    return narration;
  },
  buffNextXCards: function (effectMethods: DebuffNextXCardsMethod) {
    let narration = "";
    if (effectMethods.stage === "pre") {
      narration += "Before the battle";
    } else {
      narration += "After the battle";
    }
    narration += ` buff the next ${effectMethods.methodArgs.howManyCards} cards of your opponents deck by ${effectMethods.methodArgs.value} on their ${effectMethods.methodArgs.land} stat`;

    return narration;
  },
  revive: function (effectMethods: ReviveEffectMethod) {
    return "After the battle if you have less power than the enemy place your card at the end of your deck instead of the graveyard but lose this effect for the rest of the battle.";
  },
};

export const effectMethods = {
  epicBattle: function (
    EMethods: EpicBattle,
    generalArguments: GeneralArguments
  ) {
    const { myDeck, enemyDeck, me, ActiveLand } = generalArguments;
    if (myDeck.length < enemyDeck.length) {
      if (EMethods.methodArgs.land === "active") {
        me[ActiveLand] += EMethods.methodArgs.value;
      } else {
        me[EMethods.methodArgs.land] += EMethods.methodArgs.value;
      }
      return {
        text: `${me.name} got it's ${EMethods.methodArgs.land} stat buffed by ${EMethods.methodArgs.value}.`,
        value: EMethods.methodArgs.value,
        stat: EMethods.methodArgs.land,
        effect: "buff",
      };
    }
  },
  domination: function (
    EMethods: Domination,
    generalArguments: GeneralArguments
  ) {
    const { myDeck, enemyDeck, me, ActiveLand } = generalArguments;
    if (myDeck.length > enemyDeck.length) {
      if (EMethods.methodArgs.land === "active") {
        me[ActiveLand] += EMethods.methodArgs.value;
      } else {
        me[EMethods.methodArgs.land] += EMethods.methodArgs.value;
      }
      return {
        text: `${me.name} got it's ${EMethods.methodArgs.land} stat buffed by ${EMethods.methodArgs.value}.`,
        value: EMethods.methodArgs.value,
        stat: EMethods.methodArgs.land,
        effect: "buff",
      };
    }
  },
  revive: function (
    EMethods: ReviveEffectMethod,
    generalArguments: GeneralArguments
  ): EffectNarration {
    const { me, myDeck, enemy, ActiveLand } = generalArguments;

    if (me[ActiveLand] <= enemy[ActiveLand]) {
      me[ActiveLand] = enemy[ActiveLand];
      const card: UnitType = { ...me };
      card.effect = null;
      myDeck.push(card);
      return {
        text: `${me.name} revived from the battle.`,
        value: 0,
        stat: null,
        effect: "buff",
      };
    }
    return {
      text: `${me.name}'s effect triggers only if you have less power than your enemy.`,
      value: 0,
      stat: null,
      effect: "buff",
    };
  },
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
  debuffNextXCards: function (
    EMethods: DebuffNextXCardsMethod,
    generalArguments: GeneralArguments
  ): EffectNarration {
    const { enemyDeck } = generalArguments;
    enemyDeck.forEach((card, index) => {
      if (index < EMethods.methodArgs.howManyCards && index > 0) {
        card[EMethods.methodArgs.land] -= EMethods.methodArgs.value;
      }
    });
    return {
      text: `The next ${EMethods.methodArgs.howManyCards} cards of the enemies deck got their ${EMethods.methodArgs.land} stat debuffed by ${EMethods.methodArgs.value}.`,
      value: EMethods.methodArgs.value,
      stat: EMethods.methodArgs.land,
      effect: "debuff",
    };
  },
  buffNextXCards: function (
    EMethods: DebuffNextXCardsMethod,
    generalArguments: GeneralArguments
  ) {
    const { myDeck } = generalArguments;
    myDeck.forEach((card, index) => {
      if (index < EMethods.methodArgs.howManyCards && index > 0) {
        card[EMethods.methodArgs.land] += EMethods.methodArgs.value;
      }
    });
    return {
      text: `The next ${EMethods.methodArgs.howManyCards} cards of your deck got their ${EMethods.methodArgs.land} stat buffed by ${EMethods.methodArgs.value}.`,
      value: EMethods.methodArgs.value,
      stat: EMethods.methodArgs.land,
      effect: "buff",
    };
  },
  attackerAdvantage: function (
    EMethods: AttackerAdvantage,
    generalArguments: GeneralArguments
  ) {
    const { me, perspective, ActiveLand } = generalArguments;
    if (perspective === "attacker") {
      me[ActiveLand] += EMethods.methodArgs.value;
      return {
        text: `${me.name} got it's ${ActiveLand} stat buffed by ${EMethods.methodArgs.value}.`,
        value: EMethods.methodArgs.value,
        stat: ActiveLand,
        effect: "buff",
      };
    }
    return {
      text: `${me.name}'s power works only when you are the attacker`,
      stat: null,
      value: 0,
      effect: "buff",
    };
  },
  defenderAdvantage: function (
    EMethods: DefenderAdvantage,
    generalArguments: GeneralArguments
  ): EffectNarration {
    const { me, perspective, ActiveLand } = generalArguments;
    if (perspective === "defender") {
      me[ActiveLand] += EMethods.methodArgs.value;
      return {
        text: `${me.name} got it's ${ActiveLand} stat buffed by ${EMethods.methodArgs.value}.`,
        value: EMethods.methodArgs.value,
        stat: ActiveLand,
        effect: "buff",
      };
    }
    return {
      text: `${me.name}'s power works only when you are the defender`,
      stat: null,
      value: 0,
      effect: "buff",
    };
  },
  debuffActiveEffect: function (
    EMethods: DebuffActiveEffectMethod,
    generalArguments: GeneralArguments
  ): EffectNarration {
    const { enemy, ActiveLand } = generalArguments;
    const methodArgs = EMethods.methodArgs;
    enemy[ActiveLand] -= methodArgs.value;
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
  buffMe: function (
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
    "epicBattle",
    {
      methodArgs: {
        value: {
          type: "additive",
          costPerValue: 1,
        },
        land: {
          type: "selectable",
          options: {
            active: {
              cost: 2,
            },
            water: {
              cost: 0,
            },
            fire: {
              cost: 0,
            },
            earth: {
              cost: 0,
            },
          },
        },
      },
      stages: {
        pre: 2,
        after: 1,
      },
    },
  ],
  [
    "domination",
    {
      methodArgs: {
        value: {
          type: "additive",
          costPerValue: 1,
        },
        land: {
          type: "selectable",
          options: {
            active: {
              cost: 2,
            },
            water: {
              cost: 0,
            },
            fire: {
              cost: 0,
            },
            earth: {
              cost: 0,
            },
          },
        },
      },
      stages: {
        pre: 2,
        after: 1,
      },
    },
  ],
  [
    "removeEnemyEffectEffect",
    {
      methodArgs: {},
      stages: {
        pre: 5,
        after: 2,
      },
    },
  ],
  [
    "revive",
    {
      methodArgs: {},
      stages: {
        pre: Infinity,
        after: 4,
      },
    },
  ],
  [
    "debuffNextXCards",
    {
      methodArgs: {
        value: {
          type: "additive",
          costPerValue: 3,
        },
        howManyCards: {
          type: "additive",
          costPerValue: 2,
        },
        land: {
          type: "selectable",
          options: {
            water: {
              cost: 0,
            },
            earth: {
              cost: 0,
            },
            fire: {
              cost: 0,
            },
          },
        },
      },
      stages: {
        pre: 5,
        after: 5,
      },
    },
  ],
  [
    "buffNextXCards",
    {
      methodArgs: {
        value: {
          type: "additive",
          costPerValue: 3,
        },
        howManyCards: {
          type: "additive",
          costPerValue: 2,
        },
        land: {
          type: "selectable",
          options: {
            water: {
              cost: 0,
            },
            earth: {
              cost: 0,
            },
            fire: {
              cost: 0,
            },
          },
        },
      },
      stages: {
        pre: 5,
        after: 5,
      },
    },
  ],
  [
    "attackerAdvantage",
    {
      methodArgs: {
        value: {
          type: "additive",
          costPerValue: 2,
        },
      },
      stages: {
        pre: 3,
        after: 2,
      },
    },
  ],
  [
    "defenderAdvantage",
    {
      methodArgs: {
        value: {
          type: "additive",
          costPerValue: 2,
        },
      },
      stages: {
        pre: 3,
        after: 2,
      },
    },
  ],
  [
    "debuffActiveEffect",
    {
      methodArgs: {
        value: {
          type: "additive",
          costPerValue: 3,
        },
      },
      stages: {
        pre: 6,
        after: 4,
      },
    },
  ],
  [
    "buffActiveEffect",
    {
      methodArgs: {
        value: {
          type: "additive",
          costPerValue: 4,
        },
      },
      stages: {
        pre: 6,
        after: 5,
      },
    },
  ],
  [
    "buffMe",
    {
      methodArgs: {
        value: {
          type: "additive",
          costPerValue: 3,
        },
        land: {
          type: "selectable",
          options: {
            water: {
              cost: 0,
            },
            earth: {
              cost: 0,
            },
            fire: {
              cost: 0,
            },
          },
        },
      },
      stages: {
        pre: 5,
        after: 3,
      },
    },
  ],
  [
    "debuffEnemyEffect",
    {
      methodArgs: {
        value: {
          type: "additive",
          costPerValue: 3,
        },
        land: {
          type: "selectable",
          options: {
            water: {
              cost: 0,
            },
            earth: {
              cost: 0,
            },
            fire: {
              cost: 0,
            },
          },
        },
      },
      stages: {
        pre: 5,
        after: 3,
      },
    },
  ],
]);

export const effectGeneration = function (
  points: number,
  effectKeys?: EffectKeys[]
): {
  effect: EffectMethods | null;
  remainder: number;
} {
  const defaultPoints = points;
  const chosenEffect = getRandomEffectCost(effectKeys);
  const possibleStages: Array<"pre" | "after"> = [];
  if (points >= chosenEffect.stages.pre) {
    possibleStages.push("pre");
  }
  if (points >= chosenEffect.stages.after) {
    possibleStages.push("after");
  }
  //Pick stage and pay
  const randomStageIndex = Math.floor(Math.random() * possibleStages.length);
  const chosenStage = possibleStages[randomStageIndex] as "pre" | "after";
 
  if(!chosenStage){
      //vurni ot funkciqta shtoto ne stigat parite
      return {
        remainder: defaultPoints ,
        effect: null,
      };
  }
  points -= chosenEffect.stages[chosenStage];


  let boughtOptions = buyOptions(points, chosenEffect.methodArgs);

  if (boughtOptions === undefined) {
    //vurni ot funkciqta shtoto ne stigat parite
    return {
      remainder: defaultPoints ,
      effect: null,
    };
  }
  //Pick options and pay
  const { selectedOptionsRecord, remainingPoints } = buyOptions(
    points,
    chosenEffect.methodArgs
  ) as BuyOptionsResult;

  const { remainderPoints, effectValueDistribution } = distributePoints(
    remainingPoints,
    chosenEffect.methodArgs
  );

  const combinedMethodArgs = {
    ...selectedOptionsRecord,
    ...effectValueDistribution,
  };

  return {
    remainder: remainderPoints,
    effect: {
      stage: chosenStage,
      method: chosenEffect.key,
      methodArgs: combinedMethodArgs,
      explanation: effectExplanations[
        chosenEffect.key as keyof typeof effectExplanations
      ]({ ...chosenEffect, methodArgs: combinedMethodArgs, stage:chosenStage } as any) as string,
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
export function getRandomEffectCost(effectKeys?: EffectKeys[]): {
  methodArgs: MethodArgsConfig;
  key: EffectKeys;
  stages: { pre: number; after: number };
} {
  if (effectKeys) {
    const randomEl = effectKeys[Math.floor(Math.random() * effectKeys.length)];
    const effectData = effectCostsDictionary.get(randomEl);
    return {
      key: randomEl,
      methodArgs: effectData?.methodArgs,
      stages: effectData?.stages,
    } as {
      methodArgs: MethodArgsConfig;
      key: EffectKeys;
      stages: { pre: number; after: number };
    };
    return effectCostsDictionary.get(randomEl) as {
      methodArgs: MethodArgsConfig;
      key: EffectKeys;
      stages: { pre: number; after: number };
    };
  }

  const effects = Array.from(effectCostsDictionary.entries());
  const randomIndex = Math.floor(Math.random() * effects.length);
  const [key, { methodArgs, stages }] = effects[randomIndex];

  return { key, methodArgs, stages };
}

getRandomEffectCost();
