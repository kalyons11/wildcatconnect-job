'use strict';

// This is our main script to run jobs for the WildcatConnect application.

// So, right now we have a directory of jobs - let's parse that.

const path = require("path"),
    https = require("https"),
    http = require("http"),
    schedule = require("node-schedule");

// Create a map from names to configurations.
const jobs = [
  'alertDelete',
  'alertPush',
  'commDelete',
  'dayDelete',
  'dayGenerate',
  'ECUdelete',
  'eventDelete',
  'newsDelete',
  'pollDelete',
  'scholarshipDelete'
];

const mainConfig = {};

for (let i = 0; i < jobs.length; i++) {
  let thisConfig = path.join(__dirname, jobs[i], 'config.js');
  mainConfig[jobs[i]] = require(thisConfig);
}

// Now that we have all configurations, we can schedule our jobs.

function runJob(key) {
  let config = mainConfig[key];
  let postData = JSON.stringify(config.data);
  let options = {
    host: config.host,
    port: config.port,
    path: config.path,
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  if (config.secure) {
    https.request(options, function(res){
      console.log("info", "Running job with key: " + key + ".", {});
      res.on('data', function(data){
        let result = data.toString();
        console.log("info", "Response: " + result, {});
      });
    }).write(postData);
  } else {
    console.log("info", "Running job with key: " + key + ".", {});
    http.request(options, function(res){
      res.on('data', function(data){
        let result = data.toString();
        console.log("info", "Response: " + result, {});
      });
    }).write(postData);
  }
}

function scheduleJobs() {
  // Schedule all jobs based on our mapping.
  let result = [];

  Object.keys(mainConfig).forEach(function (key) {
    let config = mainConfig[key];
    let j = schedule.scheduleJob(config.timing, function() {
      runJob(key);
    });
    result.push(j);
  });

  // Return a list of all jobs for reference.
  return result;
}

if (process.argv.length > 2) {
  for (var i = 2; i < process.argv.length; i++) {
    runJob(process.argv[i]);
  }
}

var j = scheduleJobs();
console.log("info", "Initialized all jobs on our worker server.", {});
