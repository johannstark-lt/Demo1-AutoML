
# Auto ML Entities extraction - Demo 1 :computer:

This project is about data extraction from Gmail using its API and then create a JSON Lines file as a dataset for AutoML to be trained.

## AutoML quickstart

To get started with AutoML for entity extraction. First we need to understand what is AutoML and what is capable of.

To get more knowledge, please use this Beginner's guide: https://cloud.google.com/natural-language/automl/docs/beginners-guide

Then, please read the following tutorial regarding entity extraction demo created by Google: https://cloud.google.com/natural-language/automl/docs/quickstart

## Our model

At LeanTech's Research & Development, we want to create an automated way to extract mails with unpredictable structure and find useful information about shipments and quotes. To achieve this, we are using AutoML for entity extraction.

The following project use the Gmail API to access a mail account and then format the information extracted as JSON Lines to create a dataset which will be used to train a custom model in AutoML.

To start using, authorize using the API Enable panel in Google Cloud Platform API section and downloading the **client_secret.json (MUST BE NAMED LIKE THAT)**

Please read this to further explanation: https://developers.google.com/gmail/api/quickstart/nodejs

Now, to gain access to the project in Google Cloud Platform:
* Create a GCP account first.
* Enable a billing account.
* Contact me at [jcamacho@lean-tech.io](mailto:jcamacho@lean-tech.io) regarding this project and your GCP Account address.

Please to use the various methods of this script, uncomment and comment as desired.

## The script

The script will need you to specify a max number of results per label. **If no max Results, it will gather all available mails.**

To run it, just type in your terminal:

```console
node TextExtraction.js <command> <maxResults>

-l : List the available labels.
-q : Query the mails for the given labels.
<maxResults> : Max number of mails.
```

**The labels are hardcoded. If want to query different labels, please edit the code.**

The resultant JSON Lines will contain all the e-mail's id and text that matches the labels specified in the *getMessages* method. The format is according Google Cloud Platform parameters:

```javascript
let item = {
    'annotations': [],
    'text_snippet': {
        'content': <data>
    },
}
```

## Available functions
All the following methods have a *auth* parameter that stands for an oAuth2Client object created by the *authorize* method.

To extract each mail information:

```javascript
// @param {google.auth.OAuth2} auth An authorized OAuth2 client.
// @param {string} label Label ID to query messages.
// @param {integer} maxResultsN max number of mails.
getMessages(auth, label, maxResultsN)
```

To get a list of available lables, the *listLabels* method will do the job

```javascript
// @param {google.auth.OAuth2} auth An authorized OAuth2 client.
listLabels(auth)
```

The output is a JSON Lines file saved as *dataset.jsonl*. Also, must exists a CSV file that refers to these .jsonl files. This CSV it has to be imported at the AutoML console.

The structure for the CSV file must be as shown below:

	<type of dataset>,<Google cloud storage URI>
	TRAIN, gs://myBucket/dataset1.jsonl
	TEST, gs://myBucket/dataset2.jsonl

	If no split is gonna be made, just start the row with a comma to indicate the first column to be empty
	, gs://myBucket/dataset.jsonl

For further information please read: https://cloud.google.com/natural-language/automl/docs/prepare?_ga=2.137193078.-73856586.1605192318

## About the business logic

To get a better view about how to guide the effort of this project, here is the deal:

We need to identify some parameter from each mail given by the shippers. This may come in countless forms within the body of the message.

In this GoogleDocs you will find the parameters we require to identify: https://docs.google.com/document/d/1F7UyblqWGAixb2pdPzcwI7LTxEpQrUjA4twX7Nv0F_8/edit?ts=5fac5ce3

## What we need to develop now?

* Acquire more useful and variable data from mails. Not just the same mail forwarded 5 times. Please.
* To implement an algorithm which cleans the raw format of the message to get the most clear info possible.
* An automatic way to create the CSV as this docs refers.
* A piece of code to upload automatically the **.jsonl** files and the **CSV**. This will require a GCP sdk kit installed.
* Maybe an piece of code to automatically label the data. (But that could also be ML haha)

Once the model has been trained and deployed. We'll need to create a client for the AutoML API.
When the model is ready. The AutoML console has a tab called **"TEST & USE"**. Here you will find how to use the custom model via a REST API or Python.

___

Last update: 24 Nov 2020  
Created with :heart: by Juanes at LeanTech :rocket:
