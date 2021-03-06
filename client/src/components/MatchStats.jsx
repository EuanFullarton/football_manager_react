class MatchStats {

  calculatePercentage(teamCount, countTotal){

    if(countTotal === 0) {
      return [50, 50];
    }

     const onePercent = (countTotal / 100);
     const team1Percentage = Math.round(teamCount / onePercent);
     const team2Percentage = (100 - Math.round(team1Percentage));

     return [team1Percentage, team2Percentage];
  }


}

export default MatchStats;