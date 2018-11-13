#!/usr/bin/env node

var alexa = require('alexa-app');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app with name that matches name on Alexa Skills Kit
var app = new alexa.app('hopper_controller');

app.launch(function(req, res) {
  console.log("publish-example: hopper_controller");
  res.say("Launched hopper_controller skill");
});

// to get slots:
// req.data.request.intent.slots.slot_name.value

// to publish a string
// schedule_move.publish({data: "wave_hi"});

app.intent("HopperDance", {
  "utterances": ["Do the {dance_type} dance"]
}, function(req, res) {
  console.log("This is dance " + req.data.request.intent.slots.dance_type.value);
  if (req.data.request.intent.slots.dance_type.value === "wave"){
    schedule_move.publish({data: "wave_hi"});
  }
  else if (req.data.request.intent.slots.dance_type.value === "happy"){
    schedule_move.publish({data: "happy_dance"});
  }
  else if (req.data.request.intent.slots.dance_type.value === "sad"){
    schedule_move.publish({data: "sad_emote"});
  }
  res.say('');
});

app.intent("PublishHelloIntent", {
  "utterances": ["Say hi", "Say hello"]
}, function(req, res) {
  schedule_move.publish({data: "wave_hi"});
  res.say('');
});

app.intent("OpenPodBayDoors", {
  "utterances": ["Open pod bay doors"]
}, function(req, res) {
  speak_topic.publish({data: "i_am_sorry"});
  res.say('');
});

// ------------------ //
/// ROS Interface section ///
// ------------------ //

// Connecting to ROS
var ROSLIB = require('roslib');
// rosbridge_websocket defaults to port 9090
var ros = new ROSLIB.Ros({url: 'ws://localhost:9090'});

ros.on('connection', function() {
  console.log('publish-example: Connected to websocket server.');
});

ros.on('error', function(error) {
  console.log('publish-example: Error connecting to websocket server: ', error);
});

ros.on('close', function() {
  console.log('publish-example: Connection to websocket server closed.');
});

var schedule_move = new ROSLIB.Topic({ros: ros, name: '/hopper_schedule_move', messageType: 'std_msgs/String'});
var speak_topic = new ROSLIB.Topic({ros: ros, name: '/hopper_play_sound', messageType: 'std_msgs/String'});


// Export the alexa-app we created at the top
module.exports = app;
