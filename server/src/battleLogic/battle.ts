import { HeroType, Land, UnitType, UnitTypeSimple } from "../../../types";
import { effectExplanations, GeneralArguments } from "../../../types/battle/effects";
import { neutralUnits } from "../predefined/neutrals";
import {
  BattleEvaluationArgs,
  BattleResult,
  EffectMethods,
  EffectNarration,
  KillCardArgs,
  RoundArgs,
} from "../../../types/battle/effectUtils";
import { BattleEvaluation, RoundNarration } from "../../../types/battle/main";
import { createHeroType, createUnitType } from "../unitAndHeroGenerationLogic/unitAndHeroGeneration";
import { effectMethods } from "../../../types/battle/effects";
import { UnitRaceData, unitRaces } from "types/unitRaces";

function Round(args: RoundArgs): RoundNarration {
  const {
    attacker,
    defender,
    attackerDeck,
    defenderDeck,
    attackerGraveyard,
    defenderGraveyard,
    land,
  } = args;
  const roundNarration: RoundNarration = {
    startingRound: {
      attacker: JSON.parse(JSON.stringify(attacker)),
      defender: JSON.parse(JSON.stringify(defender)), 
    },
    preRound: {
      attacker: JSON.parse(JSON.stringify(attacker)),
      defender: JSON.parse(JSON.stringify(defender)),
    },
    preAttacker: undefined,
    preDefender: undefined,
    battle: undefined,
    postAttacker: undefined,
    postDefender: undefined,
    postRound: {
      attacker: JSON.parse(JSON.stringify(attacker)),
      defender: JSON.parse(JSON.stringify(defender)), 
    }
  };
  if (attacker.effect && attacker.effect.stage === "pre") {
    roundNarration.preAttacker = effectExecutor(args, "attacker");
  }
  if (defender.effect && defender.effect.stage === "pre") {
    roundNarration.preDefender = effectExecutor(args, "defender");
  }

  roundNarration.preRound.attacker = JSON.parse(JSON.stringify(attacker));
  roundNarration.preRound.defender = JSON.parse(JSON.stringify(defender));

  const result = battleEvaluation({
    attacker,
    defender,
    land,
  });

  if (result.winner === defender) {
    killCard({
      UnitTypeUserFacing: attacker,
      graveyard: attackerGraveyard,
      deck: attackerDeck,
    });
    defenderDeck.push(defenderDeck.shift()!);
  } else if (result.winner === attacker) {
    killCard({
      UnitTypeUserFacing: defender,
      graveyard: defenderGraveyard,
      deck: defenderDeck,
    });
    attackerDeck.push(attackerDeck.shift()!);
  } else {
    killCard({
      UnitTypeUserFacing: attacker,
      graveyard: attackerGraveyard,
      deck: attackerDeck,
    });
    killCard({
      UnitTypeUserFacing: defender,
      graveyard: defenderGraveyard,
      deck: defenderDeck,
    });
  }
  roundNarration.battle = result;

  if (attacker.effect && attacker.effect.stage === "after") {
    roundNarration.postAttacker = effectExecutor(args, "attacker");
  }
  if (defender.effect && defender.effect.stage === "after") {
    roundNarration.postDefender = effectExecutor(args, "defender");
  }
  roundNarration.postRound.attacker = JSON.parse(JSON.stringify(attacker));
  roundNarration.postRound.defender = JSON.parse(JSON.stringify(defender));

  return roundNarration;
}

export function battle(args: {
  attackerDeck: UnitType[];
  defenderDeck: UnitType[];
  attackerGraveyard: UnitType[];
  defenderGraveyard: UnitType[];
  attackerHeroTypeUserFacing: HeroType | undefined;
  defenderHeroTypeUserFacing: HeroType | undefined;
  defenderCastle: HeroType | undefined;
  land: Land;
}): BattleResult {
  const {
    attackerDeck,
    defenderDeck,
    attackerGraveyard,
    defenderGraveyard,
    land,
  } = args;
  const rounds: RoundNarration[] = [];
  const HeroTypeUserFacingCastleNarrations: string[] = [];
  const attackerHeroTypeUserFacing = args.attackerHeroTypeUserFacing;
  const defenderHeroTypeUserFacing = args.defenderHeroTypeUserFacing;
  const defenderCastle = args.defenderCastle;
  if (attackerHeroTypeUserFacing) {
    attackerDeck.forEach((UnitTypeUserFacing: UnitType) => {
      UnitTypeUserFacing.water += attackerHeroTypeUserFacing.water;
      UnitTypeUserFacing.earth += attackerHeroTypeUserFacing.earth;
      UnitTypeUserFacing.fire += attackerHeroTypeUserFacing.fire;
    });
    HeroTypeUserFacingCastleNarrations.push(`The attackeres HeroTypeUserFacing buffed his soldieres with 
                                    +${attackerHeroTypeUserFacing.water} for water
                                    +${attackerHeroTypeUserFacing.fire} for fire
                                    +${attackerHeroTypeUserFacing.earth} for earth`);
  }
  if (defenderHeroTypeUserFacing) {
    defenderDeck.forEach((UnitTypeUserFacing: UnitType) => {
      UnitTypeUserFacing.water += defenderHeroTypeUserFacing.water;
      UnitTypeUserFacing.earth += defenderHeroTypeUserFacing.earth;
      UnitTypeUserFacing.fire += defenderHeroTypeUserFacing.fire;
    });
    HeroTypeUserFacingCastleNarrations.push(`The attackeres HeroTypeUserFacing buffed his soldieres with 
            +${defenderHeroTypeUserFacing.water} for water
            +${defenderHeroTypeUserFacing.fire} for fire
            +${defenderHeroTypeUserFacing.earth} for earth`);
  }

  if (defenderCastle) {
    defenderDeck.forEach((UnitTypeUserFacing: UnitType) => {
      UnitTypeUserFacing.water += defenderCastle.water;
      UnitTypeUserFacing.earth += defenderCastle.earth;
      UnitTypeUserFacing.fire += defenderCastle.fire;
    });
    HeroTypeUserFacingCastleNarrations.push(`The attackeres HeroTypeUserFacing buffed his soldieres with 
            +${defenderCastle.water} for water
            +${defenderCastle.fire} for fire
            +${defenderCastle.earth} for earth`);
  }

  while (attackerDeck.length > 0 && defenderDeck.length > 0) {
    const attacker = attackerDeck[0];
    const defender = defenderDeck[0];
    rounds.push(
      Round({
        attacker,
        defender,
        attackerDeck,
        defenderDeck,
        attackerGraveyard,
        defenderGraveyard,
        land,
      })
    );

    if (attackerDeck.length === 0 || defenderDeck.length === 0) {
      break;
    }
  }
  const attackerDeckSimple = simplifyDecks(attackerDeck);
  const defenderDeckSimple = simplifyDecks(defenderDeck);

  const simpleRounds: RoundNarration[] = rounds.map((round) => {
    let winner: any = round.battle?.winner;
    if (winner === undefined) {
      winner = null;
    } else {
      winner = {
        ...winner,
        race: undefined,
        evolutions: undefined,
      };
    }
    let loser: any = round.battle?.loser;
    if (loser === undefined) {
      loser = null;
    } else {
      loser = {
        ...loser,
        race: undefined,
        evolutions: undefined,
      };
    }
    let attacker: any = round.battle?.attacker;
    if (attacker === undefined) {
      attacker = null;
    } else {
      attacker = {
        ...attacker,
        race: undefined,
        evolutions: undefined,
      };
    }
    let defender: any = round.battle?.defender;
    if (defender === undefined) {
      defender = null;
    } else {
      defender = {
        ...defender,
        race: undefined,
        evolutions: undefined,
      };
    }

    let battleText = round.battle?.text;
    if (battleText === undefined) {
      battleText = "";
    }
    return {
      ...round,
      battle: {
        ...round.battle,
        winner: winner,
        loser: loser,
        attacker: attacker,
        defender: defender,
        text: battleText,
      },
    };
  });
  if (attackerDeckSimple.length === 0 && defenderDeck.length === 0) {
    return {
      winner: "draw",
      remainingAttackerDeck: attackerDeckSimple,
      remainingDefenderDeck: defenderDeckSimple,
      rounds: simpleRounds,
      HeroTypeUserFacingCastleNarrations: HeroTypeUserFacingCastleNarrations,
    };
  } else if (attackerDeckSimple.length === 0) {
    return {
      winner: "defender",
      remainingAttackerDeck: attackerDeckSimple,
      remainingDefenderDeck: defenderDeckSimple,
      rounds: simpleRounds,
      HeroTypeUserFacingCastleNarrations: HeroTypeUserFacingCastleNarrations,
    };
  } else {
    return {
      winner: "attacker",
      remainingAttackerDeck: attackerDeckSimple,
      remainingDefenderDeck: defenderDeckSimple,
      rounds: simpleRounds,
      HeroTypeUserFacingCastleNarrations: HeroTypeUserFacingCastleNarrations,
    };
  }
}

function simplifyDecks(deck: UnitType[]): UnitTypeSimple[] {
  return deck.map((UnitTypeUserFacing: UnitType) => {
    return {
      name: UnitTypeUserFacing.name,
      image: UnitTypeUserFacing.image,
      level: UnitTypeUserFacing.level,
      water: UnitTypeUserFacing.water,
      earth: UnitTypeUserFacing.earth,
      fire: UnitTypeUserFacing.fire,
      specialExplanation: UnitTypeUserFacing.specialExplanation,
      effect: UnitTypeUserFacing.effect,
    };
  });
}
function effectExecutor(args: RoundArgs, perspective: "attacker" | "defender") {
  const me: UnitType = args[perspective];
  const myDeck: UnitType[] = args[`${perspective}Deck`];
  let enemyDeck: UnitType[];
  let enemy: UnitType;
  if (perspective === "attacker") {
    enemyDeck = args["defenderDeck"];
    enemy = args["defender"];
  } else {
    enemyDeck = args["attackerDeck"];
    enemy = args["attacker"];
  }
  const methodFunk: string | undefined = me.effect?.method;

  if (methodFunk) {
    // Import or define effectMethods before using it
    // const effectMethods: Record<
    //   string,
    //   (
    //     methods: EffectMethods,
    //     generalArguments: GeneralArguments
    //   ) => EffectNarration
    // > = {}
    const generalArguments: GeneralArguments = {
      me,
      perspective,
      ActiveLand: args.land,
      enemy,
      myDeck,
      enemyDeck,
    };
    if (methodFunk in effectMethods && me.effect) {
      // @ts-ignore
      return effectMethods[methodFunk](me.effect, generalArguments);
    }
    return undefined;
  }
}

export function battleEvaluation(
  battleArgs: BattleEvaluationArgs
): BattleEvaluation {
  const { attacker, defender, land } = battleArgs;

  if (attacker[land] > defender[land]) {
    return {
      text: `${attacker.name} defeated ${defender.name}`,
      winner: attacker,
      loser: defender,
      attacker: attacker,
      defender: defender,
    };
  } else if (defender[land] > attacker[land]) {
    return {
      text: `${defender.name} defeated ${attacker.name}`,
      winner: defender,
      loser: attacker,
      attacker: attacker,
      defender: defender,
    };
  } else {
    return {
      winner: null,
      text: `Both ${attacker.name} and ${defender.name} died in battle`,
      loser: null,
      attacker: attacker,
      defender: defender,
    };
  }
}

function killCard(killCardArgs: KillCardArgs) {
  const { graveyard, deck, UnitTypeUserFacing } = killCardArgs;

  let UnitTypeUserFacingIndex = -1;

  for (let i = 0; i < deck.length; i++) {
    const isMatch = Object.keys(UnitTypeUserFacing).every((key) => {
      return (
        deck[i][key as keyof UnitType] ===
        UnitTypeUserFacing[key as keyof UnitType]
      );
    });
    if (isMatch) {
      UnitTypeUserFacingIndex = i;
      break;
    }
  }

  if (UnitTypeUserFacingIndex !== -1) {
    const [removedUnitTypeUserFacing] = deck.splice(UnitTypeUserFacingIndex, 1);

    graveyard.push(removedUnitTypeUserFacing);
  }
}

let theBattle = battle(
  {
    attackerDeck: [
      createUnitType(),createUnitType(),createUnitType()
    ],
    defenderDeck: [
      createUnitType(),createUnitType(),createUnitType()
    ],
    attackerGraveyard: [],
    defenderGraveyard: [],
    attackerHeroTypeUserFacing:  createHeroType(unitRaces.get('earth-goat') as UnitRaceData),
    defenderHeroTypeUserFacing:  createHeroType(unitRaces.get('earth-goat')  as UnitRaceData),
    defenderCastle: undefined,
    land: "fire",
  }
)

console.log(theBattle.rounds)