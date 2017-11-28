'use strict';

const https = require("https"),
    http = require("http"),
    schedule = require("node-schedule"),
    crypto = require('cryptlib'),
    winston = require('winston'),
    _ = require('winston-loggly'); // Exposes winston.transports.Loggly

function decrypt(string) {
  return crypto.decrypt(string, "1bf6bf65e45b55825b1919cbadd028e6", "_sbSmKUxVQAQ-hvQ");
}

// Set up logging.
const logglyToken = decrypt("YSspFcgYs1Fv73T7o3ZEkU5EZvGMZsINhX4+kY5WjDmaxxIaIUHzpoT6KU+uph3O");
const logglySubdomain = "wildcatconnect";
const nodeTag = "web";

winston.add(winston.transports.Loggly, {
  token: logglyToken,
  subdomain: logglySubdomain,
  tags: [nodeTag],
  json: true
});

// Create a map from names to timing configurations.
const jobs = {
  'alertDelete': {
    hour: 1,
    minute: 0
  },
  'alertPush' : {
    minute: [0, 15, 30, 45]
  },
  'commDelete': {
    hour: 1,
    minute: 5
  },
  'dayDelete': {
    hour: 0,
    minute: 10,
    dayOfWeek: [2, 3, 4, 5, 6]
  },
  'dayGenerate': {
    hour: 0,
    minute: 5,
    dayOfWeek: [1, 2, 3, 4, 5]
  },
  'ECUdelete': {
    hour: 1,
    minute: 10
  },
  'eventDelete': {
    hour: 1,
    minute: 20
  },
  'newsDelete': {
    hour: 1,
    minute: 25
  },
  'pollDelete': {
    hour: 1,
    minute: 35
  },
  'scholarshipDelete': {
    hour: 1,
    minute: 40
  }
}

const LOCAL = false;
const host = LOCAL ? "localhost" : "wildcatconnect.com";
const port = LOCAL ? 5000 : 443;
const data = {
  secret: decrypt("BwKVzA56kCnnn4kUXukK9w==")
}

function runJob(key) {
  let postData = JSON.stringify(data);

  let options = {
    host: host,
    port: port,
    path: "/job/" + key,
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  // Make request using proper security.
  let method = LOCAL ? http.request : https.request;
  method(options, function(res){
    winston.log("info", "Running job with key: " + key + ".", {});
    res.on('data', function(data){
      let result = data.toString();
      winston.log("info", "Response: " + result, {});
    });
  }).write(postData);
}

function scheduleJobs() {
  // Schedule all jobs based on our mapping.
  let result = [];

  Object.keys(jobs).forEach(function (key) {
    let timing = jobs[key];
    let j = schedule.scheduleJob(timing, function() {
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
winston.log("info", "Initialized all jobs on our worker server.", {});
