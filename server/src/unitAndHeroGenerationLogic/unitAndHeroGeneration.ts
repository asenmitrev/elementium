import { HeroType, HeroWeights, UnitType, UnitWeights } from "../../../types";
import {
  effectGeneration,
} from "../../../types/battle/effects";
import {UnitRaceData, unitRaces} from '../../../types/unitRaces';

const pointsPerLevel = 5;
const startingPoints = 15;

export const generalPointAnnotator = function (
  points: number,
  weights: Record<string, number> | UnitWeights
) {
  // Normalize the weights so that they sum to 1
  const totalWeight =
    Object.values(weights).reduce((sum, weight) => sum + weight, 0) || 1;
  const normalizedWeights = Object.fromEntries(
    Object.entries(weights).map(([key, weight]) => [key, weight / totalWeight])
  );

  // Distribute the points based on the normalized weights
  const distributedPoints = spreadWithWeights(points, normalizedWeights);

  return distributedPoints;
};

export const unitPointAnnotator = function (
  level: number,
  type: "water" | "earth" | "fire",
  customWeights?: UnitWeights
): { water: number; earth: number; fire: number; special: number } {
  const points = startingPoints + pointsPerLevel * level;

  const weightForType: UnitWeights = customWeights || {
    water: 0,
    earth: 0,
    fire: 0,
    special: 0,
  };

  if (!customWeights) {
    Object.keys(weightForType).forEach((innerType) => {
      if (innerType === type) {
        weightForType[innerType as keyof typeof weightForType] = 0.4;
      } else {
        weightForType[innerType as keyof typeof weightForType] = 0.2;
      }
    });
  }

  const [water, earth, fire, special] = generalPointAnnotator(
    points,
    weightForType
  );
  return {
    water,
    earth,
    fire,
    special,
  };
};

export const nameGeneration = function (race:UnitRaceData): string {
  if(race){
    const name = race.names[Math.floor(Math.random() * race.names.length)];
    const secondName = race.names[Math.floor(Math.random() * race.names.length)];
    return name +' ' + secondName;
  }
  return "random name";
};

export const getRandomMapElement = function<K, V>(map: Map<K, V>): V | undefined {
  const values = Array.from(map.values());
  return values[Math.floor(Math.random() * values.length)];
};


export const createUnitType = function (race?:UnitRaceData, level:number = 1): UnitType {

  let theWeights:UnitWeights | undefined
  if(!race){
    race = getRandomMapElement(unitRaces);
  }

  theWeights = (race as UnitRaceData).weights;
  const theName = nameGeneration(race as UnitRaceData);
  let image = ''
  if(race){
    image = race?.type + '/'+ race?.race + '/' + Math. random() * (race?.maxImages - 1) + 1;
  }

  let { water, earth, fire, special } = unitPointAnnotator(level, "water", theWeights);

  const { effect, remainder } = effectGeneration(special, race?.possibleEffects);

  if (remainder > 0) {

    const [water2, earth2, fire2] = generalPointAnnotator(remainder, {
      water2: 0.33,
      earth2: 0.33,
      fire2: 0.33,
    });
    water += water2;
    earth += earth2;
    fire += fire2;

    // Use the distributed points here if needed
  }



  const newUnitType: UnitType = {
    water,
    earth,
    fire,
    name: theName,
    howManyPeopleHaveIt: 0,
    level: 0,
    effect: effect,
    specialExplanation: "",
    image: image,
    evolutions: [],
    race:race as UnitRaceData
  };

  return newUnitType;
};

export const generateEvolutionOptions = function(unit:UnitType):{
  unitTypeOne:UnitType,
  unitTypeTwo:UnitType,
  unitTypeThree:UnitType
}{
  const unitTypeOne = createUnitType(unit.race, unit.level+1);
  unitTypeOne.image = unit.image;
  const unitTypeTwo = createUnitType(unit.race, unit.level+1);
  unitTypeTwo.image = unit.image;
  const unitTypeThree = createUnitType(unit.race, unit.level+1);
  unitTypeThree.image = unit.image;
  return {
    unitTypeOne,
    unitTypeTwo,
    unitTypeThree
  }
}


export const heroPointAnnotator = function (
  level: number,
  type: "water" | "earth" | "fire" | "leadership" | "wind" | "counterEspionage",
  customWeights?: HeroWeights
) {
  //How much points would the card spent
  const points = startingPoints + pointsPerLevel * level;
  const weightForType = customWeights || {
    water: 0,
    earth: 0,
    fire: 0,
    leadership: 0,
    wind: 0,
    counterEspionage:0 
  };
  if(!customWeights){
    Object.keys(weightForType).forEach((innerType) => {
      if (innerType === type) {
        weightForType[innerType as keyof typeof weightForType] = 0.25;
      } else {
        weightForType[innerType as keyof typeof weightForType] = 0.15;
      }
    });
  }


  //1st Water 2nd Earth 3rd Fire
  const [water, earth, fire, leadership, wind, counterEspionage] = generalPointAnnotator(
    points,
    weightForType
  );
  return {
    water,
    earth,
    fire,
    leadership,
    wind,
    counterEspionage
  };
};

function createHeroType(race:UnitRaceData){
  const level = 1;
  const { water, earth, fire, leadership, wind, counterEspionage } = heroPointAnnotator(level, "water");
  let image = ''
  if(race){
    image = race?.type + '/'+ race?.race + '/' + Math. random() * (race?.maxImages - 1) + 1;
  }
  const newHeroType: HeroType = {
      water,
      earth,
      fire,
      leadership,
      wind,
      counterEspionage,
      name: nameGeneration(race),
      evolutions: [],
      howManyPeopleHaveIt:0,
      image:image,
      level:0,
      race:race
  }
  return newHeroType
}

export const createHeroEvolutions = function(hero:HeroType){
  const [water, earth, fire, leadership, wind, counterEspionage] = generalPointAnnotator(
    1,
    hero.race.heroWeights as HeroWeights
  );
  hero.water+=water;
  hero.earth+=earth;
  hero.fire+=fire;
  hero.leadership+=leadership;
  hero.wind+=wind;
  hero.counterEspionage+=counterEspionage;
  return hero;
}

function spreadWithWeights(
  total: number,
  weights: Record<string, number> = {
    water: 0.3,
    earth: 0.3,
    fire: 0.3,
    special: 0.1,
  }
) {
  total = Math.round(total);

  const weightSum = Object.values(weights).reduce((sum, w) => sum + w, 0);
  if (Math.abs(weightSum - 1) > 0.000001) {
    throw new Error("Weights must sum to 1");
  }

  const variation = 0.2; // 20% maximum variation
  const getRandomVariation = () => (Math.random() * 2 - 1) * variation;

  const categories: string[] = Object.keys(weights);
  const values: Record<string, number> = {};

  // Calculate initial values with random variation
  let remainingTotal = total;
  categories.slice(0, -1).forEach((category) => {
    values[category] = Math.round(
      total * weights[category] * (1 + getRandomVariation())
    );
    remainingTotal -= values[category];
  });

  // Assign the remaining total to the last category
  values[categories[categories.length - 1]] = remainingTotal;

  // Check if any value is out of bounds and recalculate if necessary
  const lastCategory = categories[categories.length - 1];
  const maxSpecial = total * weights[lastCategory] * 1.5;
  if (values[lastCategory] < 0 || values[lastCategory] > maxSpecial) {
    categories.slice(0, -1).forEach((category) => {
      values[category] = Math.round(total * weights[category]);
    });
    values[lastCategory] =
      total -
      categories
        .slice(0, -1)
        .reduce((sum, category) => sum + values[category], 0);
  }

  return Object.values(values);
}
 
console.log('dolu')

console.log(createUnitType(), '   tuka? ');


