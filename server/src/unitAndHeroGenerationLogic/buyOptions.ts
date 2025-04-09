import { MethodArgsConfig, SelectableArg } from "../../../types/battle/effectUtils";
export interface BuyOptionsResult {
    selectedOptions: {cost: number}[] | null;
    remainingPoints: number;
    selectedOptionKeys: string[] | null;
    selectedOptionsRecord: Record<string, string>;
}

export function buyOptions(points: number, methodArgs: MethodArgsConfig): BuyOptionsResult | undefined {
    let remainingPoints = points;
    //Filter all non additive
    const filteredArgs = Object.keys(methodArgs).filter((arg) => {
        return methodArgs[arg].type !== 'additive'
    })

    //Find the cheapest possible option to make sure it is bellow the remaining points
    let cheapestCost = 0;
    const cheapestOptions:{cost:number}[] = []
    const cheapestOptionsKeys: string[]= [];

    filteredArgs.forEach((arg) =>{
        const theArg = methodArgs[arg] as SelectableArg
        const options = Object.keys(theArg.options);
        let findCheapestOption = Infinity;
        let cheapest:{cost:number} | null = null;
        let cheapestKey: string | null = null;
        options.forEach((option) => {
            if(theArg.options[option].cost < findCheapestOption){
                findCheapestOption = theArg.options[option].cost;
                cheapest = theArg.options[option]
                cheapestKey = option;
            }
        })
        cheapestCost+= findCheapestOption
        if(cheapest !== null && cheapestKey !== null){
            cheapestOptions.push(cheapest as {cost:number})
            cheapestOptionsKeys.push(cheapestKey as string);
        }
    })
    if(points<cheapestCost){
        console.log("You can't afford any full set of args");
        return undefined;
    }
    //Attempt 10 times to find random set of options that fits the price.

    let maxCounterForRandom = 10;
    let mainSelectedOption: {cost: number}[] | null = null;
    let mainSelectedOptionKeys: string[] | null = null;
    while(maxCounterForRandom > 0 && mainSelectedOption === null && filteredArgs.length ){
        let tempPoints = points;
        let tempBoughtOptions: {cost: number}[] = [];
        let tempBoughtOptionKeys: string[] = [];
        filteredArgs.forEach((arg, index) => {
            const theArg = methodArgs[arg] as SelectableArg
            const options = Object.keys(theArg.options);
            const selectedOptionKey = options[Math.floor(Math.random() * options.length)];
            // Randomly select an option
            const selectedOption: {cost:number} =  theArg.options[selectedOptionKey];
            //If the cost is bigger than the tempPoints go to next attempt
            if(selectedOption.cost > tempPoints){
                maxCounterForRandom--;
                return;
            }
            //Else remove the cost from the tempPoints and add into the temporary bought options
            else{
                tempPoints-=selectedOption.cost;
                tempBoughtOptions.push(selectedOption);
                tempBoughtOptionKeys.push(selectedOptionKey);
                if(index === filteredArgs.length - 1){
                    mainSelectedOption = tempBoughtOptions;
                    remainingPoints = tempPoints
                    mainSelectedOptionKeys = tempBoughtOptionKeys;
                    return
                }
            }
        })
        
    }
    if(mainSelectedOption === null){
        mainSelectedOption = cheapestOptions;
        cheapestOptions.forEach((option) => {
            remainingPoints-=option.cost;
        })
        mainSelectedOptionKeys = cheapestOptionsKeys;
    }

    const theRecord:Record<string,string> = {};
    filteredArgs.forEach((arg, index) => {
        if (mainSelectedOptionKeys) {
            theRecord[arg] = mainSelectedOptionKeys[index];
        }
    })

    return {
        selectedOptions: mainSelectedOption,
        remainingPoints: remainingPoints,
        selectedOptionKeys: mainSelectedOptionKeys,
        selectedOptionsRecord: theRecord
    };
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

const points = 20;
const result = buyOptions(points, methodArgs as MethodArgsConfig);
