import { HeroTypeUserFacing, Land, UnitTypeUserFacing } from "../../../types/index";
import { GeneralArguments } from "../../../types/battle/effects";
import { BattleEvaluationArgs, EffectMethods, EffectNarration, KillCardArgs, RoundArgs } from "../../../types/battle/effectUtils";
import { BattleEvaluation, RoundNarration } from "../../../types/battle/main";

function Round(args:RoundArgs):RoundNarration{
    const {attacker, defender, attackerDeck,defenderDeck,attackerGraveyard,defenderGraveyard, land} = args;
    const roundNarration:RoundNarration = {
        preAttacker: undefined,
        preDefender: undefined,
        battle: undefined,
        postAttacker: undefined,
        postDefender: undefined
    }
    
    if(attacker.effect && attacker.effect.stage === 'pre'){
        roundNarration.preAttacker = effectExecutor(args, 'attacker');
    }
    if(defender.effect && defender.effect.stage === 'pre'){
        roundNarration.preDefender = effectExecutor(args, 'defender');
    }
    const result = battleEvaluation({
        attacker,defender,land
    });

    if(result.winner === defender){
        killCard({
            UnitTypeUserFacing:attacker,
            graveyard:attackerGraveyard,
            deck:attackerDeck
        })
        defenderDeck.push(defenderDeck.shift()!);
    }
    else if(result.winner === attacker){
        killCard({
            UnitTypeUserFacing:defender,
            graveyard:defenderGraveyard,
            deck:defenderDeck
        })
        attackerDeck.push(attackerDeck.shift()!);
    }
    else{
        killCard({
            UnitTypeUserFacing:attacker,
            graveyard:attackerGraveyard,
            deck:attackerDeck
        })
        killCard({
            UnitTypeUserFacing:defender,
            graveyard:defenderGraveyard,
            deck:defenderDeck
        })
    }
    roundNarration.battle =  result;

    if(attacker.effect && attacker.effect.stage === 'after'){
        roundNarration.postAttacker = effectExecutor(args, 'attacker');
    }
    if(defender.effect && defender.effect.stage === 'after'){
        roundNarration.postDefender =  effectExecutor(args, 'defender');
    }

    return roundNarration
}

export function battle(args: {
    attackerDeck: UnitTypeUserFacing[];
    defenderDeck: UnitTypeUserFacing[];
    attackerGraveyard: UnitTypeUserFacing[];
    defenderGraveyard: UnitTypeUserFacing[];
    attackerHeroTypeUserFacing: HeroTypeUserFacing | undefined;
    defenderHeroTypeUserFacing: HeroTypeUserFacing | undefined;
    defenderCastle: HeroTypeUserFacing | undefined;
    land: Land;
}): {
    winner: 'attacker' | 'defender' | 'draw';
    remainingAttackerDeck: UnitTypeUserFacing[];
    remainingDefenderDeck: UnitTypeUserFacing[];
    HeroTypeUserFacingCastleNarrations: string[];
    rounds:RoundNarration[];
} {
    const { attackerDeck, defenderDeck, attackerGraveyard, defenderGraveyard, land } = args;
    const rounds:RoundNarration[] = [];
    const HeroTypeUserFacingCastleNarrations:string[] = [];
    const attackerHeroTypeUserFacing = args.attackerHeroTypeUserFacing;
    const defenderHeroTypeUserFacing = args.defenderHeroTypeUserFacing;
    const defenderCastle = args.defenderCastle;
    if(attackerHeroTypeUserFacing){
        attackerDeck.forEach((UnitTypeUserFacing:UnitTypeUserFacing) => {
            UnitTypeUserFacing.water += attackerHeroTypeUserFacing.water;
            UnitTypeUserFacing.earth += attackerHeroTypeUserFacing.earth;
            UnitTypeUserFacing.fire  += attackerHeroTypeUserFacing.fire;
        })
        HeroTypeUserFacingCastleNarrations.push(`The attackeres HeroTypeUserFacing buffed his soldieres with 
                                    +${attackerHeroTypeUserFacing.water} for water
                                    +${attackerHeroTypeUserFacing.fire} for fire
                                    +${attackerHeroTypeUserFacing.earth} for earth`)
    }
    if(defenderHeroTypeUserFacing){
        defenderDeck.forEach((UnitTypeUserFacing:UnitTypeUserFacing) => {
            UnitTypeUserFacing.water += defenderHeroTypeUserFacing.water;
            UnitTypeUserFacing.earth += defenderHeroTypeUserFacing.earth;
            UnitTypeUserFacing.fire  += defenderHeroTypeUserFacing.fire;
        })
        HeroTypeUserFacingCastleNarrations.push(`The attackeres HeroTypeUserFacing buffed his soldieres with 
            +${defenderHeroTypeUserFacing.water} for water
            +${defenderHeroTypeUserFacing.fire} for fire
            +${defenderHeroTypeUserFacing.earth} for earth`)
    }

    if(defenderCastle){
        defenderDeck.forEach((UnitTypeUserFacing:UnitTypeUserFacing) => {
            UnitTypeUserFacing.water += defenderCastle.water;
            UnitTypeUserFacing.earth += defenderCastle.earth;
            UnitTypeUserFacing.fire  += defenderCastle.fire;
        })
        HeroTypeUserFacingCastleNarrations.push(`The attackeres HeroTypeUserFacing buffed his soldieres with 
            +${defenderCastle.water} for water
            +${defenderCastle.fire} for fire
            +${defenderCastle.earth} for earth`)
    }

    while (attackerDeck.length > 0 && defenderDeck.length > 0) {
        const attacker = attackerDeck[0];
        const defender = defenderDeck[0];
        rounds.push(Round({
            attacker,
            defender,
            attackerDeck,
            defenderDeck,
            attackerGraveyard,
            defenderGraveyard,
            land,
        }));

        if (attackerDeck.length === 0 || defenderDeck.length === 0) {
            break;
        }
    }
    if (attackerDeck.length === 0 && defenderDeck.length === 0) {
        return {
            winner: 'draw',
            remainingAttackerDeck: attackerDeck,
            remainingDefenderDeck: defenderDeck,
            rounds:rounds,
            HeroTypeUserFacingCastleNarrations:HeroTypeUserFacingCastleNarrations
        };
    } else if (attackerDeck.length === 0) {
        return {
            winner: 'defender',
            remainingAttackerDeck: attackerDeck,
            remainingDefenderDeck: defenderDeck,
            rounds:rounds,
            HeroTypeUserFacingCastleNarrations:HeroTypeUserFacingCastleNarrations
        };
    } else {
        return {
            winner: 'attacker',
            remainingAttackerDeck: attackerDeck,
            remainingDefenderDeck: defenderDeck,
            rounds:rounds,
            HeroTypeUserFacingCastleNarrations:HeroTypeUserFacingCastleNarrations
        };
    }
}

function effectExecutor(args:RoundArgs,perspective:'attacker' | 'defender'){
    const me:UnitTypeUserFacing = args[perspective];
    let enemy:UnitTypeUserFacing;
    if(perspective  === 'attacker'){
        enemy = args['defender']
    }
    else{
        enemy = args['attacker']
    }
    const methodFunk:string | undefined = me.effect?.method;
    const methodArgs:unknown[] = me.effect?.methodArgs ? me.effect.methodArgs : [];
    if(methodFunk){
        // Import or define effectMethods before using it
        const effectMethods: Record<string, (methods: EffectMethods, generalArguments: GeneralArguments) => EffectNarration> = {}; // Define your effect methods here
        const generalArguments:GeneralArguments = {
            me,
            perspective,
            ActiveLand: args.land,
            enemy
        }
        if (methodFunk in effectMethods && me.effect) {
            return effectMethods[methodFunk](me.effect, generalArguments);
        }
        return undefined;
    }
}

export function battleEvaluation(battleArgs:BattleEvaluationArgs): BattleEvaluation{
    const {attacker, defender, land} = battleArgs;

    if(attacker[land] > defender[land]){
        return {
            text:`${attacker.name} defeated ${defender.name}` ,
            winner:attacker
        }
    }
    else if(defender[land] > attacker[land]){
        return {
            text:`${defender.name} defeated ${attacker.name}` ,
            winner:defender
        }
    }
    else{
        return {
            winner:null,
            text:`Both ${attacker.name} and ${defender.name} died in battle` ,
        }
    }
}

function killCard(killCardArgs:KillCardArgs){
    const { graveyard, deck, UnitTypeUserFacing } = killCardArgs;

    let UnitTypeUserFacingIndex = -1;

    for (let i = 0; i < deck.length; i++) {
        const isMatch = Object.keys(UnitTypeUserFacing).every(key => {
            return deck[i][key as keyof UnitTypeUserFacing] === UnitTypeUserFacing[key as keyof UnitTypeUserFacing];
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