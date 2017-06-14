var React = require('react');
var ReactDOM = require('react-dom');

window.onload = function () {
  var appDiv = document.getElementById('app');

  var header = <h1>Football Manager render</h1>
  ReactDOM.render(header, appDiv);
};
