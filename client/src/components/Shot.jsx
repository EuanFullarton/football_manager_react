class Shot {

  shotSuccess(playerInPossession, goalkeeper){
    const playerShootingRating = playerInPossession.attributes[0].Shooting;
    const goalkeeperReflexes = goalkeeper.attributes[0].Reflexes;
    const goalkeeperHandling = goalkeeper.attributes[0].Handling;
    const goalkeeperPositioning = goalkeeper.attributes[0].Positioning;

    const goalkeeperAllRatings = [goalkeeperReflexes, goalkeeperHandling, goalkeeperPositioning];
    const thisGoalkeeperRating = goalkeeperAllRatings[(Math.floor(Math.random() * 3))] 

    if (playerShootingRating > thisGoalkeeperRating){
      const goals = ["What a goal!", "It's a goal, there was no stopping that!", "Absolute screamer!", "Tucks it away confidently!", "Right in the top corner!", "Sensational! He's chipped the keeper!", "Cool as you like, he's slotted it into the net", "He's made that look easy, brilliant strike"]
      const thisGoal = goals[(Math.floor(Math.random() * goals.length))];

      console.log("*****GOAALLLLL*****");
      console.log(thisGoal);
      console.log(playerInPossession.name + " is the scorer");
      return [true, playerInPossession];
    }
    else {
      const saves = ["Incredible reflex save by the keeper!", "What a save!", "Keeper guesses right, well held", "Comfortable save in the end", "Parried away by the goalkeeper", "Straight into the keeper's hands", "The keeper didn't look troubled by that", "The keeper makes a wonderful save!"]
      const thisSave = saves[(Math.floor(Math.random() * saves.length))];

      console.log(thisSave);

      return [false];
    }


  }

}

export default Shot;