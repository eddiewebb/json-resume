---
title: 'Complex Validation in CakePHP 1.2'
date: Tue, 18 Nov 2008 23:43:30 +0000
draft: false
tags: [CakePHP, CakePHP, unique field, validation]
---

With version 1.2 we got a much more powerful validation feature. I think that many people migrating from version 1.1 may not realize how much it offers. I offer a simple Users model. It has fields like username, password and email that require special and perhaps multiple validation rules. Here's how we'll get tricky;

*   Username must be atleast X characters without spaces,
*   Username must of course, Be unique!
*   Email must be valid email and Unique
*   Password must be confirmed during registration or renewal process That is to say compared.

We can also set a unique error message to each rule, and it will apply to both our add and edit forms.

### Controller

No special work is done in the controller, so you can just use your basic scaffolded controller action and $this->Model->save() method. All the trickery can be handled within the model.

### Model

Here's where the magic happens. We can use multiple rules per field. This included minimum / maximum length requirements; and for username, a special RegEX. The password field also has a basic RegEx check before calling in a method to compare the two password fields before signing off and hashing the field. Each individual rule is assigned its own error message.

#### 1.2 Users - In app/models/user.php

 class User extends AppModel{
var $name = 'User';
var $actsAs = array ('Userban'=>array());
var $displayField = 'first_name';
var $recursive = 0;
var $validate = array(
'username' => array(
'required' => array('rule'=>VALID\_NOT\_EMPTY,'message'=>'Please enter your login name'),
'pattern' => array('rule' => array('custom','/\[a-zA-Z0-9\\_\\-\]{6,30}$/i'),'message'=>'Must be 4 characters or longer with no spaces.'),
'unique' => array('rule' => array('validateUniqueUsername'),'message'=>'This username is already in use, please try another.'),
),
'first_name' => array(
'required' => array('rule'=>VALID\_NOT\_EMPTY,'message'=>'You\\'ll need a name friends and family will recognize!'),
'length' => array( 'rule' => array('maxLength', 60),'message'=>'That names a bit too long, keep it under 60 characters' )
),
'last_name' => array(
'required' => array('rule'=>VALID\_NOT\_EMPTY,'message'=>'You\\'ll need a name friends and family will recognize!'),
'length' => array( 'rule' => array('maxLength', 60),'message'=>'That names a bit too long, keep it under 60 characters' )
),
'password' => array(
'required' => array('rule' => array('custom','/\[a-zA-Z0-9\\_\\-\]{6,}$/i'),'message'=>'Must be 6 characters or longer'),
'length' => array( 'rule' => 'validatePassword','message'=>'Your passwords dont match!' )
),
'email' => array('rule'=>'email','message'=>'Please enter your email address')
);

/\*\*
\* validation functions
\*/

/\*\*
\* Check for existing user
*/
function validateUniqueUsername(){
$error=0;
//Attempt to load based on data in the field
$someone = $this->findByUsername($this->data\['User'\]\['username'\]);
// if we get a result, this user name is in use, try again!
if (isset($someone\['User'\]))
{
$error++;
//debug($someone);
//exit;

}
return $error==0;
}

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

}?>

### View

#### in app/views/users/register.ctp,

register
--------

 

 

input('User.email', array('size' => '40','div'=> false ));?>
error('User.duplicateemail','Sorry, ** That email is already is use**
'.$html->link('Is it yours?','/users/resetpassword/'.$this->data\['User'\]\['email'\]).' ',array('escape'=>false))?>

input('User.check', array('size'=>'10','label'=>$botQuestion,'error'=>'Are you human?','div'=>false));?>
error('User.', 'Are you human!');?>

data);?>

As you can see, the limits to validation are endless because worse scenario you write your own method unique to the situation. Post Script: Any feedback on the new syntax highlighting would be appreciated.  This one allows direct copy to your clipboard, and plain text viewing but trashes the formatting.  Maybe someone knows of another plugin for wordpress to do the same. If not I think I'll stick with GeSHi
