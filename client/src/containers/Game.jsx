import React from 'react';
import Player from '../models/Player';
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
    console.log("Player's pass rating: ", this.state.playerInPossession.attributes[0].Passing);
    console.log("Defender's positioning rating: ", defendingPlayer.attributes[0].Positioning);
    console.log("Defender's tackling rating: ", defendingPlayer.attributes[0].Tackling);
    console.log("Defender's pace rating: ", defendingPlayer.attributes[0].Pace);
    console.log("Defender's strength rating: ", defendingPlayer.attributes[0].Strength);
    console.log("Receiving player's pace rating: ", receivingPlayer.attributes[0].Pace);
    console.log("Receiving player's strength rating: ", receivingPlayer.attributes[0].Strength);
    console.log("Receiving player's dribbling rating: ", receivingPlayer.attributes[0].Dribbling);


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