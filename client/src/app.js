import React from 'react';
import ReactDOM from 'react-dom';
import Game from './containers/Game.jsx';
import Player from './components/Player.jsx'

window.onload = function () {
  ReactDOM.render(
    <Game url='/game'></Game>,
    document.getElementById('app')
    );
};
