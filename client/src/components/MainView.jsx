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
      {this.teams}
      </div>
      )
  }
}

export default MainView;