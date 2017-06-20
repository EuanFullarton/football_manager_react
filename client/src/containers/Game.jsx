import React from 'react';
import Player from '../components/Player';
import Pass from '../components/Pass';
import Shot from '../components/Shot';
import StartGame from '../components/StartGame'
import MatchStats from '../components/MatchStats'

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      teams: [],
      teamBadges: [],
      possessionFontColor: "white",
      possessionBackgroundColor: "black",
      team1Score: 0,
      team2Score: 0,
      team1Scorers: [],
      team2Scorers: [],
      team1Possession: 0,
      team1PossessionPercentage: 50,
      team2Possession: 0,
      team2PossessionPercentage: 50,
      teamInPossession: "",
      defendingTeam: "",
      playerInPossession: "",
      gameTime: 0,
      half: "first",
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
    const possessionFontColor = teamWithPossession.fontColor;
    const possessionBackgroundColor = teamWithPossession.backgroundColor;
    let defendingTeam = "";
    if (teamWithPossession === teams[0]){
      this.setState({team1Possession: (this.state.team1Possession + 1)});
      defendingTeam = teams[1];
    }
    else {
      this.setState({team2Possession: (this.state.team2Possession + 1)});
      defendingTeam = teams[0];
    }

    const stats = new MatchStats();
    const totalPossession = ((this.state.team1Possession) + (this.state.team2Possession));
    const possessionReturns = stats.calculatePossession(this.state.team1Possession, totalPossession);

    const team1Possession = possessionReturns[0];
    const team2Possession = possessionReturns[1];


    this.setState({teamInPossession: teamWithPossession, defendingTeam: defendingTeam, team1PossessionPercentage: team1Possession, team2PossessionPercentage: team2Possession}, () => {
      this.setState({commentary: this.state.teamInPossession.name + " in possession", possessionFontColor: possessionFontColor , possessionBackgroundColor: possessionBackgroundColor});
      console.log(this.state.teamInPossession.name + " in possession")
      this.setPlayerinPossession()

      console.log("TEAM 1 POSSESSION: ", this.state.team1Possession);
      console.log("TEAM 2 POSSESSION: ", this.state.team2Possession);
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

      const stats = new MatchStats();
      const totalPossession = ((this.state.team1Possession) + (this.state.team2Possession));
      const possessionReturns = stats.calculatePossession(this.state.team1Possession, totalPossession);

      const team1Possession = possessionReturns[0];
      const team2Possession = possessionReturns[1];

      if (this.state.teamInPossession === this.state.teams[0]){
        this.setState({team1Possession: (this.state.team1Possession + 1), team1PossessionPercentage: team1Possession, team2PossessionPercentage: team2Possession});
      }
      else {
        this.setState({team2Possession: (this.state.team2Possession + 1), team1PossessionPercentage: team1Possession, team2PossessionPercentage: team2Possession});
      }

      console.log("TEAM 1 POSSESSION: ", this.state.team1Possession);
      console.log("TEAM 2 POSSESSION: ", this.state.team2Possession);


      if (((this.state.gameTime < 45) && (this.state.half === "first")) || (this.state.gameTime < 90) && (this.state.half === "second")){
        this.setState({gameTime: (this.state.gameTime += 1)});
      }

      let thisCommentary = passResult[3];
      const possessionFontColor = this.state.teamInPossession.fontColor;
      const possessionBackgroundColor = this.state.teamInPossession.backgroundColor;

      this.setState({commentary: thisCommentary, possessionFontColor: possessionFontColor , possessionBackgroundColor: possessionBackgroundColor}, () => {

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
    if ((shotResult[0] === true) &&(this.state.teamInPossession === this.state.teams[0])){
      this.setState({team1Score: (this.state.team1Score + 1), team1Scorers: this.state.team1Scorers + " " + shotResult[2] + ", " + this.state.gameTime}, () => {

        setTimeout(function(){
          let thisCommentary = "*****GOAALLLLL*****";
          console.log("*****GOAALLLLL*****");
          this.setState({commentary: thisCommentary}, () => {


            const possessionFontColor = this.state.teamInPossession.fontColor;
            const possessionBackgroundColor = this.state.teamInPossession.backgroundColor;

            //trying to make goals flash
            setTimeout(function(){
              this.setState({possessionFontColor: possessionBackgroundColor, possessionBackgroundColor: possessionFontColor})
            }.bind(this), 100);
            setTimeout(function(){
              this.setState({possessionFontColor: possessionFontColor, possessionBackgroundColor: possessionBackgroundColor})
            }.bind(this), 200);
            setTimeout(function(){
              this.setState({possessionFontColor: possessionBackgroundColor, possessionBackgroundColor: possessionFontColor})
            }.bind(this), 300);
            setTimeout(function(){
              this.setState({possessionFontColor: possessionFontColor, possessionBackgroundColor: possessionBackgroundColor})
            }.bind(this), 400);


            setTimeout(function(){
              let thisCommentary = (shotResult[1]);
              console.log(shotResult[1]);
              this.setState({commentary: thisCommentary}, () => {
                setTimeout(function(){
                  let thisCommentary = (shotResult[2] + " is the scorer");
                  console.log(shotResult[2] + " is the scorer");
                  this.setState({commentary: thisCommentary}, () => {
                    setTimeout(function(){
                      if(this.state.teamInPossession === this.state.teams[0]){
                        this.setState({teamInPossession: this.state.teams[1]})
                      }
                      else{
                        this.setState({teamInPossession: this.state.teams[0]})
                      }
                      this.timeElapse();
                      this.backToCentre();
                    }.bind(this), 3500);
                  });
                }.bind(this), 2500);
              });
            }.bind(this), 1500);
          });
        }.bind(this), 500);
      });
    }
    else if ((shotResult[0] === true) &&(this.state.teamInPossession === this.state.teams[1])){
      this.setState({team2Score: (this.state.team2Score + 1), team2Scorers: this.state.team2Scorers + " " + shotResult[2] + ", " + this.state.gameTime}, () => {

        setTimeout(function(){
          let thisCommentary = "*****GOAALLLLL*****";
          console.log("*****GOAALLLLL*****");
          this.setState({commentary: thisCommentary}, () => {

            const possessionFontColor = this.state.teamInPossession.fontColor;
            const possessionBackgroundColor = this.state.teamInPossession.backgroundColor;

            //trying to make goals flash
            setTimeout(function(){
              this.setState({possessionFontColor: possessionBackgroundColor, possessionBackgroundColor: possessionFontColor})
            }.bind(this), 100);
            setTimeout(function(){
              this.setState({possessionFontColor: possessionFontColor, possessionBackgroundColor: possessionBackgroundColor})
            }.bind(this), 200);
            setTimeout(function(){
              this.setState({possessionFontColor: possessionBackgroundColor, possessionBackgroundColor: possessionFontColor})
            }.bind(this), 300);
            setTimeout(function(){
              this.setState({possessionFontColor: possessionFontColor, possessionBackgroundColor: possessionBackgroundColor})
            }.bind(this), 400);


            setTimeout(function(){
              let thisCommentary = (shotResult[1]);
              console.log(shotResult[1]);
              this.setState({commentary: thisCommentary}, () => {
                setTimeout(function(){
                  let thisCommentary = (shotResult[2] + " is the scorer");
                  console.log(shotResult[2] + " is the scorer");
                  this.setState({commentary: thisCommentary}, () => {
                    setTimeout(function(){
                      this.timeElapse();

                      if(this.state.teamInPossession === this.state.teams[0]){
                        this.setState({teamInPossession: this.state.teams[1]})
                      }
                      else{
                        this.setState({teamInPossession: this.state.teams[0]})
                      }

                      const possessionFontColor = this.state.teamInPossession.fontColor;
                      const possessionBackgroundColor = this.state.teamInPossession.backgroundColor;

                      this.backToCentre();
                    }.bind(this), 3500);
                  });
                }.bind(this), 2500);
              });
            }.bind(this), 1500);
          });
        }.bind(this), 500);

      });
    }
    else {



     const stats = new MatchStats();
     const totalPossession = ((this.state.team1Possession) + (this.state.team2Possession));
     const possessionReturns = stats.calculatePossession(this.state.team1Possession, totalPossession);

     const team1Possession = possessionReturns[0];
     const team2Possession = possessionReturns[1];

     if(this.state.teamInPossession === this.state.teams[0]){
      this.setState({teamInPossession: this.state.teams[1], team2Possession: (this.state.team2Possession + 1), team1PossessionPercentage: team1Possession, team2PossessionPercentage: team2Possession})
    }
    else{
      this.setState({teamInPossession: this.state.teams[0], team1Possession: (this.state.team1Possession + 1), team1PossessionPercentage: team1Possession, team2PossessionPercentage: team2Possession})
    }

    const possessionFontColor = this.state.teamInPossession.fontColor;
    const possessionBackgroundColor = this.state.teamInPossession.backgroundColor;

    let thisCommentary = (shotResult[1]);
    console.log(shotResult[1]);
    this.setState({commentary: thisCommentary, possessionFontColor: possessionFontColor , possessionBackgroundColor: possessionBackgroundColor});

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
  if ((this.state.gameTime >= 45) && (this.state.gameTime <= 50) && (this.state.half === "first")){
    this.halfTime();
    return;
  }
  else if ((this.state.gameTime >= 90) && (this.state.gameTime <= 95)){
    this.gameEnd();
    return;
  }
  else if (((this.state.gameTime >= 30) && (this.state.gameTime < 45)) || ((this.state.gameTime >= 75) && (this.state.gameTime < 90))){
    this.setState({gameTime: this.state.gameTime + 5}, () => {
      console.log("Game time: ", this.state.gameTime);
      if ((this.state.gameTime >= 45) && (this.state.gameTime <= 50)){
        this.halfTime();
        return;
      }
      else if ((this.state.gameTime >= 90) && (this.state.gameTime <= 95)){
        this.gameEnd();
        return;
      }
      else {
        setTimeout(function(){ 
          this.gameStart();
        }.bind(this), 3000);

      }
    });
  }
  else{
    this.setState({gameTime: this.state.gameTime + 15}, () => {
      console.log("Game time: ", this.state.gameTime);
      if(this.state.gameTime >= 90){
       this.gameEnd();
       return; 
     }
     else if ((this.state.gameTime >= 45) && (this.state.gameTime <= 50) && (this.state.half === "first")){
      this.halfTime();
      return;
    }
    else {
      setTimeout(function(){ 
        this.gameStart();
      }.bind(this), 3000);
    }
  });

  }
}

backToCentre(){
  const possessionFontColor = this.state.teamInPossession.fontColor;
  const possessionBackgroundColor = this.state.teamInPossession.backgroundColor;

  setTimeout(function(){
    let thisCommentary = ("Back to centre");
    console.log("Back to centre");
    this.setState({commentary: thisCommentary, possessionFontColor: possessionFontColor , possessionBackgroundColor: possessionBackgroundColor});
  }.bind(this), 3000);
  return;
}

goalKick(){
  const thisPass = new Pass();

  setTimeout(function(){
    let thisGKPass = thisPass.goalKeeperPassPhrase(); 
    console.log("thisGKPass");
    this.setState({commentary: thisGKPass});
  }.bind(this), 1000);
  return;
}

halfTime(){
  setTimeout(function(){
    this.setState({gameTime: 45, commentary: "Half time", possessionFontColor: 'white' , possessionBackgroundColor: 'black', half: "second"})
    console.log("*****Half time!*****");
  }.bind(this), 4000);
  return;
}

gameEnd(){
  setTimeout(function(){
    this.setState({commentary: "Final whistle", possessionFontColor: 'white' , possessionBackgroundColor: 'black'})
    console.log("*****There's the final whistle, the game has ended: Real Madrid ", this.state.team1Score + " - Barcelona " + this.state.team2Score + "*****");
  }.bind(this), 4000);
  return;
}

render(){

  const commentaryStyle = {
    'color': this.state.possessionFontColor, 
    'backgroundColor': this.state.possessionBackgroundColor
  }

  const Possession1 = {
    'backgroundColor': 'white',
    'color': 'black',
    'width': this.state.team1PossessionPercentage + "%"
  }

  const Possession2 = {
    'backgroundColor': 'blue',
    'color': 'red',
    'width': this.state.team2PossessionPercentage + "%"
  }

  return(
    <div>
    <h1>Footsoccerpassball</h1>
    <p id="commentary" style={commentaryStyle}>{this.state.commentary}</p>
    <p id="scores">{this.state.team1Score + " - " + this.state.team2Score}</p>
    <p id="time">{this.state.gameTime + "min"}</p>
    <div id="stats">
    <p id="team1PossessionBar" className="possession" style={Possession1}>{this.state.team1PossessionPercentage}</p>
    <p id="team2PossessionBar" className="possession" style={Possession2}>{this.state.team2PossessionPercentage}</p>
    <p>.</p>
    </div>
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