import React from 'react';
import Player from '../components/Player';
import Pass from '../components/Pass';
import Shot from '../components/Shot';
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
        const team1 = teams[0];
        const team2 = teams[1];
        this.setState({teams: [team1, team2]});
        console.log('Match about to begin: ', this.state.teams[0].name, "vs", this.state.teams[1].name)
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
      console.log(this.state.teamInPossession.name + " in possession")
      this.setPlayerinPossession() 
    });
  }

  setPlayerinPossession(){
    const players = this.state.teamInPossession.players;
    const playerWithPossession = players[(Math.floor(Math.random() * 10) + 1)];
    const playerWithPossessionName = playerWithPossession.name
    const defendingPlayers = this.state.defendingTeam.players;
    const defendingPlayer = defendingPlayers[(Math.floor(Math.random() * 10) + 1)];
    

    this.setState({playerInPossession: playerWithPossession}, () => {
      console.log(playerWithPossessionName + " has the ball")
      const thisPlayer = new Player();
      //ensuring that player in possession cannot pass to themselves, removing them from the players array
      const indexOfPlayerWithPossession = players.indexOf(playerWithPossession)
      let removedPlayer = players.splice(indexOfPlayerWithPossession, 1);
      let playerToPassTo = players[(Math.floor(Math.random() * 10) + 1)]
      //adding the player back into the array
      players.push(removedPlayer[0])

      const playerToPassToName = playerToPassTo.name

      thisPlayer.makeMovePhrase(playerWithPossessionName);
      thisPlayer.makeMovePhrase("He");
      thisPlayer.attemptPassPhrase(playerWithPossessionName, playerToPassToName);
      this.makePass(playerWithPossession, playerToPassTo, defendingPlayer);
    })
  }

  makePass(passingPlayer, receivingPlayer, defendingPlayer){
    const thisPass = new Pass();
    const teamInPossession = this.state.teamInPossession;
    const defendingTeam = this.state.defendingTeam;
    const passResult = thisPass.passSuccess(passingPlayer, receivingPlayer, defendingPlayer, teamInPossession, defendingTeam);

    this.setState({teamInPossession: passResult[0], defendingTeam: passResult[1], playerInPossession:passResult[2]}, () => {
      const newDefendingPlayer = this.state.defendingTeam.players[(Math.floor(Math.random() * 10) + 1)];
      const newReceivingPlayer = this.state.teamInPossession.players[(Math.floor(Math.random() * 10) + 1)];
      this.attackingMove(this.state.playerInPossession, newReceivingPlayer, newDefendingPlayer);
    });
  }

  attackingMove(playerInPossession, receivingPlayer, defendingPlayer){
    const probability = (Math.random() * 100);
    const thisPlayer = new Player();

    thisPlayer.makeMovePhrase(playerInPossession.name);
    thisPlayer.makeMovePhrase("He");

    if (probability <= 25){
      const goalkeeper = this.state.defendingTeam.goalkeeper;
      thisPlayer.attemptShotPhrase(playerInPossession.name);
      this.takeShot(playerInPossession, goalkeeper)
    }
    else {
      thisPlayer.attemptPassPhrase(playerInPossession.name, receivingPlayer.name)
      this.makePass(playerInPossession, receivingPlayer, defendingPlayer);
    }
  }

  takeShot(playerInPossession, goalkeeper){
    const thisShot = new Shot();
    const shotResult = thisShot.shotSuccess(playerInPossession, goalkeeper);

    //next step is to update the score (add it to state first), and add scorer to array of goalscorers
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