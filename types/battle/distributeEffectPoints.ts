import {AdditiveArg, MethodArgsConfig, MethodArgument, SelectableArg } from "./effectUtils";
/*
Example

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

export function distributePoints(points:number, methodArgs:MethodArgsConfig):{remainderPoints:number, effectValueDistribution:Record<string, number>} {
    // Create a copy of the points to avoid modifying the original value
    let remainingPoints = points;

    // Initialize the effectValueDistribution object
    const effectValueDistribution:Record<string, number> = {};

    // Create an array of methodArgs keys
    let args = Object.keys(methodArgs);

    let smallestCost = Infinity;
    args.forEach((arg:string) => {
        const methodArgument:MethodArgument = methodArgs[arg];
        if(methodArgument.type === 'additive'){
            if(smallestCost >methodArgument.costPerValue){
                smallestCost = methodArgument.costPerValue;
            }
        }

    })
    
    // Shuffle the array of methodArgs keys to introduce randomness
    for (let i = args.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [args[i], args[j]] = [args[j], args[i]];
    }

    
    
    //while(remainingPoints >= smallestCost && remainingPoints !== 0 && args.length >0){
        // Iterate over the shuffled methodArgs
        // console.log(remainingPoints, smallestCost)
        args = args.filter((arg) => {
            if(methodArgs[arg].type === 'additive'){
                return (methodArgs[arg] as AdditiveArg).costPerValue <= remainingPoints;
            }
        })
        for (const arg of args) {
            // Calculate the maximum number of values that can be bought for the current argument
            const maxValues = Math.floor(remainingPoints / (methodArgs[arg] as AdditiveArg).costPerValue);

            // If maxValues is 0, skip this argument
            if (maxValues === 0) {
                effectValueDistribution[arg] = 0;
                continue;
            }

            // Randomly choose a number of values between 1 and maxValues
            const chosenValues = Math.floor(Math.random() * maxValues) + 1;

            // Update the effectValueDistribution object
            effectValueDistribution[arg] = chosenValues;

            // Update the remaining points
            remainingPoints -= chosenValues * (methodArgs[arg] as AdditiveArg).costPerValue;
        }
    //}

    Object.keys(methodArgs).forEach((arg) => {
        if(!effectValueDistribution[arg] && methodArgs[arg].type === 'additive'){
            effectValueDistribution[arg] = 0;
        } 
    })

    Object.keys(methodArgs).forEach((arg) => {
        if(!effectValueDistribution[arg] && methodArgs[arg].type === 'additive'){
            effectValueDistribution[arg]++;
        } 
    })

    // Return the effectValueDistribution object and the remaining points
    return {
        effectValueDistribution,
        remainderPoints: remainingPoints
    };
}