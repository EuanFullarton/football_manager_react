import React from 'react';
import Player from '../components/Player';
import StartGame from '../components/StartGame.jsx'

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      teams: [],
      team1Score: 0,
      team2Score: 0,
      teamInPossession: "",
      defendingTeam: "",
      playerInPossession: ""
    }
    this.sendHTTPRequest = this.sendHTTPRequest.bind(this);
    this.sendHTTPRequest('/game');
  }

  reset(){
    this.setState ={
      teams:[],
      team1Score: 0,
      team2Score: 0,
      teamInPossession: "",
      defendingTeam: "",
      playerInPossession: ""
    }
  }

  sendHTTPRequest(url) {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = () => {
      if(request.status === 200){
        const teams = JSON.parse(request.responseText);
        const team1 = teams[0].teams[0];
        const team2 = teams[0].teams[1];
        this.setState({teams: [team1, team2]});
        console.log('Teams: ', this.state.teams[0].name, "vs", this.state.teams[1].name)
      }
      else{
        console.log('request.status !== 200')
      }
    };
    request.send(null);
  }

  setTeamInPossession(){
    const teams = this.state.teams;
    let teamWithPossession = teams[Math.round(Math.random())];
    let defendingTeam = "";
    if (teamWithPossession === teams[0]){
      defendingTeam = teams[1];
    }
    else {
      defendingTeam = teams[0];
    }

    this.setState({teamInPossession: teamWithPossession, defendingTeam: defendingTeam}, () => { 
      console.log("Team in possession: ", this.state.teamInPossession), 
      console.log("Defending team: ", this.state.defendingTeam), 
      this.setPlayerinPossession() 
    });
  }

  setPlayerinPossession(){
    const players = this.state.teamInPossession.players;
    const defendingPlayers = this.state.defendingTeam.players;
    let playerWithPossession = players[(Math.floor(Math.random() * 10) + 1)];
    let defendingPlayer = defendingPlayers[(Math.floor(Math.random() * 10) + 1)];

    this.setState({playerInPossession: playerWithPossession}, () => {
      console.log("Player who has the ball: ", this.state.playerInPossession)
      let thisPlayer = new Player();
      let playerToPassTo = players[(Math.floor(Math.random() * 10) + 1)]

      thisPlayer.makeMove(this.state.playerInPossession.name);
      thisPlayer.makeMove("He");
      thisPlayer.attemptPass(this.state.playerInPossession.name, playerToPassTo.name);

      this.passSuccess(playerToPassTo, defendingPlayer);
    })
  }

  passSuccess(receivingPlayer, defendingPlayer){
    let playerPassRating = this.state.playerInPossession.attributes[0].Passing;
    let defenderPositioning = defendingPlayer.attributes[0].Positioning;
    let defenderTackling = defendingPlayer.attributes[0].Tackling;
    let defenderPace = defendingPlayer.attributes[0].Pace;
    let defenderStrength = defendingPlayer.attributes[0].Strength;
    let receiverDribbling = receivingPlayer.attributes[0].Dribbling;
    let receiverPace = receivingPlayer.attributes[0].Pace;
    let receiverStrength = receivingPlayer.attributes[0].Strength;

    // console.log("Player's pass rating: ", playerPassRating);
    // console.log("Defender's positioning rating: ", defenderPositioning);
    // console.log("Defender's tackling rating: ", defenderTackling);
    // console.log("Defender's pace rating: ", defenderPace);
    // console.log("Defender's strength rating: ", defenderStrength);
    // console.log("Receiving player's dribbling rating: ", receiverDribbling);
    // console.log("Receiving player's pace rating: ", receiverPace);
    // console.log("Receiving player's strength rating: ", receiverStrength);

    if (playerPassRating > defenderPositioning){
      console.log("Pass successful!")
    }
    else if (playerPassRating === defenderPositioning){
      const challenges = [(receiverPace > defenderPace), (receiverStrength > defenderStrength), (receiverDribbling > defenderTackling)];
      let makeChallenge = challenges[(Math.floor(Math.random() * 3))];
      console.log("Challenging for ball!: ", makeChallenge);

      if (makeChallenge === true){
        console.log("Pass successful!")
      }
      else {
        console.log("Pass unsuccessful, ball taken by ", defendingPlayer.name)
      }
    }
    else {
      console.log("Pass unsuccessful, ball taken by ", defendingPlayer.name)
    }


    //if att pass > def positioning then pass success
    //if att pass == def positioning then
      // random between:
        // receiving strength vs def strength
        // receiving pace vs def pace
        // receiving dribbling vs def tackling

    //if pass unsuccessful then change of possession

  }

  gameStart(){
    this.setTeamInPossession();
  }

  render(){
    return(
      <div>
      <h1>Footsoccerpassball</h1>
      <p>Go to /game to view the data!</p>
      <StartGame 
      startGame={this.gameStart.bind(this)}/>
      </div>
      )
  }

}

export default Game;