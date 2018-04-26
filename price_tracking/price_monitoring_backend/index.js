/*
  Requiring necessary helpers.
*/
var express = require('express');
var request = require('request');
var fs = require('fs');
var app = express();
var Appbase = require('appbase-js');
var helper = require("./helper.js");

/*
  Including appbase credentials stored in json file.
*/
var appbaseCredentials = require('./appbase_credentials.json');
var sendgrid_api_key = "ENTER_YOUR_SENDGRID_API_KEY_HERE"

/*
  Appbase Credentials. Just make new account at appbase and configure it according to your account.
  Creating object of appbase, passing appbaseCredentials.
*/
var appbase = new Appbase(appbaseCredentials);

/* This is to access any file withn folder, no routing required for these files. */
app.use('/', express.static(__dirname + '/'));