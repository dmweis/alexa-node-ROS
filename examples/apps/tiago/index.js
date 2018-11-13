#!/usr/bin/env node

var alexa = require('alexa-app');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app with name that matches name on Alexa Skills Kit
var app = new alexa.app('tiago_controller');

app.launch(function(req, res) {
  console.log("publish-example: tiago_controller");
  res.say("Launched tiago_controller skill");
});

// to get slots:
// req.data.request.intent.slots.slot_name.value

// to publish a string
// speak_topic.publish({data: "wave_hi"});

app.intent("BringObject", {
  "utterances": ["Bring me {subject}", "Get me {subject}"]
}, function(req, res) {
  // Log to console that the intent was received
  console.log("BringObject was requested");
  msg_topic.publish({data: req.data.request.intent.slots.subject.value});
  res.say('On my way to bring ' + req.data.request.intent.slots.subject.value);
});

app.intent("GoToWaypoint", {
  "utterances": ["Go to {waypoint} waypoint"]
}, function(req, res) {
  // Log to console that the intent was received
  console.log("GoToWaypoint req");
  res.say('Going to ' + req.data.request.intent.slots.waypoint.value);
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

var bring_topic = new ROSLIB.Topic({ros: ros, name: 'tiago/bring_object', messageType: 'std_msgs/String'});

// Export the alexa-app we created at the top
module.exports = app;