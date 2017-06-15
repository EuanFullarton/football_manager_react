class Player  {

  makeMove(playerName) {
    const possessionPhrases = ["turns with the ball", "keeps the ball moving", "gets his head to the ball", "takes the ball forward", "is forced to hold onto the ball", "holds up the play", "looks for the incisive pass", "clears the ball", "runs with the ball", "is allowed to continue his run", "advances down the left", "runs with the ball", "turns sharply", "advances with the ball", "takes the ball over the halfway line", "is still going unchallenged",  "comes forward", "delays playing the ball", "spins on the ball expertly", "looks for options from the back", "looks up", "continues unopposed", "now with the ball", "finds himself with space", "keeps going…", "Still no challenge"];

    const move = possessionPhrases[Math.floor(Math.random() * possessionPhrases.length)];
    console.log(playerName + " " + move);
  }

  attemptPass(player1, player2){
    const passingPhrases = ["feeds the ball left to", "lofts the ball forward to", "moves the ball forward to", "lays it right to", "feeds the ball forward to", "plays the ball left to", "with a low forward pass ahead of", "tries to find",  "with a low pass to the right of", "plays the ball to", "searches out", "sends the ball wide to", "looks for", "passes it forward to", "hits the ball forward 25 yards for", "sends the ball forward to", "plays the ball down the line for", "moves the ball left for", "crosses for", "hits the ball back 25 yards towards", "swings the ball right towards", "plays the ball square looking for", "sprays the ball out left for", "nods the ball on for", "drives the ball ahead of", "gets up for the header towards", "passes along the floor in the direction of", "plays the ball to the feet of"];

    const pass = passingPhrases[Math.floor(Math.random() * passingPhrases.length)];
    console.log(player1 + " " + pass + " " + player2);
  }

}

export default Player;