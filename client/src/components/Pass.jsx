class Pass {

  passSuccess(passingPlayer, receivingPlayer, defendingPlayer, teamInPossession, defendingTeam){
    const playerPassRating = passingPlayer.attributes[0].Passing;
    const defenderPositioning = defendingPlayer.attributes[0].Positioning;
    const defenderTackling = defendingPlayer.attributes[0].Tackling;
    const defenderPace = defendingPlayer.attributes[0].Pace;
    const defenderStrength = defendingPlayer.attributes[0].Strength;
    const receiverDribbling = receivingPlayer.attributes[0].Dribbling;
    const receiverPace = receivingPlayer.attributes[0].Pace;
    const receiverStrength = receivingPlayer.attributes[0].Strength;

    const changePossessor = teamInPossession;
    const changeDefender = defendingTeam;


    if (playerPassRating > defenderPositioning){
      let thisCommentary = (receivingPlayer.name + " now with the ball");
      return [changePossessor, changeDefender, receivingPlayer, thisCommentary];
    }
    else if (playerPassRating === defenderPositioning){
      const challenges = [(receiverPace > defenderPace), (receiverStrength > defenderStrength), (receiverDribbling > defenderTackling)];
      const makeChallenge = challenges[(Math.floor(Math.random() * 3))];

      if (makeChallenge === challenges[0] && (makeChallenge === true)){
        let thisCommentary = (receivingPlayer.name + " sprints ahead of the defender to get to the ball");
        console.log(receivingPlayer.name + " sprints ahead of the defender to get to the ball");
        return [changePossessor, changeDefender, receivingPlayer, thisCommentary];
      }
      else if (makeChallenge === challenges[1] && (makeChallenge === true)){
        let thisCommentary = (receivingPlayer.name + " stands strong and wins the ball");
        console.log(receivingPlayer.name + " stands strong and wins the ball");
        return [changePossessor, changeDefender, receivingPlayer, thisCommentary];
      }
      else if (makeChallenge === challenges[2] && (makeChallenge === true)){
        let thisCommentary = (receivingPlayer.name + " takes a fantastic first touch and sends the defender the wrong way");
        console.log(receivingPlayer.name + " takes a fantastic first touch and sends the defender the wrong way");
        return [changePossessor, changeDefender, receivingPlayer, thisCommentary];
      }
      else {
        let thisCommentary = ("Great defending, ball taken by " + defendingPlayer.name)
        console.log("Great defending, ball taken by", defendingPlayer.name)
        console.log(changeDefender.name + " now in possession");
        return [changeDefender, changePossessor, defendingPlayer, thisCommentary];
      }
    }
    else {
      let thisCommentary = ("Poor pass, ball intercepted by " + defendingPlayer.name)
      console.log("Poor pass, ball intercepted by", defendingPlayer.name)
      console.log(changeDefender.name + " now in possession");
      return [changeDefender, changePossessor, defendingPlayer, thisCommentary];
    }
  }

}

export default Pass;