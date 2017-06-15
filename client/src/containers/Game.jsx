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
    const teamWithPossession = teams[Math.round(Math.random())]
    this.setState({teamInPossession: teamWithPossession}, () => { 
      console.log("Team in possession: ", this.state.teamInPossession), 
      this.setPlayerinPossession() 
    });
  }

  setPlayerinPossession(){
    const players = this.state.teamInPossession.players;
    const playerWithPossession = players[(Math.floor(Math.random() * 10) + 1)]

    this.setState({playerInPossession: playerWithPossession}, () => {
      console.log("Player who has the ball: ", this.state.playerInPossession)
      const thisPlayer = new Player();
      const playerToPassTo = players[(Math.floor(Math.random() * 10) + 1)]

      thisPlayer.makeMove(this.state.playerInPossession.name);
      thisPlayer.makeMove("He");
      thisPlayer.attemptPass(this.state.playerInPossession.name, playerToPassTo.name);
    })
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