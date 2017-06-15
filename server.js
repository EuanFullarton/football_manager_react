var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var TEAMS_JSON = path.join(__dirname, 'data/teams.json');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.get('/game', function(req, res){
  fs.readFile(TEAMS_JSON, function(err, data){
    if(err) process.exit(1);

    res.json(JSON.parse(data));
  })
})


app.use(express.static('client/build'));


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
