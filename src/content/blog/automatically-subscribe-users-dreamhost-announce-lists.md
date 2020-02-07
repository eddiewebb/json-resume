---
title: 'Automatically subscribe users to DreamHost announce lists'
date: Wed, 19 Aug 2009 18:58:01 +0000
draft: false
tags: [api, dreamhost, MIsc.Tips, web development]
---

This is a response to a question on the DreamHost wiki posted by anonymous.

> "I have a Contact page using form mail, and want to include a checkbox that enable visitors, to also subscribe to our Announce List when posting their form mail. Is there a facility for adding users to the Announce List without using form POST"

Without using POST? I am not sure about that.. but using a checkbox to subscribe users is a snap. Your resources;

*   DreamHost Panel API
*   PHP curl methods

So it goes like this; Your user registers a new account, or sends you a contact message. As part of the form they submit their email address and name.  We in turn pass that email and name onto DreamHost's panel API thereby adding the user to future announcements. The code I will explain needs to go in the form's receiving code. We will check for the checkbox's value, and if necessary handle the additional choir. This code should be pasted into your contact form or registration form wherever the initial data is received and handled.

[![The red boundary denotes new code for the announce submission](https://blog.edwardawebb.com/wp-content/uploads/2009/08/process1.png "process")](https://blog.edwardawebb.com/wp-content/uploads/2009/08/process1.png)

The red boundary denotes new code for the announce submission

Since every cms, site and blog are different, I am unable to provide specifics, but yu should be able to track down the code for your form and find the portion that handles the submission. (Most obviously denoted with $\_POST or $\_GET variable use.)  I will also assume your email field is named 'email' and your name field is two fields; 'firstName', 'lastName';

### Details on the API command

Below is a link to details on the command, needed parameters and possible responses. [Add Subscriber API Command](http://wiki.dreamhost.com/Application_programming_interface#announcement_list-add_subscriber)

### The Announce Submission Code

if(isset($\_POST\['subscribeMe'\]) && $\_POST\['subscribeMe'\] == 1)
{

       //get the values we need from form(this should in aprt already be somewhere in the code your editing)
       $email=$_POST\['email'\];
       $fullName=$\_POST\['firstName'\]." ".$\_POST\['lastName'\];

       //set values we shoudl know, and are constant
       $domain="domain of this form";
       $listname="list-name";
       $apiKey="666666666666";

       // using curl and passing 5 critical values to the api
       // list, domain, email, name and API Key


		$ch = curl_init('https://api.dreamhost.com/');
 		curl\_setopt ($ch, CURLOPT\_POST, 1);
 		curl\_setopt ($ch, CURLOPT\_POSTFIELDS, "key=$apiKey&cmd=announcement\_list-add\_subscriber&listname=$listname&domain=$domain&email=$email&name=$fullName");
 		$result=curl_exec ($ch);
 		curl_close ($ch);

		if ( stripos( $result,'success') > 0){
			echo "

Congrats! 
----------

You have been added to our Mailing List

";
		}else{
			echo "

 Ooops! 
--------

Unable to add your email to our announcement list please contact site administrator.

";
			echo "Code: " . $result;
		}
}// end if subscribe box checked

### Getting a DreamHost API key

[More info on DreamHost API](http://wiki.dreamhost.com/Application_programming_interface#What_values_does_DreamHost.27s_API_use.3F)
