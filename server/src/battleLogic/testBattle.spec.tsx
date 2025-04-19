import { describe, it } from "node:test";
import { createHeroType, createUnitType } from "../unitAndHeroGenerationLogic/unitAndHeroGeneration";
import { distributePoints } from "types/battle/distributeEffectPoints";
import assert from "assert";


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
                    `Effect explanation contains 'undefined': ${unit.effect.explanation}`);
            }
        }
    });
});
