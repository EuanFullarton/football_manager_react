import React from 'react';

class MainView extends React.Component {

  constructor(props) {
    super(props);
    this.sendHTTPRequest = this.sendHTTPRequest.bind(this);
    this.state = {
      teams: []
    }
  }

  sendHTTPRequest(url) {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = () => {
      if(request.status === 200){
        const teams = JSON.parse(request.responseText);
        this.setState({teams: teams});
      }
    };
    request.send(null);
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

export default MainView;