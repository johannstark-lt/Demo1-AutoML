//TestExtraction.js
//Demo 1
//Created by Juanes at LeanTech

// Library loading
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const base64url = require('base64url');
const {htmlToText} = require('html-to-text');
const converter = require('json-2-csv');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
var dataPkg = [];
//regex to clean the data
const regex = /(\r?\n|\r){2,}/g;

// Load client secrets from a local file.
fs.readFile('client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the main program.
    authorize(JSON.parse(content), main);
});

// Body of the program ------------------- //
function main(auth) {
	// Uncomment if you want to print a list of labels
    //listLabels(auth);

	// The actual fun is here :v
	getMessages(auth, 'Label_1284463139380004146', dataPkg).then( () => {
		//Query for other label. If necessary, comment this code
		getMessages(auth, 'Label_1660852500093222718', dataPkg).then( () => {
				//Test console
				console.log(dataPkg);

				// Finally, convert to CSV
				// IF YOU NEED ONLINE 1 LABLE, CUT AND PASTE THE folowwing
				// FOLLOWING CODE IN THE .then OF THE FIRST LABEL QUERY
				converter.json2csv(dataPkg, (err, csv) => {
					if (err) throw console.log("Failed. Error: "+err);
					//Write the csv File
					fs.writeFileSync('dataset.csv', csv);
					console.log("Program terminated");
				});
		});

    });
}

// Functions ------------------------------ //

/** authorize
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
	    if (err) return getNewToken(oAuth2Client, callback);
	    oAuth2Client.setCredentials(JSON.parse(token));
	    callback(oAuth2Client);
    });
}

/** getNewToken
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

/** listLabels
 * Lists the labels in the user's account.
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
            console.log('Label Name | Label ID:\n');
            labels.forEach((label) => {
            console.log(`- ${label.name} | ${label.id}`);
            });
        } else {
            console.log('No labels found.');
        }
    });
}

function getMailList( gmail, configuration ) {
   return new Promise((resolve, reject) => {
        gmail.users.messages.list( configuration, (err, res) => {
            if (err) {
                reject( err );
            } else {
                resolve( res );
            }
        });
   } );
}

function getMailContent( gmail, configuration ) {
    return new Promise( (resolve, reject) => {
        gmail.users.messages.get( configuration, (err, res) => {
            if (err) {
                reject( err );
            } else {
                resolve( res );
            }
        });
    } );
}

/**getMessages
 * Extract 1 message of given label and display the text of its body
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} label Label ID to query messages.
 */
async function getMessages(auth, label, dataList) {
    var item = {};
    const gmail = google.gmail({version: 'v1', auth});
    // Query the message list of given label
	// For testing porpuses, add maxResults: 1
	// to que gmail query.
    const res = await getMailList( gmail, { userId: 'me', labelIds: label } );
    const msgs = res.data.messages;
    if (msgs) {
        console.log('Messages adquired for the label: '+label);
        // Iterate through the messages in raw format
        for ( const msg of msgs ) {
			// Query the details of each mail on the list
            const res = await getMailContent( gmail, { userId: 'me', id: msg.id, format: 'raw' } );
			// Decode the body of the mail
			let decodedInfo = base64url.decode(res.data.raw);

			// Uncomment below for testing porpuses -----------------
			//let auxStr = htmlToText(decodedInfo, {wordwrap: null}).replace(regex, "\n");
			//console.log(auxStr);

			//Store the info in the JSON variable
            dataList.push( {
                id: msg.id,
                text: htmlToText(decodedInfo, {wordwrap: null}).replace(regex, "\n")
            } );
        }
    } else {
        console.log('No mails found.');
    }
}
