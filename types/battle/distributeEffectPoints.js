"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributePoints = distributePoints;
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
function distributePoints(points, methodArgs) {
    var _a;
    // Create a copy of the points to avoid modifying the original value
    var remainingPoints = points;
    // Initialize the effectValueDistribution object
    var effectValueDistribution = {};
    // Create an array of methodArgs keys
    var args = Object.keys(methodArgs);
    var smallestCost = Infinity;
    args.forEach(function (arg) {
        var methodArgument = methodArgs[arg];
        if (methodArgument.type === 'additive') {
            if (smallestCost > methodArgument.costPerValue) {
                smallestCost = methodArgument.costPerValue;
            }
        }
    });
    // Shuffle the array of methodArgs keys to introduce randomness
    for (var i = args.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [args[j], args[i]], args[i] = _a[0], args[j] = _a[1];
    }
    while (remainingPoints >= smallestCost && remainingPoints !== 0 && args.length > 0) {
        // Iterate over the shuffled methodArgs
        // console.log(remainingPoints, smallestCost)
        args = args.filter(function (arg) {
            if (methodArgs[arg].type === 'additive') {
                return methodArgs[arg].costPerValue <= remainingPoints;
            }
        });
        for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
            var arg = args_1[_i];
            // Calculate the maximum number of values that can be bought for the current argument
            var maxValues = Math.floor(remainingPoints / methodArgs[arg].costPerValue);
            // If maxValues is 0, skip this argument
            if (maxValues === 0) {
                effectValueDistribution[arg] = 0;
                continue;
            }
            // Randomly choose a number of values between 1 and maxValues
            var chosenValues = Math.floor(Math.random() * maxValues) + 1;
            // Update the effectValueDistribution object
            effectValueDistribution[arg] = chosenValues;
            // Update the remaining points
            remainingPoints -= chosenValues * methodArgs[arg].costPerValue;
        }
    }
    // Return the effectValueDistribution object and the remaining points
    return {
        effectValueDistribution: effectValueDistribution,
        remainderPoints: remainingPoints
    };
}
