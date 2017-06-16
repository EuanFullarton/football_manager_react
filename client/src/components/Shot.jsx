class Shot {

  shotSuccess(playerInPossession, goalkeeper){
    const playerShootingRating = playerInPossession.attributes[0].Shooting;
    const goalkeeperReflexes = goalkeeper.attributes[0].Reflexes;
    const goalkeeperHandling = goalkeeper.attributes[0].Handling;
    const goalkeeperPositioning = goalkeeper.attributes[0].Positioning;
  
    if (playerShootingRating > goalkeeperReflexes){
      console.log("It's a goal, there was no stopping that!");
      console.log(playerInPossession.name + " is the scorer");
      return [true, playerInPossession];
    }
    else if (playerShootingRating === goalkeeperReflexes){
      const scoringScenarios = [(playerShootingRating > goalkeeperPositioning), (playerShootingRating > goalkeeperHandling)]
      const shotResult = scoringScenarios[(Math.floor(Math.random() * 2))];
      console.log("Can the keeper save it...?");

      if(shotResult === scoringScenarios[0] && (shotResult === true)){
        console.log(playerInPossession.name + " scores! The keeper's positioning was all wrong!");
        return [true, playerInPossession];
      }
      else if (shotResult === scoringScenarios[1] && (shotResult === true)){
        console.log(playerInPossession.name + " scores! The keeper fumbled it and has paid dearly!")
        return [true, playerInPossession];
      }
      else {
        console.log("The keeper has made a wonderful save!");
        return [false];
      }
    }
    else {
      console.log("Incredible reflex save by the keeper!");
    }


  }

}

export default Shot;