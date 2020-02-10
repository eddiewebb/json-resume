---
title: 'Simple Email Component for CakePHP'
date: Sun, 28 Sep 2008 13:34:46 +0000
draft: false
tags: [alerts, CakePHP, email]
---

Background
----------

I have read many forum and mailing list posts that discuss troubles implementing an email component for Cake.  To be honest I never tried to source a third-party component, and just decided to build my own using PHP's mail function. NOTE: If you send batch emails accounting for hundreds our thousands messages, this would not be your best option. **If you just want to notify admin or users about particular events, like welcome messages or lost password tickets, then this will suit you just fine.** In order to add some flexibility I separated the mail functionality into 3 main functions.

*   Email to Yourself (Admin Alert) Good for notifying you of new users or questionable activities.
*   Email to Users Good for lost passwords and registration confirmations.
*   Information Request Email Good for contact page and questions sent by anonymous users.

Each piece can be called from components very simply, and parameters are based on type.  For example we don't supply and email address for administrative emails, because we know where it is coming from and going to already. **However if were sending a contact page request, than a reply-to email would certainly be helpful**. The first thing you'll need is the actual component.  I'll follow the standard CakePHP naming convention for components.

Creating The Email Component
----------------------------

So create a class file that sits in **/controllers/components/email.php** _**Complete**_

admin_email;
			// subject
			$subject = 'Admin Alert from '.$this->site_name;					
			
			
			// To send HTML mail, the Content-type header must be set
			$headers  = 'MIME-Version: 1.0' . "\r\n";
			$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
			$headers .= "From: ".$this->site_name." email_domain.">\n";
	  		$headers .= 'X-Sender: email_domain.'>\n';
	  		$headers .= 'X-Mailer: PHP\n';
			
			
			// Mail it
			mail($to, $subject, $message, $headers);
	}
	
	/**
	 * Send a message to myself, from contact page
	 * 
	 * @param string $from_email
	 * @param string $from_name
	 * @param string $message
	 * 
	 * Note: from email will be used as reply-to, allowing you to respond to any questions or comments directly.
	 */
	function infoemail($f_email,$f_name,$message)
	{
	  		$to  = $this->info_email;
			// subject
			$subject = 'Contact / Info Request for '.$this->site_name;					
			
			
			// To send HTML mail, the Content-type header must be set
			$headers  = 'MIME-Version: 1.0' . "\r\n";
			$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
			$headers .= "From: ".$this->site_name." email_domain.">\n";
	  		$headers .= 'X-Sender: email_domain.'>\n';
	  		$headers .= 'X-Mailer: PHP\n';
			$headers .= "Reply-To: ".$f_name." <".$f_email.">\n\n";	  
	  
			
			// Mail it
			mail($to, $subject, $message, $headers);
	}
	
	/**
	 * 
	 * Send a message to a user 
	 * @param string $email
	 * @param string $name
	 * @param string $message
	 */
	function useremail($email, $name, $message)
	{
			$to  = $email;
			// subject
			$subject = 'Message from '.$this->site_name.' for '.$name;					
			
			
			// To send HTML mail, the Content-type header must be set
			$headers  = 'MIME-Version: 1.0' . "\r\n";
			$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
			$headers .= "From: ".$this->site_name." email_domain.">\n";
	  		$headers .= 'X-Sender: email_domain.'>\n';
	  		$headers .= 'X-Mailer: PHP\n';
			
			
			// Mail it
			mail($to, $subject, $message, $headers);



	}
	
}?>

You'll notice I just set the domain and name variables at the top of the email class. This could be more dynamically done using router::url and some other built in classes for those who are adventurous.

Using The Email Component (Making Calls)
----------------------------------------

In order to send emails now there are two things we need to do:

1.  Add call to component in controller variables
2.  Make call to email functions as needed

Including component in a controller; (placed at top of controller class, along with $helpers and $name variable) **_Snippet_**

	var $components = array ('Email','RequestHandler'); 

Making a call to component function; (Used within controller actions) In my example below we are sending an admin alert because a user has tried to edit a post that was no their own. **_Snippet_**

		$owner=$this->Post->field('user_id', 'id = '.$id);
		if($owner!=$user['User']['id'] && $user['Role']['rights']<2){
			//they are not the owner! shame
			$this->User->banuser($user['User']['id'],'Post Edit Attempt');
			$this->Session->setFlash('You tried to edit a post that does not belong to you.   
'.
' Your account has been suspended.');
			//prepare and send email alert
			$ms='

### The user with info below has Violated terms of the site by attempting'.
' to edit another Users Post(Post id: '.$id.').  
';
			$ms.='Username: '.$user['User']['username'].' id:'.$user['User']['id'];
			$ms.='';
			$this->Email->adminemail($ms);
			$this->Session->delete('User');

			$this->redirect('/');
			exit;
		}

The only part you should care about there is highlighted. First you must build the message, then supply it to the admin alert function of our new component.

### Summary

That's it!   I would love to hear feedback as I am always looking to make it better or easier for users to understand and implement.
