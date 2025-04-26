import { describe, it } from "node:test";
import { createHeroType, createUnitType } from "../unitAndHeroGenerationLogic/unitAndHeroGeneration";
import { distributePoints } from "types/battle/distributeEffectPoints";
import assert from "assert";
import { Land, UnitType } from "types";   
import { battle } from "./battle";


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
                totalCost += value * props[prop].costPerValue;
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
            
            const totalCost = (result.effectValueDistribution.prop1 * 1) + 
                             (result.effectValueDistribution.prop2 * 3) + result.remainderPoints;
            
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
    it('Check if unit effect has stage property', () => {
        for (let i = 0; i < 500; i++) {
            const unit = createUnitType();
            if (unit.effect) {
                assert(unit.effect.stage !== undefined, 
                    `Unit effect should have a stage property: ${JSON.stringify(unit.effect)} ${i}`);
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
    it('buffActiveEffect should persist across multiple rounds with multiple units', () => {
        // Create attackers with buffActiveEffect
        const attacker1: any = {
            name: "Attacker1",
            water: 5,
            earth: 5,
            fire: 5,
            level: 1,
            image: "",
            effect: {
                method: "buffActiveEffect",
                stage: "pre",
                methodArgs: {
                    land: "water" as Land,
                    value: 1
                },
                explanation: "Before the battle buff your active stat by 1"
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
        
        // Verify buff was applied in preRound state
        assert(firstRound.preRound.attacker.water === 6, 
            `First attacker's water stat should be increased to 6, but was ${firstRound.preRound.attacker.water}`);
        
        // Verify original stat
        assert(firstRound.startingRound.attacker.water === 5, 
            `First attacker's original water stat should have been 5, but was ${firstRound.startingRound.attacker.water}`);

        // Verify buff persists after the round
        assert(firstRound.postRound.attacker.water === 6, 
            `First attacker's water stat should remain at 6 after round, but was ${firstRound.postRound.attacker.water}`);

        // Check second round if it exists (when first unit is defeated)
        if (battleResult.rounds.length > 1) {
            const secondRound = battleResult.rounds[1];
            
            // Verify second attacker's stats (should not be buffed as it has no effect)
            assert(secondRound.startingRound.attacker.water === 6, 
                `Second attacker's water stat should be 6, but was ${secondRound.startingRound.attacker.water}`);

            // Verify no buff is applied to second attacker
            assert(secondRound.preRound.attacker.water === 6, 
                `Second attacker's water stat should remain at 6, but was ${secondRound.preRound.attacker.water}`);
        }
    });
});