---
title: 'Reset Lost Passwords in CakePHP'
date: Thu, 23 Oct 2008 23:05:38 +0000
draft: false
tags: [CakePHP, CakePHP, password, tickets, users]
---

Allowing users to create passwords is critical. But what happens when they want to change their password, or worse yet a user forgets their password. Will they be forever banned, unable to remember that hastily typed string?! **Allowing users to send password reset tickets to their original email** is a pretty good way to solve this, and is seen throughout the web.   **Its a snap in CakePHP as well. Here's how it works.**

1.  User enters their email address.
2.  Cake checks the user table for a match, and sends out a 24 hour ticket.
3.  User receives ticket, follows link, and is then allowed to enter a new password.
4.  Ticket is 'Punched' so to speak, and the user can login as usual.

To manage these tasks we'll rely on the users model and our new tickets model.   First off let me be clear. I don't use Auth component. Just a matter of taste. So in my example I will be interacting directly with my users model, and sessions for any authentication points. Second I use my own [email component](https://blog.edwardawebb.com/programming/php-programming/cakephp/simple-email-component-cakephp) as well, but again you can easily change those areas to meet your needs.  

### Users Controller

You should already have this, so we'll just look at the new actions.

*   Create Ticket
*   Use Ticket
*   Enter New Password

#### in app/controllers/users_controller.php

	/\*\*
	 \* This sweet controller was written by
	 \* @author Edward A Webb edwardawebb.com
	 \* 
	 */
class UsersController extends AppController {

	var $name = 'Users';
	var $uses =array('User','Ticket');
	var $helpers = array('Html', 'Form');
	var $components =array('Email','Ticketmaster');

	function resetpassword($email=null){
		//grab a fresh botcheck question from the db
// for this example youll need to static code these, my botcheck article is coming soon though
		// $bc=$this->Botcheck->getFreshBotcheck();
		$this->whatWeAsk="Is water a liquid at room temperature?";
		$this->humanWouldType=array('Yes', 'of course');
		$this->set('botQuestion',$this->whatWeAsk);
		if(empty($this->data)){
			$this->data\['User'\]\['email'\]=$email;
			//show form
		}else{
			//already entered email
			$botcheck = $this->data\['User'\]\['check'\];
				//set email to passed variable if present
				if(!$email) $email=$this->data\['User'\]\['email'\];
				// make sure whave email and a check
				if(!$email){
					$this->User->invalidate('email');
				}elseif(!in_array(strtolower($botcheck),$this->humanWouldType)){
				 	$this->User->invalidate('check');
				}else{
					//email entered, check for it
					$account=$this->User->findByEmail($email);
					if($account\['User'\]\['isBanned'\]){
						//banned user, tell em where to go
						$this->Session->setFlash('

### This account is locked due to violation of terms

');
						$this->redirect('/');
					}
					if(!isset($account\['User'\]\['email'\])){
						$this->Session->setFlash('

### We Don\\'t have such and email on record.

');
						$this->redirect('/');

					}
					$hashyToken=md5(date('mdY').rand(4000000,4999999));
					$message = $this->Ticketmaster->createMessage($hashyToken);
					$this->Email->useremail($email,$account\['User'\]\['username'\],$message);
					$data\['Ticket'\]\['hash'\]=$hashyToken;
					$data\['Ticket'\]\['data'\]=$email;
					$data\['Ticket'\]\['expires'\]=$this->Ticketmaster->getExpirationDate();

					if ($this->Ticket->save($data)){
						$this->Session->setFlash('An email has been sent with instructions to reset your password');
						$this->redirect('/');
					}else{
						$this->Session->setFlash('Ticket could not be issued');
						$this->redirect('/');

					}
				}

		}
	}

	function useticket($hash){
		//purge all expired tickets
		//built into check
		$results=$this->Ticketmaster->checkTicket($hash);

		if($results){
			//now pull up mine IF still present
			$passTicket=$this->User->findByEmail($results\['Ticket'\]\['data'\]);

			$this->Ticketmaster->voidTicket($hash);
			$this->Session->write('tokenreset',$passTicket\['User'\]\['id'\]);
			$this->Session->setFlash('Enter your new password below');
			$this->redirect('/users/newpassword/'.$passTicket\['User'\]\['id'\]);
		}else{
			$this->Session->setFlash('Your ticket is lost or expired.');
			$this->redirect('/');
		}

	}

	function newpassword($id = null) {

		if($this->Session->check('tokenreset')){
			//user is not logged in, BUT has TOKEN in hand
		}else{
			// But you only want authenticated users to access this action.
//lines like the one below 'checkSession are  authentication code, so you can ignore these or use Auth
			$this->checkSession(1,'/users/edit/'.$id);

			//But youll need to read the user info somehow, and only the user who owns the profile 
			$attempter=$this->Session->read('User');

			//make sure its the admin or the rigth user
			if($attempter\['User'\]\['id'\]!=$id && $attempter\['Role'\]\['rights'\]<4)
			{
				//not  the user, not the admin and not a reset request via toekns
				/\*
				 \* SHAME
				 */
				$this->Userban->banuser('Edit Anothers Password');
				$this->Session->setFlash('Your account has been banned');
				$this->redirect('/');
			}

		}	

		if (empty($this->data)) {
			if($this->Session->check('tokenreset')) $id=$this->Session->read('tokenreset');
			if (!$id) {
				$this->Session->setFlash('Invalid id for User');
				$this->redirect('/users/index');
			}
			$this->data = $this->User->read(null, $id);
		} else {				

			$this->data\['User'\]\['password'\]=md5($this->data\['User'\]\['password'\]);
			if ($this->User->save($this->data,true,array('password'))) {
				//delkete session token and dlete used ticket from table
				$this->Session->delete('tokenreset');
				$this->Session->setFlash('The User\\'s Password has been updated');
				$this->redirect('/');
			} else {
				$this->Session->setFlash('Please correct errors below.');
			}
		}
	}
}

 

The rest is new
---------------

### Tickets Model

#### in app/models/ticket.php

 

#### MySQL query to build the ticket table

CREATE TABLE IF NOT EXISTS \`prefix_tickets\` (
  \`id\` int(11) NOT NULL auto_increment,
  \`hash\` varchar(255) default NULL,
  \`data\` varchar(255) default NULL,
  \`created\` datetime default NULL,
  \`expires\` datetime default NULL,
  PRIMARY KEY  (\`id\`),
  UNIQUE KEY \`hash\` (\`hash\`)
) ;

 

### Ticketmaster Component

This manages tickets, creation, validation and destruction.

#### in app/controllers/components/ticketmaster.php

controller =& $controller;    	
    }	
	function getExpirationDate(){
		$date=strftime('%c');
		$date=strtotime($date);
		$date+=($this->hours\*60\*60);
		$expired=date('Y-m-d H:i:s',$date);
		return $expired;

	}

	function createMessage($token){

		$ms='';
		$ms='Your email has been used in a password reset request at '.$this->sitename.'<br?>';
		$ms.='If you did not initiate this request, then ignore this message.
';
		$ms.='  Copy the link below into your browser to reset your password.
';
		$ms.='[Reset Password](http://'.$this->linkdomain.'/users/useticket/'.$token.')';
		$ms.='';

		$ms=wordwrap($ms,70);

		return $ms;

	}

	function purgeTickets(){
		$this->controller->Ticket->deleteAll('Ticket.expires <= now() LIMIT 1');

	}	

	/\*
	 \* actually for logical reason well be indiscrimnate and clean ALL tockets for this email
	 */
	function voidTicket($hash){
		$this->controller->Ticket->deleteAll(array('hash' => $hash));
	}

	function checkTicket($hash){
		$this->purgeTickets();
		$ret=false;
		$tick=$this->controller->Ticket->findByHash($hash);

		if(empty($tick)){
			//no more ticket			
		}else{
			$ret=$tick;
		}
		return $ret;
	}
}
?>

 

### User Views

Its always nice to let users interact with actions, so; First this form allows users to create a ticket that will get them into the form above without their password.

#### in app/views/users/resetpassword.ctp

Reset Lost Password
-------------------

  Next the useticket action of the controller will allow users to link from the email they received with a unique 'token', like a temporary pass. They will be redirected here, and allowed to enter a new password.

#### in app/views/users/newpassword.ctp

New Password
------------

**Username:** data\['User'\]\['username'\] ;?> hidden('User/username', array('size' => '60'));?>

hidden('User/id')?>