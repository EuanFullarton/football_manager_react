import React from 'react';

class StartGame extends React.Component{

  constructor(props) {
    super(props);
  }

  handleButtonClick() {
    this.props.startGame();
  }

  render() {
    return (
      <div>
      <button className="startGameBtn" onClick={this.handleButtonClick.bind(this)}>Kick off</button> 
      </div>
      )
  }
}

export default StartGame;