---
title: 'Validating Optional Fields in CakePHP - The dreaded OR scenario'
date: Thu, 12 Feb 2009 00:01:32 +0000
draft: false
tags: [CakePHP, CakePHP, validation]
---

So I am proud to say I frequent the CakePHP group on Google, and try to offer my assistance when I can. A lot of times I see people asking how they can **validate optional fields, or validate fields that are dependent on others**. An example, sure: Imagine you have an employees model.. yeah all modeled up, that looks good, nice work. When you get to validation you realize.... To register they must enter **either** their PIN # **or** their First and Last Name. ..but not all three. THere are other scenarios you might think of... Cell or Work phone.... Email or mailing address.. etc..etc. What gets a little more interesting here is that we should provide unique errors for each possible situation. Initially we can just ask for PIN or names.   If they enter just the PIN then they are all set, don't bother them with either name.  If the user enters only their first name we say OK, they are trying names, but we need to ask for their last name, and not worry about the PIN. Same for just their last name, a unique error asking for first name. As of yet I don't believe CakePHP has a built in validation rule for such, but that's no problem. Because CakePHP plays so nice, and is so extensible that it only takes a little bit of thought to make this a relatively simple feat.  Curious?  Read on!

Validating Optional Fields in a CakePHP Model
---------------------------------------------

I am only going to share the model here because that is where the validation occurs. The corresponding form and controller could be baked or scaffolded, nothing special.

*   Model
*   Demo

The controller and other views are just as any other CakePHP collections. My example will follow the one proposed in the beginning of this article. Users must enter a PIN number or the must enter a first and last name. But we will not require all three. The trick is using one common method to check all related fields that has an awareness into the field that it is checking. THis allows you to compare the fields, determine the scenario, and print back the proper response for all them.

The Model
---------

This is where all the magic happens, focus on the **$validates** values and the **validateDependentFields()** function.

#### /app/models/user.php

array());
    var $displayField = 'first_name';
	var $recursive = 0;
	var $validate = array(
        'username' => array(
		        'required' => array('rule'=>VALID\_NOT\_EMPTY,'message'=>'Please enter your login name'),
		        'pattern' => array('rule' => array('custom','/\[a-zA-Z0-9\\_\\-\]{6,30}$/i'),'message'=>'Must be 6 characters or longer with no spaces.'),
				'unique' => array('rule' => array('validateUniqueUsername'),'message'=>'This username is already in use, please try another.'),						
    		),			
        'first_name' => array(
		        'required' => array('rule'=>'validateDependentFields'),
		        'length' => array( 'rule' => array('maxLength', 60),'message'=>'That names a bit too long, keep it under 60 characters' )
    		),			
		'last_name' => array(
		        'required' => array('rule'=>'validateDependentFields'),
		        'length' => array( 'rule' => array('maxLength', 60),'message'=>'That names a bit too long, keep it under 60 characters' )
    		),			
		'employee_pin' => array(
		        'required' => array('rule'=>'validateDependentFields'),
		        'length' => array( 'rule' => array('maxLength', 60),'message'=>'That names a bit too long, keep it under 60 characters' )
    		),			
		'password' => array(
						'required' => array('rule' => array('custom','/(?=^.{4,}$)((?=.*\\d)|(?=.*\\W+))(?!\[.\\n\])(?=.*\[A-Z\])(?=.*\[a-z\]).*$/'),'message'=>'Must be 6 characters or longer'),
						'length' => array( 'rule' => 'validatePassword','message'=>'Your passwords dont match!' ) 
					),
		'email' => array('rule'=>'email','message'=>'Please enter your email address')
	);
	
	
	
	/\*\*
	 \* query functions
	 \* 
	 \*/
	 

	/\*\*
	 \* validation functions
	 */
	


	function validatePassword(){
		$passed=true;	
			//only run if there are two password feield (like NOT on the contact or signin pages..)
		if(isset($this->data\['User'\]\['confirmpassword'\])){
			
			if($this->data\['User'\]\['password'\] != $this->data\['User'\]\['confirmpassword'\]){
		    	//die('you fail');
		    	$this->invalidate('checkpassword');
		    	//they didnt condifrm password
		    	$passed=false;		 
		 	}else{
				//hash passwordbefore saving
				$this->data\['User'\]\['password'\]=md5($this->data\['User'\]\['password'\]);		   					
			}	
		}
		
		return $passed;
	}
	
	
	/\*\* 
	 \* see whats up
	 \* 
	 \* 
	 */
	function validateDependentFields(&$field){
		//assume the best of people :)
		$passed=true;
							
		//we capture the value of the current field into $field
		
		
		switch(true){
			case array\_key\_exists('first_name',$field):
			//checking first name field
				//if pin is set then we dont care about first anme
				if(isset($this->data\['User'\]\['employee\_pin'\]) && !empty($this->data\['User'\]\['employee\_pin'\])){
					$passed=true;
				}else{
					//no pin, if this field is empty, scold them
					if(empty($this->data\['User'\]\['first_name'\])) $passed="Please enter your First Name";
				}
			break;
			case array\_key\_exists('last_name',$field):
				//again, if Pin is set we skip, otherwise scold
				if(isset($this->data\['User'\]\['employee\_pin'\]) && !empty($this->data\['User'\]\['employee\_pin'\])){
					$passed=true;
				}else{
					//no pin, if this field is empty, scold them
					if(empty($this->data\['User'\]\['last_name'\])) $passed="Please enter your Last Name";
				}
			break;
			case array\_key\_exists('employee_pin',$field):
				//checking PIN. ONly scold if empty  and first and last empty too
				if(
					empty($this->data\['User'\]\['first_name'\]) 
					&& empty($this->data\['User'\]\['last_name'\])
					&& empty($this->data\['User'\]\['employee_pin'\])
				){
					$passed="You must enter your PIN, or name";
				}
			break;
			
		}

		return $passed;
	}
	
	
}?>