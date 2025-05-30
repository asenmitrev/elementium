import { describe, it } from "node:test";
import { createHeroType, createUnitType } from "../unitAndHeroGenerationLogic/unitAndHeroGeneration";
import { distributePoints } from "types/battle/distributeEffectPoints";
import assert from "assert";
import { Land, UnitType } from "types";   
import { battle } from "./battle";
import { buyOptions } from "../unitAndHeroGenerationLogic/buyOptions";
import { MethodArgsConfig } from "types/battle/effectUtils";


describe('distributePoints', () => {
    it('should distribute points for all props in method args', () => {
        const result = distributePoints(10, {
            prop1:{
                type:"additive",
                costPerValue:1
            },
            prop2:{
                type:"additive",
                costPerValue:3
            }
            });
        assert(result.effectValueDistribution.prop1 !== undefined, 'value should not be undefined');
        assert(result.effectValueDistribution.prop2 !== undefined, 'value2 should not be undefined');
    }) 
    it('should distribute the correct sum of props', () => {
        // Generate random test parameters
        for (let i = 0; i < 500; i++) {
            const numProps = Math.floor(Math.random() * 4) + 2; // Random number of props (2-5)
            const totalPoints = Math.floor(Math.random() * 50) + 10; // Random points (10-60)
            
            // Generate random props with random costs
            const props: Record<string, { type: "additive", costPerValue: number }> = {};
            for (let j = 1; j <= numProps; j++) {
                props[`prop${j}`] = {
                    type: "additive",
                    costPerValue: Math.floor(Math.random() * 5) + 1 // Random cost (1-5)
                };
            }

            const result = distributePoints(totalPoints, props);
            
            // Calculate total cost
            let totalCost = result.remainderPoints;
            Object.entries(result.effectValueDistribution).forEach(([prop, value]) => {
                totalCost += (value-1) * props[prop].costPerValue;
            });
            
            assert(totalCost === totalPoints, 
                `Test iteration ${i}: Total cost ${totalCost} should equal exactly ${totalPoints} points`);
        }
        for (let i = 0; i < 500; i++) {
            const result = distributePoints(10, {
                prop1: {
                    type: "additive",
                    costPerValue: 1
                },
                prop2: {
                    type: "additive",
                    costPerValue: 3
                }
            });
            
            const totalCost = ((result.effectValueDistribution.prop1 - 1) * 1) + 
                             ((result.effectValueDistribution.prop2-1) * 3) + result.remainderPoints;
            
            assert(totalCost === 10, `Test iteration ${i}: Total cost ${totalCost} should equal exactly 10 points`);
        }
    })
})



describe('Create Unit Type tests', () => {
    it('Check for undefined in special explanations', () => {
        for (let i = 0; i < 500; i++) {
            const unit = createUnitType();
            if (unit.effect?.explanation) {
                assert(!unit.effect?.explanation.includes('undefined'), 
                    `Effect explanation contains 'undefined': ${unit.effect.explanation} ${i}`);
            }
        }
    });
    
    it('Effect method args should have values of 1 or more', () => {
        for (let i = 0; i < 500; i++) {
            const unit = createUnitType();
            if (unit.effect?.methodArgs) {
                Object.entries(unit.effect.methodArgs).forEach(([key, value]) => {
                    if (typeof value === 'number') {
                        assert(value >= 1, 
                            `Effect method arg ${key} should be >= 1, but was ${value} in unit: ${JSON.stringify(unit)}`);
                    } else if (typeof value === 'object' && value !== null && 'value' in value) {
                        assert((value as { value: number }).value >= 1,
                            `Effect method arg ${key}.value should be >= 1, but was ${(value as { value: number }).value} in unit: ${JSON.stringify(unit)}`);
                    }
                });
            }
        }
    });
    it('Check if unit effect has stage property', () => {
        for (let i = 0; i < 500; i++) {
            const unit = createUnitType();
            if (unit.effect) {
                assert(unit.effect.stage !== undefined, 
                    `Unit effect should have a stage property: ${JSON.stringify(unit.effect)} ${i}`);
            }
        }
    });

    it('Check effect explanation does not contain opposite stage text', () => {
        for (let i = 0; i < 500; i++) {
            const unit = createUnitType();
            if (unit.effect) {
                if (unit.effect.stage === 'pre') {
                    assert(!unit.effect.explanation?.includes('After'), 
                        `Pre-battle effect should not contain "After" in explanation: ${unit.effect.explanation} ${i}`);
                }
                if (unit.effect.stage === 'after') {
                    assert(!unit.effect.explanation?.includes('Before'), 
                        `After-battle effect should not contain "Before" in explanation: ${unit.effect.explanation} ${i}`);
                }
            }
        }
    });
});


describe('Create Unit Type tests', () => {
    // ... existing tests ...

    it('Check if effect explanation matches stage', () => {
        for (let i = 0; i < 500; i++) {
            const unit = createUnitType();
            if (unit.effect) {
                if (unit.effect.stage === 'pre') {
                    assert(unit.effect.explanation?.includes('Before the battle'), 
                        `Pre-battle effect should contain "Before the battle" in explanation: ${unit.effect.explanation} ${i}`);
                    assert(!unit.effect.explanation?.includes('After the battle'), 
                        `Pre-battle effect should not contain "After the battle" in explanation: ${unit.effect.explanation} ${i}`);
                }
                if (unit.effect.stage === 'after') {
                    assert(unit.effect.explanation?.includes('After the battle'), 
                        `After-battle effect should contain "After the battle" in explanation: ${unit.effect.explanation} ${i}`);
                    assert(!unit.effect.explanation?.includes('Before the battle'), 
                        `After-battle effect should not contain "Before the battle" in explanation: ${unit.effect.explanation} ${i}`);
                }
            }
        }
    });
});
describe('Battle Effect Tests', () => {
    it('debuffActiveEffect should persist across multiple rounds with multiple units', () => {
        // Create attackers with debuffActiveEffect
        const attacker1: any = {
            name: "Attacker1",
            water: 5,
            earth: 5,
            fire: 5,
            level: 1,
            image: "",
            effect: {
                method: "debuffActiveEffect",
                stage: "pre",
                methodArgs: {
                    land: "water" as Land,
                    value: 1
                },
                explanation: "Before the battle debuff enemy's active stat by 1"
            },
            specialExplanation: "",
            race: undefined,
            evolutions: []
        };

        const attacker2: any = {
            name: "Attacker2",
            water: 6,
            earth: 6,
            fire: 6,
            level: 1,
            image: "",
            effect: null,
            specialExplanation: "",
            race: undefined,
            evolutions: []
        };

        const defender1: any = {
            name: "Defender1",
            water: 5,
            earth: 5,
            fire: 5,
            level: 1,
            image: "",
            effect: null,
            specialExplanation: "",
            race: undefined,
            evolutions: []
        };

        const defender2: any = {
            name: "Defender2",
            water: 7,
            earth: 7,
            fire: 7,
            level: 1,
            image: "",
            effect: null,
            specialExplanation: "",
            race: undefined,
            evolutions: []
        };

        const battleResult = battle({
            attackerDeck: [attacker1, attacker2],
            defenderDeck: [defender1, defender2],
            attackerGraveyard: [],
            defenderGraveyard: [],
            attackerHeroTypeUserFacing: undefined,
            defenderHeroTypeUserFacing: undefined,
            defenderCastle: undefined,
            land: "water"
        });

        // Check first round
        const firstRound = battleResult.rounds[0];
        
        // Verify debuff was applied in preRound state
        assert(firstRound.preRound.defender.water === 4, 
            `First defender's water stat should be decreased to 4, but was ${firstRound.preRound.defender.water}`);
        
        // Verify original stat
        assert(firstRound.startingRound.defender.water === 5, 
            `First defender's original water stat should have been 5, but was ${firstRound.startingRound.defender.water}`);

        // Verify debuff persists after the round
        assert(firstRound.postRound.defender.water === 4, 
            `First defender's water stat should remain at 4 after round, but was ${firstRound.postRound.defender.water}`);

        // Check second round if it exists (when first defender is defeated)
        if (battleResult.rounds.length > 1) {
            const secondRound = battleResult.rounds[1];
            
            // Verify second defender's stats (should not be debuffed as first attacker is defeated)
            assert(secondRound.startingRound.defender.water === 7, 
                `Second defender's water stat should be 7, but was ${secondRound.startingRound.defender.water}`);

            // Verify no debuff is applied to second defender
            assert(secondRound.preRound.defender.water === 7, 
                `Second defender's water stat should remain at 7, but was ${secondRound.preRound.defender.water}`);
        }
    });
});

describe('buyOptions', () => {
    it('should return undefined when points are insufficient for any option combination', () => {
        for (let i = 0; i < 500; i++) {
            // Generate random test parameters
            const points = Math.floor(Math.random() * 3); // 0-2 points
            const numSelectableArgs = Math.floor(Math.random() * 3) + 1; // 1-3 selectable args
            
            // Create method args where minimum cost is always higher than points
            const methodArgs: MethodArgsConfig = {};
            for (let j = 1; j <= numSelectableArgs; j++) {
                methodArgs[`arg${j}`] = {
                    type: "selectable",
                    options: {
                        [`option${j}A`]: {
                            cost: points + 3 // Always more expensive than available points
                        },
                        [`option${j}B`]: {
                            cost: points + 5 // Even more expensive
                        }
                    }
                };
            }

            const result = buyOptions(points, methodArgs);
            
            assert(result === undefined, 
                `Test iteration ${i}: Expected undefined when points=${points} ` +
                `but got ${JSON.stringify(result)}`);
        }
    });


    it('revive effect should place unit back in deck when losing', () => {
        const attacker: any = {
            name: "Attacker",
            water: 3,
            earth: 3,
            fire: 3,
            level: 1,
            image: "",
            effect: {
                method: "revive",
                stage: "after",
                methodArgs: {},
                explanation: "After the battle if you have less power than the enemy place your card at the end of your deck instead of the graveyard but lose this effect for the rest of the battle."
            },
            specialExplanation: "",
            race: undefined,
            evolutions: []
        };

        const defender: any = {
            name: "Defender",
            water: 5,
            earth: 5,
            fire: 5,
            level: 1,
            image: "",
            effect: null,
            specialExplanation: "",
            race: undefined,
            evolutions: []
        };

        const battleResult = battle({
            attackerDeck: [attacker],
            defenderDeck: [defender],
            attackerGraveyard: [],
            defenderGraveyard: [],
            attackerHeroTypeUserFacing: undefined,
            defenderHeroTypeUserFacing: undefined,
            defenderCastle: undefined,
            land: "water"
        });
        const round0 = battleResult.rounds[0];
       // battleResult.rounds[0].postAttacker
        // Check if the unit was revived
        assert(round0.postRound.attackerDeck.length === 1, 
            `Attacker should be placed back in deck, but deck size is ${round0.postRound.attackerDeck.length}`);
    });
});

