import MatchStats from './MatchStats';
import Player from './Player';

class SetPossession {

  setTeam(teams){
    const teamWithPossession = teams[Math.round(Math.random())];
    const possessionFontColor = teamWithPossession.fontColor;
    const possessionBackgroundColor = teamWithPossession.backgroundColor;

    return [teamWithPossession, possessionFontColor, possessionBackgroundColor];
  }

  calculatePercentage(team1Possession, team2Possession){
    const stats = new MatchStats();
    const totalPossession = (team1Possession + team2Possession);
    const percentageReturns = stats.calculatePercentage(team1Possession, totalPossession);

    const team1PossessionPercentage = percentageReturns[0];
    const team2PossessionPercentage = percentageReturns[1];

    return [team1PossessionPercentage, team2PossessionPercentage];
  }

  setPlayer(teamInPossession, defendingTeam){
    const players = teamInPossession.players;
    const playerInPossession = players[(Math.floor(Math.random() * players.length))];
    const defendingPlayers = defendingTeam.players;
    const defendingPlayer = defendingPlayers[(Math.floor(Math.random() * players.length))];
    
    //ensuring that player in possession cannot pass to themselves, removing them from the players array
    const thisPlayer = new Player();
    const indexOfPlayerInPossession = players.indexOf(playerInPossession)
    let removedPlayer = players.splice(indexOfPlayerInPossession, 1);
    let playerToPassTo = players[(Math.floor(Math.random() * players.length))];

    if (playerToPassTo === playerInPossession){
      playerToPassTo = players[(Math.floor(Math.random() * players.length))];
    }

    players.push(removedPlayer[0])

    return [playerInPossession, playerToPassTo, defendingPlayer]
  }
}

export default SetPossession;