---
title: 'Heavy duty password validation in CakePHP'
date: Tue, 05 Aug 2008 20:06:10 +0000
draft: false
tags: [CakePHP, CakePHP, password validation]
---

When validating passwords for new users or changing passwords for existent users there are three main concerns.

1.  **You want passwords to match**
2.  **You want passwords to be 'strong' (meaning complex)**
3.  **You want to store the passwords under some encryption**

_*Strong in this case means a minimum of 8 characters with no whitespace. It must contain upper case and lower case letters, and at least 1 digit or special character._

### If your using 1.2 RC1 or higher, [jump to here](#1.2).

The caveat there is obvious, if your using one way encryption like md5, **you must validate before you encrypt**. Using the built in var $validate will gooey this all up, forcing you to hash before you save and then trying instead to validate the hashed password. So instead I wrote a very simple function for use in the user model to validate against all three of these concerns. **If you just want to get some regular expressions to use in PHP or other languages, [read this article](https://blog.edwardawebb.com/web-development/validating-complex-passwords "Regular Expressions for Complex Passwords").** Otherwise you may find this implementation useful.

> This article is outdated for newer releases of CakePHP. Instead please see my article on [validation in CakePHP 1.2](https://blog.edwardawebb.com/site-news/complex-validation-cakephp-12 "Learn how easy it can be leverage some complicated validation tasks")

The User Controller and Registration Action
-------------------------------------------

First we'll have a look in the users controller's registration action. You'll notice we don't mess with the password or validation, and just call our save method as normal.

#### in app/controllers/user_controller.php

   	if ($this->User->save($this->data)) { 
           /\*
            \* Data was saved successfully
            */					
		$this->Session->setFlash('The User has been registered, please login');
		$this->redirect('/');
	}

Wow, thats almost like a fresh baked action.. good sign.  

The Model and Validate function
-------------------------------

Now we leverage a built in function call **_validates()_** to check for our pattern, check for matching passwords, and finally hash the prevailing password before saving.

#### In app/models/user.php

/\*
\* This method gets called automagiclly for us, and does 3 things
\* validates against a regular expression, ensuring it is 'strong'
\* confirms the user entered the same password twice
\* if both above passs, it hashes the surviving password to be saved
*/
	function validates($options = array())
	{
		$pass=$this->validatePassword();
		return $pass;
	} 
	function validatePassword(){	
		//die($this->data\['User'\]\['password'\].' :: '.$this->data\['User'\]\['confirmpassword'\]);
		if(isset($this->data\['User'\]\['confirmpassword'\])){
			if(!preg_match('/(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?!\[.\\n\])(?=.*\[A-Z\])(?=.*\[a-z\]).*$/',$this->data\['User'\]\['password'\])){
				//doesnt mneet our 1 upper, one lower, 1 digit or special character require,ent
				$this->invalidate('password');
		    	$this->data\['User'\]\['password'\]=null;
			}elseif($this->data\['User'\]\['password'\]!=$this->data\['User'\]\['confirmpassword'\]){
		    	$this->invalidate('checkpassword');
		    	//they didnt condifrm password
			}else{
				//hash passwordbefore saving
				$this->data\['User'\]\['password'\]=md5($this->data\['User'\]\['password'\]);		   					
			}
		
		}
		 $errors = $this->invalidFields();
		
		 return count($errors) == 0;
	}

  
So the idea is that we call the models save method, which in turn calls our validates method. The alidates method will print cause one of two error messages, or allow the successful save. So where do those two error messages go? But in our views of course. Since I'm using the register action for this example, I will stick with my register view

The Registration View and Dual Validation Error messages
--------------------------------------------------------

So we have two text boxes, password and confirm password. We also use 2 error messages, one for bad pattern matching or 'weak ' password the other for missing password confirmation, or bad password confirmation.

#### in app/views/users/register.ctp

 
	label('User/password', 'Password');?>
 	password('User/password', array('size' => '30'));?>
	error('User/password', 'The password must contain both upper case and lower case characters with at least 1 digit or special character');?>

 
	label('User/confirmpassword', 'Confirm Password');?>
 	password('User/confirmpassword', array('size' => '30'));?>
	error('User/checkpassword', 'Please Be Sure Passwords Match.');?>

  

1.2 Users
---------

For CakePHP 1.2 we can follow a slightly different, and in my opinion an preferable way. 1.2 Does a nice job of allowing for custom Validation. You can set criteria within your model, and even set all error messages to prevent typos and redundant data. Best of all we can call a function to run in place of a rule for more complex actions (like checking for match then hashing) Read my more recent article '[Complex Validation with CakePHP 1.2](https://blog.edwardawebb.com/site-news/complex-validation-cakephp-12 "Learn how easy it can be leverage some complicated validation tasks")'
