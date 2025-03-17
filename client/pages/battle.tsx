import {
  createUnitType,
  generalPointAnnotator,
  unitPointAnnotator,
} from "../lib/generateUnitType";
import { BattleEvaluation } from "@/types/battle/main";
import { battle, battleEvaluation } from "../lib/battle";
import { HeroTypeUserFacing, Land, UnitTypeUserFacing } from "@/types";
import ProtectedRoute from "@/components/protected-route";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}, // will be passed to the page component as props
  };
};

export default function Battle() {
  // Test data and battle evaluation example
  // Test battle simulation
  const mockBattleTest = () => {
    // Create mock attacker deck
    const attackerDeck: UnitTypeUserFacing[] = [
      {
        name: "Fire Dragon",
        water: 5,
        earth: 3,
        fire: 8,
        effect: null,
        specialExplanation: "",
        evolutions: [],
        howManyPeopleHaveIt: 1,
        level: 1,
        image: "",
      },
      {
        name: "Earth Golem",
        water: 2,
        earth: 7,
        fire: 4,
        effect: null,
        specialExplanation: "",
        evolutions: [],
        howManyPeopleHaveIt: 1,
        level: 1,
        image: "",
      },
    ];

    // Create mock defender deck
    const defenderDeck: UnitTypeUserFacing[] = [
      {
        name: "Water Elemental",
        water: 7,
        earth: 4,
        fire: 3,
        effect: null,
        specialExplanation: "",
        evolutions: [],
        howManyPeopleHaveIt: 1,
        level: 1,
        image: "",
      },
      {
        name: "Water Elemental",
        water: 7,
        earth: 4,
        fire: 3,
        effect: null,
        specialExplanation: "",
        evolutions: [],
        howManyPeopleHaveIt: 1,
        level: 1,
        image: "",
      },
    ];

    // Mock hero data
    const mockHero: HeroTypeUserFacing = {
      water: 2,
      earth: 2,
      fire: 2,
      wind: 0,
      slots: 5,
      evolutions: [],
      howManyPeopleHaveIt: 1,
      level: 1,
      counterEspionageLevel: 0,
    };

    // Battle configuration
    const battleConfig = {
      attackerDeck,
      defenderDeck,
      attackerGraveyard: [],
      defenderGraveyard: [],
      attackerHeroTypeUserFacing: mockHero,
      defenderHeroTypeUserFacing: undefined,
      defenderCastle: undefined,
      land: "fire" as Land,
    };

    // Execute battle
    const battleResult = battle(battleConfig);
    console.log("Battle Result:", battleResult);
  };

  // Run the test
  mockBattleTest();

  const testUnit = createUnitType();
  console.log(testUnit);
  return (
    <ProtectedRoute>
      <h1>Asen e gei</h1>
    </ProtectedRoute>
  );
}
