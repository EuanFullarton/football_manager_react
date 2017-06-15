import React from 'react';
import Player from '../components/Player';
import Team from '../components/Team';
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
    console.log('sendHTTPRequest running')
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = () => {
      if(request.status === 200){
        console.log('request.status === 200')
        const teams = JSON.parse(request.responseText);
        const team1 = teams[0];
        const team2 = teams[1];
        console.log('Team1: ', teams[0]);
        console.log('Team2: ', teams[1]);
        this.setState({teams: [team1, team2]});
        console.log('Teams in state: ', this.state.teams[0].name, ",", this.state.teams[1].name)
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
    this.setState({teamInPossession: teamWithPossession}, () => {console.log("setState is done", this.state.teamInPossession)});
  }

  gameStart(){
    this.setTeamInPossession();
    console.log('Game start, team in possession: ', this.state.teamInPossession)
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