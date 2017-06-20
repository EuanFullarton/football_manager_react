class MatchStats {

  calculatePossession(teamPossession, possessionTotal){
     const onePercent = (possessionTotal / 100);
     const team1Percentage = Math.round(teamPossession / onePercent);
     const team2Percentage = (100 - Math.round(team1Percentage));

     return [team1Percentage, team2Percentage];
  }


}

export default MatchStats;