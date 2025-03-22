"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyOptions = buyOptions;
function buyOptions(points, methodArgs) {
    var remainingPoints = points;
    //Filter all non additive
    var filteredArgs = Object.keys(methodArgs).filter(function (arg) {
        return methodArgs[arg].type !== 'additive';
    });
    //Find the cheapest possible option to make sure it is bellow the remaining points
    var cheapestCost = 0;
    var cheapestOptions = [];
    var cheapestOptionsKeys = [];
    filteredArgs.forEach(function (arg) {
        var theArg = methodArgs[arg];
        var options = Object.keys(theArg.options);
        var findCheapestOption = Infinity;
        var cheapest = null;
        var cheapestKey = null;
        options.forEach(function (option) {
            if (theArg.options[option].cost < findCheapestOption) {
                findCheapestOption = theArg.options[option].cost;
                cheapest = theArg.options[option];
                cheapestKey = option;
            }
        });
        cheapestCost += findCheapestOption;
        if (cheapest !== null && cheapestKey !== null) {
            cheapestOptions.push(cheapest);
            cheapestOptionsKeys.push(cheapestKey);
        }
    });
    if (points < cheapestCost) {
        console.log("You can't afford any full set of args");
        return undefined;
    }
    //Attempt 10 times to find random set of options that fits the price.
    var maxCounterForRandom = 10;
    var mainSelectedOption = null;
    var mainSelectedOptionKeys = null;
    var _loop_1 = function () {
        var tempPoints = points;
        var tempBoughtOptions = [];
        var tempBoughtOptionKeys = [];
        filteredArgs.forEach(function (arg, index) {
            var theArg = methodArgs[arg];
            var options = Object.keys(theArg.options);
            var selectedOptionKey = options[Math.floor(Math.random() * options.length)];
            // Randomly select an option
            var selectedOption = theArg.options[selectedOptionKey];
            //If the cost is bigger than the tempPoints go to next attempt
            if (selectedOption.cost > tempPoints) {
                maxCounterForRandom++;
                return;
            }
            //Else remove the cost from the tempPoints and add into the temporary bought options
            else {
                tempPoints -= selectedOption.cost;
                tempBoughtOptions.push(selectedOption);
                tempBoughtOptionKeys.push(selectedOptionKey);
                if (index === filteredArgs.length - 1) {
                    mainSelectedOption = tempBoughtOptions;
                    remainingPoints = tempPoints;
                    mainSelectedOptionKeys = tempBoughtOptionKeys;
                    return;
                }
            }
        });
    };
    while (maxCounterForRandom > 0 && mainSelectedOption === null) {
        _loop_1();
    }
    if (mainSelectedOption === null) {
        mainSelectedOption = cheapestOptions;
        cheapestOptions.forEach(function (option) {
            remainingPoints -= option.cost;
        });
        mainSelectedOptionKeys = cheapestOptionsKeys;
    }
    var theRecord = {};
    filteredArgs.forEach(function (arg, index) {
        if (mainSelectedOptionKeys) {
            theRecord[arg] = mainSelectedOptionKeys[index];
        }
    });
    return {
        selectedOptions: mainSelectedOption,
        remainingPoints: remainingPoints,
        selectedOptionKeys: mainSelectedOptionKeys,
        selectedOptionsRecord: theRecord
    };
}
// Example usage
var methodArgs = {
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
    },
    "arg4": {
        "type": "selectable",
        "options": {
            "optionA": {
                "cost": 3
            },
            "optionB": {
                "cost": 7
            }
        }
    }
};
var points = 20;
var result = buyOptions(points, methodArgs);
