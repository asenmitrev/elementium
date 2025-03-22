"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.effectGeneration = exports.effectCostsDictionary = exports.effectMethods = void 0;
exports.getRandomEffectCost = getRandomEffectCost;
var distributeEffectPoints_1 = require("./distributeEffectPoints");
var buyOptions_1 = require("../../server/src/unitAndHeroGenerationLogic/buyOptions");
exports.effectMethods = {
    removeEnemyEffectEffect: function (EMethods, generalArguments) {
        var me = generalArguments.me, enemy = generalArguments.enemy;
        enemy.effect = null;
        return {
            text: "".concat(me.name, " removed ").concat(enemy.name, "'s special effect."),
            stat: null,
            value: 0,
            effect: "debuff",
        };
    },
    debuffActiveEffect: function (EMethods, generalArguments) {
        var enemy = generalArguments.enemy, ActiveLand = generalArguments.ActiveLand;
        var methodArgs = EMethods.methodArgs;
        enemy[ActiveLand] += methodArgs.value;
        return {
            text: "".concat(enemy.name, " got it's ").concat(ActiveLand, " stat debuffed by ").concat(methodArgs.value, "."),
            value: methodArgs.value,
            stat: ActiveLand,
            effect: "debuff",
        };
    },
    buffActiveEffect: function (EMethods, generalArguments) {
        var me = generalArguments.me, ActiveLand = generalArguments.ActiveLand;
        var methodArgs = EMethods.methodArgs;
        me[ActiveLand] += methodArgs.value;
        return {
            text: "".concat(me.name, " got it's ").concat(ActiveLand, " stat buffed by ").concat(methodArgs.value, "."),
            value: methodArgs.value,
            stat: ActiveLand,
            effect: "buff",
        };
    },
    buffMeEffect: function (EMethods, generalArguments) {
        var me = generalArguments.me;
        var methodArgs = EMethods.methodArgs;
        me[methodArgs.land] += methodArgs.value;
        return {
            text: "".concat(me.name, " got it's ").concat(methodArgs.land, " stat buffed by ").concat(methodArgs.value, "."),
            value: methodArgs.value,
            stat: methodArgs.land,
            effect: "buff",
        };
    },
    debuffEnemyEffect: function (EMethods, generalArguments) {
        var enemy = generalArguments.enemy;
        var methodArgs = EMethods.methodArgs;
        enemy[methodArgs.land] -= methodArgs.value;
        return {
            text: "".concat(enemy.name, " got it's ").concat(methodArgs.land, " stat debuffed by ").concat(methodArgs.value, "."),
            value: methodArgs.value,
            stat: methodArgs.land,
            effect: "debuff",
        };
    },
};
exports.effectCostsDictionary = new Map([
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
                value: {
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
                value: {
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
                value: {
                    type: "additive",
                    costPerValue: 2
                },
                land: {
                    type: "selectable",
                    options: {
                        water: {
                            cost: 0
                        },
                        earth: {
                            cost: 0
                        },
                        fire: {
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
                value: {
                    type: "additive",
                    costPerValue: 2
                },
                land: {
                    type: "selectable",
                    options: {
                        water: {
                            cost: 0
                        },
                        earth: {
                            cost: 0
                        },
                        fire: {
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
var effectGeneration = function (points) {
    var chosenEffect = getRandomEffectCost();
    var possibleStages = [];
    if (points >= chosenEffect.stages.pre) {
        possibleStages.push('pre');
    }
    if (points >= chosenEffect.stages.after) {
        possibleStages.push('after');
    }
    //Pick stage and pay
    var randomStageIndex = Math.floor(Math.random() * possibleStages.length);
    var chosenStage = possibleStages[randomStageIndex];
    points -= chosenEffect.stages[chosenStage];
    var boughtOptions = (0, buyOptions_1.buyOptions)(points, chosenEffect.methodArgs);
    if (boughtOptions === undefined) {
        //vurni ot funkciqta shtoto ne stigat parite
        return {
            remainder: points,
            effect: null
        };
    }
    //Pick options and pay
    var _a = (0, buyOptions_1.buyOptions)(points, chosenEffect.methodArgs), selectedOptionsRecord = _a.selectedOptionsRecord, remainingPoints = _a.remainingPoints;
    var _b = (0, distributeEffectPoints_1.distributePoints)(remainingPoints, chosenEffect.methodArgs), remainderPoints = _b.remainderPoints, effectValueDistribution = _b.effectValueDistribution;
    var combinedMethodArgs = __assign(__assign({}, selectedOptionsRecord), effectValueDistribution);
    console.log(JSON.stringify(effectValueDistribution), chosenStage, chosenEffect.key);
    return {
        remainder: remainderPoints,
        effect: {
            stage: chosenStage,
            method: chosenEffect.key,
            methodArgs: combinedMethodArgs,
        },
    };
};
exports.effectGeneration = effectGeneration;
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
function getRandomEffectCost() {
    var effects = Array.from(exports.effectCostsDictionary.entries());
    var randomIndex = Math.floor(Math.random() * effects.length);
    var _a = effects[randomIndex], key = _a[0], _b = _a[1], methodArgs = _b.methodArgs, stages = _b.stages;
    return { key: key, methodArgs: methodArgs, stages: stages };
}
(0, exports.effectGeneration)(20);
