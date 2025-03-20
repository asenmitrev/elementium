function buyOptions(points, methodArgs){
    const boughtOptions = {};
    let remainingPoints = points;
    const possibleCombinations = [];
    //Filter all non additive
    const filteredArgs = Object.keys(methodArgs).filter((arg) => {
        return methodArgs[arg].type !== 'additive'
    })

    //Find the cheapest possible option to make sure it is bellow the remaining points

    let cheapestCost = 0;
    const cheapestOptions = []

    filteredArgs.forEach((arg) =>{
        const options = Object.keys(methodArgs[arg].options);
        let findCheapestOption = Infinity;
        let cheapest = null;
        options.forEach((option) => {
            if(methodArgs[arg].options[option].cost < findCheapestOption){
                findCheapestOption = methodArgs[arg].options[option].cost;
                cheapest = methodArgs[arg].options[option]
            }
        })
        cheapestCost+= findCheapestOption
        cheapestOptions.push(cheapest)
    })

    if(points<cheapestCost){
        console.log("You can't afford any full set of args");
        return;
    }
    //Attempt 10 times to find random set of options that fits the price.

    let maxCounterForRandom = 10;
    let possibleOptionFound = false;
    let mainSelectedOption = null;
    while(maxCounterForRandom > 0 && mainSelectedOption === null ){
        let tempPoints = points;
        let tempBoughtOptions = [];
        filteredArgs.forEach((arg, index) => {
            const options = Object.keys(methodArgs[arg].options);

            // Randomly select an option
            const selectedOption =  methodArgs[arg].options[options[Math.floor(Math.random() * options.length)]];
            //If the cost is bigger than the tempPoints go to next attempt
            if(selectedOption.cost > tempPoints){
                maxCounterForRandom++;
                return;
            }
            //Else remove the cost from the tempPoints and add into the temporary bought options
            else{
                tempPoints-=selectedOption.cost;
                tempBoughtOptions.push(selectedOption);
                if(index === filteredArgs.length - 1){
                    mainSelectedOption = tempBoughtOptions;
                    return
                }
            }
        })
    }
    if(mainSelectedOption === null){

        mainSelectedOption = cheapestOptions;
    }

    return mainSelectedOption;

}

// Example usage
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

const points = 10;
const result = buyOptions(points, methodArgs);
console.log(result);