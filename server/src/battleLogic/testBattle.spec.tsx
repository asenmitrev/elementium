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
        console.log(result)
    }) 
    it('should distribute the correct sum of props', () => {
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
