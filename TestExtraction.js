//TestExtraction.js
//Demo 1
//Created by Juanes
//13-Nov-2020

//Library loading
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const base64url = require('base64url');
const {htmlToText} = require('html-to-text');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), main);
});

function main(auth) {
    //Execute the methods
    listLabels(auth);
    getMessages(auth, 'Label_1284463139380004146');
}

/** Docstring
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      //console.log('Labels:');
      labels.forEach((label) => {
        //console.log(`- ${label.name} | ${label.id}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}

/**
 * Extract 1 message of given label and display the text of its body
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} label Label ID to query messages.
 */
function getMessages(auth, label) {
  var item = {}, txtPkg = [];
  const gmail = google.gmail({version: 'v1', auth});
  //Query the message list of given label
  gmail.users.messages.list({
    userId: 'me',
    maxResults: 1,
    labelIds: label,
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const msgs = res.data.messages;
    if (msgs) {
      //console.log('Messages adquired!');
      // Iterate through the messages in raw format
      msgs.forEach((msg) =>{
        gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'raw',
        }, (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          //console.log("Message Body: \n");
          // Decode de raw format from base64url and then from html to text
          let decodedInfo = base64url.decode(res.data.raw);
          item.id = msg.id;
          item.text = htmlToText(decodedInfo, {wordwrap: null});
          console.log(htmlToText(decodedInfo, {wordwrap: null}));

          // Add the item to the text package
          txtPkg.push(item);
        });
      });
    } else {
      console.log('No mails found.');
    }
  });
  console.log(txtPkg);
  return txtPkg;
}
