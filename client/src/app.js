import React from 'react';
import ReactDOM from 'react-dom';
import MainView from './components/MainView.jsx';

window.onload = function () {
  ReactDOM.render(
    <MainView url='/game'></MainView>, 
    document.getElementById('app')
    );
};
