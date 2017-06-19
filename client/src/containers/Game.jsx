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
      teamBadges: [],
      team1Score: 0,
      team2Score: 0,
      team1Scorers: [],
      team2Scorers: [],
      teamInPossession: "",
      defendingTeam: "",
      playerInPossession: "",
      gameTime: 0,
      commentary: ""
    }
    this.sendHTTPRequest = this.sendHTTPRequest.bind(this);
    this.sendHTTPRequest('/game');
  }

  sendHTTPRequest(url) {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = () => {
      if(request.status === 200){
        const teams = JSON.parse(request.responseText);
        const team1 = teams[0];
        const team2 = teams[1];
        this.setState({teams: [team1, team2], teamBadge: [team1.badge, team2.badge]});
        this.setState({commentary: ('Match about to begin: ' + this.state.teams[0].name + " vs " + this.state.teams[1].name)});
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
      this.setState({commentary: this.state.teamInPossession.name + " in possession"});
      console.log(this.state.teamInPossession.name + " in possession")
      this.setPlayerinPossession()
    });
  }

  setPlayerinPossession(){
    const players = this.state.teamInPossession.players;
    const playerWithPossession = players[(Math.floor(Math.random() * players.length))];

    const playerWithPossessionName = playerWithPossession.name
    const defendingPlayers = this.state.defendingTeam.players;
    const defendingPlayer = defendingPlayers[(Math.floor(Math.random() * players.length))];
    

    setTimeout(function(){ 

      this.setState({playerInPossession: playerWithPossession}, () => {
        this.setState({commentary: this.state.playerInPossession.name + " has the ball"});

        console.log(playerWithPossessionName + " has the ball")
        const thisPlayer = new Player();

      //ensuring that player in possession cannot pass to themselves, removing them from the players array
      const indexOfPlayerWithPossession = players.indexOf(playerWithPossession)
      let removedPlayer = players.splice(indexOfPlayerWithPossession, 1);
      let playerToPassTo = players[(Math.floor(Math.random() * players.length))];

      //this for when attackingMove() calls the function
      if (playerToPassTo === playerWithPossession){
        playerToPassTo = players[(Math.floor(Math.random() * players.length))];
      }

      //adding the player back into the array
      players.push(removedPlayer[0])

      const playerToPassToName = playerToPassTo.name

      setTimeout(function(){ 
        let thisCommentary = thisPlayer.makeMovePhrase(playerWithPossessionName);
        this.setState({commentary: thisCommentary});
      }.bind(this), 1000);

      setTimeout(function(){ 
        let thisCommentary = thisPlayer.makeMovePhrase("He");
        this.setState({commentary: thisCommentary});
      }.bind(this), 2000);

      setTimeout(function(){ 
        let thisCommentary = thisPlayer.attemptPassPhrase(playerWithPossessionName, playerToPassToName);
        this.setState({commentary: thisCommentary});
      }.bind(this), 3000);

      setTimeout(function(){ 
        let thisCommentary = this.makePass(playerWithPossession, playerToPassTo, defendingPlayer);
       // this.setState({commentary: thisCommentary});
      }.bind(this), 4000);

    })

    }.bind(this), 1000);
  }

  makePass(passingPlayer, receivingPlayer, defendingPlayer){
    const thisPass = new Pass();
    const teamInPossession = this.state.teamInPossession;
    const defendingTeam = this.state.defendingTeam;
    const passResult = thisPass.passSuccess(passingPlayer, receivingPlayer, defendingPlayer, teamInPossession, defendingTeam);

    this.setState({teamInPossession: passResult[0], defendingTeam: passResult[1], playerInPossession:passResult[2]}, () => {

      let thisCommentary = passResult[3];
      console.log("THIS PASS RESULT:", thisCommentary)

      this.setState({commentary: thisCommentary}, () => {

        console.log(this.state);

        const players = this.state.teamInPossession.players;
        const indexOfPlayerWithPossession = players.indexOf(this.state.playerInPossession)
        const playerWithPossession = this.state.playerInPossession;
        const newDefendingPlayer = this.state.defendingTeam.players[(Math.floor(Math.random() * this.state.defendingTeam.players.length))];

        let removedPlayer = players.splice(indexOfPlayerWithPossession, 1);
        const newReceivingPlayer = players[(Math.floor(Math.random() * players.length))];

        if (newReceivingPlayer === playerWithPossession){
          newReceivingPlayer = players[(Math.floor(Math.random() * players.length))];
        }

        players.push(removedPlayer[0])

        this.attackingMove(this.state.playerInPossession, newReceivingPlayer, newDefendingPlayer);
      });     
    });
  }

  attackingMove(playerInPossession, receivingPlayer, defendingPlayer){
    const shotProbability = (Math.random() * 100);
    const thisPlayer = new Player();

    setTimeout(function(){ 
      let thisCommentary = thisPlayer.makeMovePhrase(playerInPossession.name);
      this.setState({commentary: thisCommentary});
    }.bind(this), 1000);

    setTimeout(function(){ 
      let thisCommentary = thisPlayer.makeMovePhrase("He");
      this.setState({commentary: thisCommentary});
    }.bind(this), 2000);



    if (shotProbability <= 25){
      const goalkeeper = this.state.defendingTeam.goalkeeper;
      setTimeout(function(){ 
        let thisCommentary = thisPlayer.attemptShotPhrase(playerInPossession.name);
        this.setState({commentary: thisCommentary});
      }.bind(this), 3000);

      setTimeout(function(){ 
        let thisCommentary = this.takeShot(playerInPossession, goalkeeper);
        this.setState({commentary: thisCommentary});
      }.bind(this), 4000);

    }
    else {
      setTimeout(function(){ 
        let thisCommentary = thisPlayer.attemptPassPhrase(playerInPossession.name, receivingPlayer.name)
        this.setState({commentary: thisCommentary});
      }.bind(this), 3000);

      setTimeout(function(){ 
        let thisCommentary = this.makePass(playerInPossession, receivingPlayer, defendingPlayer);
      }.bind(this), 4000);

    }
  }

  takeShot(playerInPossession, goalkeeper){
    const thisShot = new Shot();
    const shotResult = thisShot.shotSuccess(playerInPossession, goalkeeper);
    if ((shotResult[0] === true) &&(this.state.teamInPossession.name === "Real Madrid")){
      this.setState({team1Score: (this.state.team1Score + 1), team1Scorers: this.state.team1Scorers + " " + shotResult[2] + ", " + this.state.gameTime}, () => {

        setTimeout(function(){
          let thisCommentary = "*****GOAALLLLL*****";
          console.log("*****GOAALLLLL*****");
          this.setState({commentary: thisCommentary});
        }.bind(this), 1000);

        setTimeout(function(){
          let thisCommentary = (shotResult[1]);
          console.log(shotResult[1]);
          this.setState({commentary: thisCommentary});
        }.bind(this), 2000);

        setTimeout(function(){
          let thisCommentary = (shotResult[2] + " is the scorer");
          console.log(shotResult[2] + " is the scorer");
          this.setState({commentary: thisCommentary});
        }.bind(this), 3000);

        setTimeout(function(){
          let thisCommentary = ("Current score: Real Madrid ", this.state.team1Score + " - Barcelona " + this.state.team2Score);
          console.log("Current score: Real Madrid ", this.state.team1Score + " - Barcelona " + this.state.team2Score);
          this.setState({commentary: thisCommentary});
        }.bind(this), 4000);

        this.timeElapse();
        this.backToCentre();
      });
    }
    else if ((shotResult[0] === true) &&(this.state.teamInPossession.name === "Barcelona")){
      this.setState({team2Score: (this.state.team2Score + 1), team2Scorers: this.state.team2Scorers + " " + shotResult[2] + ", " + this.state.gameTime}, () => {

        setTimeout(function(){
          let thisCommentary = "*****GOAALLLLL*****";
          console.log("*****GOAALLLLL*****");
          this.setState({commentary: thisCommentary});
        }.bind(this), 1000);

        setTimeout(function(){
          let thisCommentary = (shotResult[1]);
          console.log(shotResult[1]);
          this.setState({commentary: thisCommentary});
        }.bind(this), 2000);

        setTimeout(function(){
          let thisCommentary = (shotResult[2] + " is the scorer");
          console.log(shotResult[2] + " is the scorer");
          this.setState({commentary: thisCommentary});
        }.bind(this), 3000);

        setTimeout(function(){
          let thisCommentary = ("Current score: Real Madrid ", this.state.team1Score + " - Barcelona " + this.state.team2Score);
          console.log("Current score: Real Madrid ", this.state.team1Score + " - Barcelona " + this.state.team2Score);
          this.setState({commentary: thisCommentary});
        }.bind(this), 4000);

        this.timeElapse();
        this.backToCentre();
      });
    }
    else {

      // setTimeout(function(){
        let thisCommentary = (shotResult[1]);
        console.log(shotResult[1]);
        this.setState({commentary: thisCommentary});
      // }.bind(this), 1000);


      this.timeElapse();  
      this.goalKick();
    }
  }

  gameStart(){
    setTimeout(function(){ 
      this.setTeamInPossession(); 
    }.bind(this), 1000);
  }

  timeElapse(){
    this.setState({gameTime: this.state.gameTime + 5}, () => {
      console.log("Game time: ", this.state.gameTime);
      if (this.state.gameTime === 45){
        this.halfTime();
        return;
      }
      else if(this.state.gameTime >= 90){
        this.gameEnd();
        return;
      }
      else {
        this.gameStart();
      }
    });
  }

  backToCentre(){
    setTimeout(function(){
      let thisCommentary = ("Back to centre");
      console.log("Back to centre");
      this.setState({commentary: thisCommentary});
    }.bind(this), 1000);
    return;
  }

  goalKick(){
    setTimeout(function(){
      let thisCommentary = ("Out for a goal kick");
      console.log("Out for a goal kick");
      this.setState({commentary: thisCommentary});
    }.bind(this), 1000);
    return;
  }

  halfTime(){
    this.setState({commentary: "Half time"})
    console.log("*****Half time!*****");
    return;
  }

  gameEnd(){
    this.setState({commentary: "Final whistle"})
    console.log("*****There's the final whistle, the game has ended: Real Madrid ", this.state.team1Score + " - Barcelona " + this.state.team2Score + "*****");
    return;
  }

  render(){
    return(
      <div>
      <h1>Footsoccerpassball</h1>
      <p id="commentary">{this.state.commentary}</p>
      <p id="scores">{this.state.team1Score + " - " + this.state.team2Score}</p>
      <p id="time">{this.state.gameTime + "min"}</p>
      <p id="team1Scoresheet">{this.state.team1Scorers}</p>
      <p id="team2Scoresheet">{this.state.team2Scorers}</p>
      <StartGame 
      startGame={this.gameStart.bind(this)}
      />
      </div>
      )
  }
}

export default Game;