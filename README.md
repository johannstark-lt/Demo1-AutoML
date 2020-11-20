
# Demo 1 project

This project is about data extraction from Gmail using its API and then create a CSV.

To start using, authorize using the API Enable panel in Google Cloud Platform API section and downloading the **client_secret.json (MUST BE NAMED LIKE THAT)**

All the following methods have a *auth* parameter that stands for an oAuth2Client object created by the *authorize* method.

The resultant CSV will contain all the e-mail's id and text that matches the labels specifed in the *getMessages* method.

	// label as a String
	getMessages(auth, label)

To get a list of available lables, the *listLabels* method will do the job

	listLabels(auth)

Then just run

    node TextExtraction.js

Last update: 20 Nov 2020
