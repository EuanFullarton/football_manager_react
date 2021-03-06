import React from 'react';
import Player from '../components/Player';
import Pass from '../components/Pass';
import Shot from '../components/Shot';
import StartGame from '../components/StartGame'
import MatchStats from '../components/MatchStats'
import SetPossession from '../components/SetPossession'

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
      team1Passes: 0,
      team1PassingPercentage: 50,
      team1Shots: 0,
      team1ShotsPercentage: 50,
      team2Possession: 0,
      team2PossessionPercentage: 50,
      team2Passes: 0,
      team2PassingPercentage: 50,
      team2Shots: 0,
      team2ShotsPercentage: 50,
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
        this.setState({
          teams: [team1, team2], 
          teamBadge: [team1.badge, team2.badge]});
        this.setState({
          commentary: ('Match about to begin: ' + this.state.teams[0].name + " vs " + this.state.teams[1].name)});
        console.log('Match about to begin: ', this.state.teams[0].name, "vs", this.state.teams[1].name)
      }
      else{
        console.log('request.status !== 200')
      }
    };
    request.send(null);
  }

  setPossession(){
    let defendingTeam = "";

    const setThisPossession = new SetPossession();
    const thisTeamInPossession = setThisPossession.setTeam(this.state.teams)

    if (thisTeamInPossession[0] === this.state.teams[0]){
      this.setState({team1Possession: (this.state.team1Possession + 1)});
      defendingTeam = this.state.teams[1];
    }
    else {
      this.setState({team2Possession: (this.state.team2Possession + 1)});
      defendingTeam = this.state.teams[0];
    }

    const possessionStats = setThisPossession.calculatePercentage(this.state.team1Possession, this.state.team2Possession); 

    this.setState({
      teamInPossession: thisTeamInPossession[0], 
      defendingTeam: defendingTeam, 
      team1PossessionPercentage: possessionStats[0], 
      team2PossessionPercentage: possessionStats[1]}, () => {

        this.setState({
          commentary: this.state.teamInPossession.name + " in possession", possessionFontColor: thisTeamInPossession[1], 
          possessionBackgroundColor: thisTeamInPossession[2]});
        
        const setPlayerInPossession = setThisPossession.setPlayer(this.state.teamInPossession, this.state.defendingTeam)     

        setTimeout(function(){ 
          this.setState({playerInPossession: setPlayerInPossession[0]}, () => {
            this.setState({commentary: this.state.playerInPossession.name + " has the ball"});

            const thisPlayer = new Player();
            const playerInPossessionName = this.state.playerInPossession.name;
            const playerToPassToName = setPlayerInPossession[1].name;

            setTimeout(function(){ 
              let thisCommentary = thisPlayer.makeMovePhrase(playerInPossessionName);
              this.setState({commentary: thisCommentary});
            }.bind(this), 1200);

            setTimeout(function(){ 
              let thisCommentary = thisPlayer.makeMovePhrase("He");
              this.setState({commentary: thisCommentary});
            }.bind(this), 2400);

            setTimeout(function(){ 
              let thisCommentary = thisPlayer.attemptPassPhrase(playerInPossessionName, playerToPassToName);
              this.setState({commentary: thisCommentary});
            }.bind(this), 3600);

            setTimeout(function(){ 
              let thisCommentary = this.makePass(setPlayerInPossession[0], setPlayerInPossession[1], setPlayerInPossession[2]);
            }.bind(this), 4800);
          })
        }.bind(this), 1000);
      });
  }


  makePass(passingPlayer, receivingPlayer, defendingPlayer){
    const thisPass = new Pass();
    const teamInPossession = this.state.teamInPossession;
    const defendingTeam = this.state.defendingTeam;
    const passResult = thisPass.passSuccess(passingPlayer, receivingPlayer, defendingPlayer, teamInPossession, defendingTeam);

    this.setState({
      teamInPossession: passResult[0], 
      defendingTeam: passResult[1], 
      playerInPossession:passResult[2]}, () => {

        if (this.state.teamInPossession !== teamInPossession){
          const miss = document.getElementById("miss");
          miss.play();
        }

        const stats = new MatchStats();

        const totalPossession = ((this.state.team1Possession) + (this.state.team2Possession));
        const possessionPercentageReturns = stats.calculatePercentage(this.state.team1Possession, totalPossession);
        const team1Possession = possessionPercentageReturns[0];
        const team2Possession = possessionPercentageReturns[1];

        if (this.state.teamInPossession === this.state.teams[0]){

          const totalPasses = ((this.state.team1Passes + 1) + (this.state.team2Passes));

          const passingPercentageReturns = stats.calculatePercentage(this.state.team1Passes + 1, totalPasses);
          const team1PassingPercentage = passingPercentageReturns[0];
          const team2PassingPercentage = passingPercentageReturns[1];

          this.setState({
            team1Possession: (this.state.team1Possession + 1), 
            team1PossessionPercentage: team1Possession, 
            team2PossessionPercentage: team2Possession, 
            team1Passes: (this.state.team1Passes + 1), 
            team1PassingPercentage: team1PassingPercentage, 
            team2PassingPercentage: team2PassingPercentage}, () => {
            });

        }
        else {

          const totalPasses = ((this.state.team1Passes) + (this.state.team2Passes + 1));

          const passingPercentageReturns = stats.calculatePercentage(this.state.team1Passes, totalPasses);
          const team1PassingPercentage = passingPercentageReturns[0];
          const team2PassingPercentage = passingPercentageReturns[1];

          this.setState({
            team2Possession: (this.state.team2Possession + 1), 
            team1PossessionPercentage: team1Possession, 
            team2PossessionPercentage: team2Possession, 
            team2Passes:(this.state.team2Passes + 1), 
            team1PassingPercentage: team1PassingPercentage, 
            team2PassingPercentage: team2PassingPercentage}, () => {
            });
        }

        if (((this.state.gameTime < 45) && (this.state.half === "first")) || (this.state.gameTime < 90) && (this.state.half === "second")){
          this.setState({gameTime: (this.state.gameTime += 1)});
        }

        let thisCommentary = passResult[3];
        const possessionFontColor = this.state.teamInPossession.fontColor;
        const possessionBackgroundColor = this.state.teamInPossession.backgroundColor;

        this.setState({
          commentary: thisCommentary, 
          possessionFontColor: possessionFontColor, 
          possessionBackgroundColor: possessionBackgroundColor}, () => {

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
    const stats = new MatchStats();


    if ((shotResult[0] === true) &&(this.state.teamInPossession === this.state.teams[0])){

      const goalCheer = document.getElementById("goalCheer");
      goalCheer.play();

      const totalShots = ((this.state.team1Shots + 1) + (this.state.team2Shots));
      const shootingPercentageReturns = stats.calculatePercentage(this.state.team1Shots + 1, totalShots);
      const team1ShootingPercentage = shootingPercentageReturns[0];
      const team2ShootingPercentage = shootingPercentageReturns[1];


      this.setState({
        team1Score: (this.state.team1Score + 1), 
        team1Scorers: this.state.team1Scorers + " " + shotResult[2] + ", " + this.state.gameTime, 
        team1Shots: (this.state.team1Shots + 1), 
        team1ShotsPercentage: team1ShootingPercentage, 
        team2ShotsPercentage: team2ShootingPercentage}, () => {

          setTimeout(function(){
            let thisCommentary = "*****GOAALLLLL*****";
            console.log("*****GOAALLLLL*****");
            this.setState({commentary: thisCommentary}, () => {


              const possessionFontColor = this.state.teamInPossession.fontColor;
              const possessionBackgroundColor = this.state.teamInPossession.backgroundColor;

              this.goalFlash();


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

      const goalCheer = document.getElementById("goalCheer");
      goalCheer.play();

      const totalShots = ((this.state.team1Shots) + (this.state.team2Shots + 1));

      const shootingPercentageReturns = stats.calculatePercentage(this.state.team1Shots, totalShots);
      const team1ShootingPercentage = shootingPercentageReturns[0];
      const team2ShootingPercentage = shootingPercentageReturns[1];


      this.setState({
        team2Score: (this.state.team2Score + 1), 
        team2Scorers: this.state.team2Scorers + " " + shotResult[2] + ", " + this.state.gameTime, 
        team2Shots: (this.state.team2Shots + 1), 
        team1ShotsPercentage: team1ShootingPercentage, 
        team2ShotsPercentage: team2ShootingPercentage}, () => {

          setTimeout(function(){
            let thisCommentary = "*****GOAALLLLL*****";
            console.log("*****GOAALLLLL*****");
            this.setState({commentary: thisCommentary}, () => {

              const possessionFontColor = this.state.teamInPossession.fontColor;
              const possessionBackgroundColor = this.state.teamInPossession.backgroundColor;

              this.goalFlash();


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

      const miss = document.getElementById("miss");
      miss.play();

      const possessionStats = new MatchStats();
      const totalPossession = ((this.state.team1Possession) + (this.state.team2Possession));
      const possessionPercentageReturns = possessionStats.calculatePercentage(this.state.team1Possession, totalPossession);

      const team1Possession = possessionPercentageReturns[0];
      const team2Possession = possessionPercentageReturns[1];

      if(this.state.teamInPossession === this.state.teams[0]){

        const totalShots = ((this.state.team1Shots + 1) + (this.state.team2Shots));
        
        const shootingPercentageReturns = stats.calculatePercentage(this.state.team1Shots + 1, totalShots);
        const team1ShootingPercentage = shootingPercentageReturns[0];
        const team2ShootingPercentage = shootingPercentageReturns[1];

        this.setState({
          teamInPossession: this.state.teams[1], 
          team2Possession: (this.state.team2Possession + 1), 
          team1PossessionPercentage: team1Possession, 
          team2PossessionPercentage: team2Possession, 
          team1Shots: (this.state.team1Shots + 1), 
          team1ShotsPercentage: team1ShootingPercentage, 
          team2ShotsPercentage: team2ShootingPercentage})
      }
      else{
        const totalShots = ((this.state.team1Shots) + (this.state.team2Shots + 1));
        
        const shootingPercentageReturns = stats.calculatePercentage(this.state.team1Shots, totalShots);
        const team1ShootingPercentage = shootingPercentageReturns[0];
        const team2ShootingPercentage = shootingPercentageReturns[1];
        
        this.setState({
          teamInPossession: this.state.teams[0], 
          team1Possession: (this.state.team1Possession + 1), 
          team1PossessionPercentage: team1Possession, 
          team2PossessionPercentage: team2Possession, 
          team2Shots: (this.state.team2Shots + 1), 
          team1ShotsPercentage: team1ShootingPercentage, 
          team2ShotsPercentage: team2ShootingPercentage})
      }

      const possessionFontColor = this.state.teamInPossession.fontColor;
      const possessionBackgroundColor = this.state.teamInPossession.backgroundColor;

      let thisCommentary = (shotResult[1]);
      console.log(shotResult[1]);
      this.setState({
        commentary: thisCommentary, 
        possessionFontColor: possessionFontColor, 
        possessionBackgroundColor: possessionBackgroundColor});

      this.timeElapse();  
      this.goalKick();
    }
  }

  goalFlash(){
    setTimeout(function(){
      this.setState({
        possessionFontColor: this.state.possessionBackgroundColor, 
        possessionBackgroundColor: this.state.possessionFontColor})
    }.bind(this), 200);
    setTimeout(function(){
      this.setState({
        possessionFontColor: this.state.possessionFontColor, 
        possessionBackgroundColor: this.state.possessionBackgroundColor})
    }.bind(this), 400);
    setTimeout(function(){
      this.setState({
        possessionFontColor: this.state.possessionBackgroundColor, 
        possessionBackgroundColor: this.state.possessionFontColor})
    }.bind(this), 600);
    setTimeout(function(){
      this.setState({
        possessionFontColor: this.state.possessionFontColor, 
        possessionBackgroundColor: this.state.possessionBackgroundColor})
    }.bind(this), 800);

  }

  gameStart(){
    const startWhistle = document.getElementById("startWhistle");
    const playCrowd = document.getElementById("audio");
    startWhistle.play();
    playCrowd.play();

    setTimeout(function(){ 
      this.setPossession(); 
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
      this.setState({
        commentary: thisCommentary, 
        possessionFontColor: possessionFontColor, 
        possessionBackgroundColor: possessionBackgroundColor});
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
      const playCrowd = document.getElementById("audio");
      const whistle = document.getElementById("startWhistle");
      whistle.play();
      playCrowd.pause();
      this.setState({
        gameTime: 45, 
        commentary: "Half time", 
        possessionFontColor: 'white', 
        possessionBackgroundColor: 'black', 
        half: "second"})
      console.log("*****Half time!*****");
    }.bind(this), 4000);
    return;
  }

  gameEnd(){
    setTimeout(function(){
      const finalWhistle = document.getElementById("finalWhistle");
      finalWhistle.play();
      this.setState({
        commentary: "Final whistle", 
        possessionFontColor: 'white', 
        possessionBackgroundColor: 'black'})
      console.log("*****There's the final whistle, the game has ended: Real Madrid ", this.state.team1Score + " - Barcelona " + this.state.team2Score + "*****");
      const playCrowd = document.getElementById("audio");
      playCrowd.pause();
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

    const Passes1 = {
      'backgroundColor': 'white',
      'color': 'black',
      'width': this.state.team1PassingPercentage + "%"
    }

    const Passes2 = {
      'backgroundColor': 'blue',
      'color': 'red',
      'width': this.state.team2PassingPercentage + "%"
    }

    const Shots1 = {
      'backgroundColor': 'white',
      'color': 'black',
      'width': this.state.team1ShotsPercentage + "%"
    }

    const Shots2 = {
      'backgroundColor': 'blue',
      'color': 'red',
      'width': this.state.team2ShotsPercentage + "%"
    }


    return(
      <div>
      <h1>Soccer Simulator 2017</h1>
      <audio id="audio">
      <source src="./sounds/crowd.ogg" type="audio/ogg"/>
      </audio>
      <audio id="startWhistle">
      <source src="./sounds/refWhistle.ogg" type="audio/ogg"/>
      </audio>
      <audio id="goalCheer">
      <source src="./sounds/goal.ogg" type="audio/ogg"/>
      </audio>
      <audio id="miss">
      <source src="./sounds/miss.ogg" type="audio/ogg"/>
      </audio>
      <audio id="finalWhistle">
      <source src="./sounds/finalWhistle.ogg" type="audio/ogg"/>
      </audio>
      <p id="commentary" style={commentaryStyle}>{this.state.commentary}</p>
      <p id="scores">{this.state.team1Score + " - " + this.state.team2Score}</p>
      <p id="time">{this.state.gameTime + "min"}</p>
      <div id="stats">
      <p className="statHeader">Possession</p>
      <p className="possession" style={Possession1}>{this.state.team1PossessionPercentage}</p>
      <p className="possession" style={Possession2}>{this.state.team2PossessionPercentage}</p>
      <p className="statHeader">Passing</p>
      <p className="passing" style={Passes1}>{this.state.team1Passes}</p>
      <p className="passing" style={Passes2}>{this.state.team2Passes}</p>
      <p className="statHeader">Shots</p>
      <p className="shots" style={Shots1}>{this.state.team1Shots}</p>
      <p className="shots" style={Shots2}>{this.state.team2Shots}</p>
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