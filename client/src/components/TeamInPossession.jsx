import MatchStats from './MatchStats';

class TeamInPossession {

  set(teams){
    const teamWithPossession = teams[Math.round(Math.random())];
    const possessionFontColor = teamWithPossession.fontColor;
    const possessionBackgroundColor = teamWithPossession.backgroundColor;

    return [teamWithPossession, possessionFontColor, possessionBackgroundColor];
  }

  calculate(team1Possession, team2Possession){
    const stats = new MatchStats();
    const totalPossession = (team1Possession + team2Possession);
    const percentageReturns = stats.calculatePercentage(team1Possession, totalPossession);

    const team1PossessionPercentage = percentageReturns[0];
    const team2PossessionPercentage = percentageReturns[1];

    return [team1PossessionPercentage, team2PossessionPercentage];
  }
}

export default TeamInPossession;