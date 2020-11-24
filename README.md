
# Auto ML Entities extraction - Demo 1

This project is about data extraction from Gmail using its API and then create a JSON Lines file as a dataset for AutoML to be trained.

## AutoML quickstart

To get started with AutoML for entity extraction. First we need to understand what is AutoMl and what is capable of. To get more knowledge please use this Beginner's guide: https://cloud.google.com/natural-language/automl/docs/beginners-guide

Then, please read the following tutorial regarding entity extraction demo created by Google: https://cloud.google.com/natural-language/automl/docs/quickstart

## Our model

At LeanTech's Research & Development, we want to create an automated way to extract mails with unpredictable structure and find useful information about shipments and quotes. To achieve this, we are using AutoML for entity extraction.

The following project use the Gmail API to access a mail account and then format the information extracted as JSON Lines to create a dataset which will be used to train a custom model in AutoML.

To start using, authorize using the API Enable panel in Google Cloud Platform API section and downloading the **client_secret.json (MUST BE NAMED LIKE THAT)**

Please read this to further explanation: https://developers.google.com/gmail/api/quickstart/nodejs

The resultant JSON Lines will contain all the e-mail's id and text that matches the labels specified in the *getMessages* method. The format is according Google Cloud Platform parameters:

    let item = {
        'annotations': [],
        'text_snippet': {
            'content': <data>
        },
    }

## Available functions
All the following methods have a *auth* parameter that stands for an oAuth2Client object created by the *authorize* method.

To extract each mail information:

	// @param {google.auth.OAuth2} auth An authorized OAuth2 client.
    // @param {string} label Label ID to query messages.
	getMessages(auth, label)

To get a list of available lables, the *listLabels* method will do the job

    // @param {google.auth.OAuth2} auth An authorized OAuth2 client.
	listLabels(auth)

Then just run in your terminal

    node TextExtraction.js

The output is a JSON Lines file saved as *dataset.jsonl*
This file must be uploaded to a Google Storage Bucket in order to be imported in the AutoML GUI Console.

For further information please read: https://cloud.google.com/natural-language/automl/docs/prepare?_ga=2.137193078.-73856586.1605192318

Last update: 24 Nov 2020
