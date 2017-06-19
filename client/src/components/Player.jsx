class Player  {

  makeMovePhrase(playerName) {
    const possessionPhrases = ["turns with the ball", "keeps the ball moving", "takes the ball forward", "is forced to hold onto the ball", "holds up the play", "looks for the incisive pass", "runs with the ball", "is allowed to continue his run", "advances down the left", "runs with the ball", "turns sharply", "advances with the ball", "takes the ball over the halfway line", "is still going unchallenged",  "comes forward", "delays playing the ball", "spins on the ball expertly", "looks for options from the back", "looks up", "continues unopposed", "finds himself with space", "keeps going…"];

    const move = possessionPhrases[Math.floor(Math.random() * possessionPhrases.length)];
    console.log(playerName + " " + move);
    return (playerName + " " + move);
  }

  attemptPassPhrase(player1, player2){
    const passingPhrases = ["feeds the ball left to", "lofts the ball forward to", "moves the ball forward to", "lays it right to", "feeds the ball forward to", "plays the ball left to", "with a low forward pass ahead of", "tries to find",  "with a low pass to the right of", "plays the ball to", "searches out", "sends the ball wide to", "looks for", "passes it forward to", "hits the ball forward 25 yards for", "sends the ball forward to", "plays the ball down the line for", "moves the ball left for", "crosses for", "hits the ball back 25 yards towards", "swings the ball right towards", "plays the ball square looking for", "sprays the ball out left for", "nods the ball on for", "drives the ball ahead of", "gets up for the header towards", "passes along the floor in the direction of", "plays the ball to the feet of"];

    const pass = passingPhrases[Math.floor(Math.random() * passingPhrases.length)];
    console.log(player1 + " " + pass + " " + player2);
    return (player1 + " " + pass + " " + player2);
  }

  attemptShotPhrase(playerName){
    const shootingPhrases = ["surely!", "goes for glory!", "shoots!", "advances on the keeper", "bears down on goal", "with plenty of time!", "drives it low at goal!", "unmarked!", "takes a shot!", "with the goal at his mercy!"];

    const shoot = shootingPhrases[Math.floor(Math.random() * shootingPhrases.length)];
    console.log(playerName + " " + shoot);
    return (playerName + " " + shoot);
  }
}

export default Player;