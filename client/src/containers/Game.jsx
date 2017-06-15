import React from 'react';
import Player from '../components/Player';
import Team from '../components/Team';

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
    console.log(this.state)
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
        console.log('Team1: ', teams[0].name);
        console.log('Team2: ', teams[1].name);
        this.setState({teams: teams});
      }
      else{
        console.log('request.status !== 200')
      }
    };
    console.log('Teams: ', this.state.teams)
    request.send(null);
  }

  setTeamInPossession(){
    //define teams
    console.log(this);
    // const teams = [team1, team2];
    // this.setState({teamInPossession: teams[Math.random().round()]});
    // console.log('Team in possession: ', this.state.teamInPossession)
  }

  render(){
    return(
      <div>
      <h1>Footsoccerpassball</h1>
      <p>Go to /game to view the data!</p>
      </div>
      )
  }
}

export default Game;