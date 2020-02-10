---
title: 'Validating Complex Passwords'
date: Thu, 23 Oct 2008 00:07:55 +0000
draft: false
tags: [web development, web development]
---

There are many variations of a 'complex password' but most focus on having a minimum number of characters and must include at least 1 number. Others take it further and require upper case characters, or special characters (&-_!, etc).  I will show you code to do all three. The basic concept ruses a regular expression. My examples will use php to compare the text to the regualr expression, but all major languages has some method to evaluate regular expressions, or regex. If your using CakePHP, check out [this article](https://blog.edwardawebb.com/programming/php-programming/cakephp/heavy-duty-password-validation-cakephp "Validating and encrypting passwords in CakePHP") . For PHP you can use the function preg_match to compare text to a regular expression; preg_match($pattern,$string); Detailed instructions for PHP users are at the foot of this article.

### Regular Expression Pattern for Simple Password

1.  3 characters or longer.
2.  Digits, Upper or lower case letters. Examples: "easy","8892","NOTSECURE"

/[a-zA-Z0-9\_\-]{3,}$/i

That is a terrible password because a lot of users will use the dreadful _Dictionary Words_ which any malicious attack will test first. Fortunately there is a relatively simple way to make any password scheme you want.

### Regular Expression for Moderate Password

1.  6 character minimum
2.  Upper-case letter or lower-case letter
3.  Digit Examples: "common1","7etmein"

/(?=^.{6,}$)(?=.*\d)(?=.*[A-Za-z]).*$/

There are some things to notice. Every one of the (?blah) is a condition. So left to right that reads;

A string that starts and ends having 6 to infinity character AND There is a digit AND There is a letter 

We grouped all letters into one bucket.

### Regular Expression for Complex Password

1.  8 character minimum
2.  Upper-case letter
3.  Lower-case letter
4.  digit or special character Examples: "15NotEasy","Bett.er-Yet"

/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/

We get a little trickier here adding additional () to group two parameters. THe pipe | acts as an OR switch.

A string that starts and ends having 8 to infinity character AND( There is a digit OR THere is a non-Word character)  AND There is an upper-case letter  AND There is an lower-case letter  

We have also broken lower and uppercase letters into their own conditions.

### Regular Expression for Super Secure Complex Password

1.  8 character minimum
2.  Upper-case letter
3.  Lower-case letter
4.  digit
5.  special character

This password is pretty darn secure.

/(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/

A string that starts and ends having 8 to infinity character AND There is a digit AND THere is a non-Word character AND There is an upper-case letter  AND There is an lower-case letter 

### PHP Example to validate password from a form

So in PHP yo might grab the password from POST, set the regex, and compare

//set string and pattern
$text=$_POST['password'];
$regex='/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/';

//now compare
if ( ! preg_match($regex,$text) ) {
 // This password failed!
}else{
//password mets criteria, encrypt and save
}
