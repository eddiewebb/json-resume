---
title: 'Getting Started with ACL in CakePHP'
date: Tue, 24 Mar 2009 00:18:26 +0000
draft: false
tags: [ACL, CakePHP, CakePHP, USer]
featured: true
---

The ACL component of CakePHP can be a daunting undertaking for those new to CakePHP or ACLs. Once you take the plunge though you'll never look back. The flexibility and power of the ACL component are worthy of your site, I promise. In order to help some fellow bakers into the water I wanted to offer some advice.

### What is ACL?

ACL, or Access Control List is a common means to control access to applications or sites at a granular level. **The basic premise is simple, you have 'whos' and 'whats'.  The combination determines _who_ can access _what_.**

### Why ACL?

Unless you want access to be all or nothing, then you need to consider ACLs. This allows some users here, and other users there.

### How to get started with ACL

The first thing I find is that a lot of people seem to think ACL and Auth are useless with out each other.  **Although they compliment each other very nicely, the use of ACL does not require the use of Auth**.  To illustrate this point I'll admit that I don't even use Auth. :O  But don't tell anyone, they'll take away my Baking degree. In fact I have developed a rather robust User model that handles authorization, registratoin, etc, etc quite nicely., but I am getting off topic. Just remember ACL determines who can do what, Auth determines how they get in.

### The ACL Basics

I strongly suggest you check out the [ACL section of the CakePHP Manual](http://book.cakephp.org/view/171/Access-Control-Lists "Read the CakePHP Manual's ACL section"). If you can tolerate all the reference to Lord of The Rings, you'll find the information you need. Just know that you want the Database method as appose to ini files.

### Migrating an Existing Site to ACL

First grab yourself a sheet of paper. Think about this... The whos and whats of your site.  A simple example may look like this;

#### The Whos

Keeping it simple, we have users and admins.

---------------------------------------------------------------
  [1]users

    [4]Test

    [5]Jesse

    [6]Sister

  [2]administrators

    [3]Eddie

---------------------------------------------------------------

#### The Whats

This is where you need to really spend some time planning. Think about commonalities across models or areas of your site. Creating the right heirarchy will save alot of hassle down the road.

---------------------------------------------------------------
  [1]Entire_Site

    [2]Main_Models

      [4]Users

      [5]Toolboxes

      [6]Items

    [3]Aux_Models

      [7]Actions

      [8]Priorities

      [9]Settings

      [10]Botchecks

---------------------------------------------------------------

The key in my example is that Users should be able to create and read instances of the main models, but only read the auxiliary models. By collapsing these in a tree format I can just declare that explicitly at the Main and Aux levels, and let the sub-models inherit those permissions, neat!

#### Now the Code to put it all together - acos, aros and aros_acos

This is a simple controller I roughed out to help implement ACL in one of my existing sites.

*   Start by initializing the tables with action initAcl.
*   Next assign permissions (connecting the who and whats)
*   Finally test out permissions

 array(
			'alias' => 'users'
		),
		1 => array(
			'alias' => 'administrators'
		),
	);
	
	//Iterate and create ARO groups
	foreach($groups as $data)
	{
		//Remember to call create() when saving in loops...
		$aro->create();
		
		//Save data
		$aro->save($data);
	}
		
		
	/*
	 * next we add our existing add users to users group
	 * ! adds all users to user group, you may add some logic to 
	 * ! detemrine admins based on role, or edit manually later
	 * 
	 * the   **whos**
	 */	
		
		
	$aro = new Aro();
		
	
		//pull users form existing user table
		$users=$this->User->find('list');
		
		debug($users);
		
		
		$i=0;
		foreach($users as $key=>$value){
			$aroList[$i++]=
				array(
					'alias' => $value,
					'parent_id' => 1,
					'model' => 'User',
					'foreign_key' => $key,
				);	
		}
		
		//print to screen to verify layout
		debug($aroList);
		
		
		
		//now save!
		foreach($aroList as $data)
		{
			//Remember to call create() when saving in loops...
			$aro->create();
	
			//Save data
			$aro->save($data);
		}
	
	/*
	 * now on to  *whats* can they access
	 * 
	 * for my layout I have the entire site as a parent, two sub groups that contain all models.
	 * 
	 */
	

		$aco = new Aco();
		
		//admin can access whole site
		$controllers = array(
			0 => array(
				'alias' => 'Entire_Site'
			),
		);
		
		//Iterate and create ARO groups
		foreach($controllers as $data)
		{
			//Remember to call create() when saving in loops...
			$aco->create();
			
			//Save data
			$aco->save($data);
		}
				$aco = new Aco();
		
		//users have different permissions on Main and Auxilary models
		$controllers = array(
			0 => array(
				'alias' => 'Main_Models',
				'parent_id'=> '1'
			),
			1 => array(
				'alias' => 'Aux_Models',
				'parent_id'=> '1'
			),
		);
		
		//Iterate and create ACO objects
		foreach($controllers as $data)
		{
			//Remember to call create() when saving in loops...
			$aco->create();
			
			//Save data
			$aco->save($data);
		}
	
	
	
	/* 
	 * now the more details ACOs and their parents (refer to tree in post above)
	 */
		$aco = new Aco();
		
		//Here's all of our sub-ACO info in an array we can iterate through
$controllers = array(
			0 => array(
				'alias' => 'Users',
					'model' => 'User',
				'parent_id' => 2,
			),
			1 => array(
				'alias' => 'Toolboxes',
					'model' => 'Toolbox',
				'parent_id' => 2,
			),
			2 => array(
				'alias' => 'Items',
					'model' => 'Item',
				'parent_id' => 2,
			),
			3 => array(
				'alias' => 'Actions',
					'model' => 'Action',
				'parent_id' => 3,
			),
			4 => array(
				'alias' => 'Priorities',
					'model' => 'Priority',
				'parent_id' => 3,
			),
			5 => array(
				'alias' => 'Settings',
					'model' => 'Setting',
				'parent_id' => 3,
			),
			6 => array(
				'alias' => 'Botchecks',
					'model' => 'Botcheck',
				'parent_id' => 3,
			),
		);
		
		//Iterate and create ACO nodes
		foreach($controllers as $data)
		{
			//Remember to call create() when saving in loops...
			$aco->create();
			
			//Save data
			$aco->save($data);
		}
	
		die; exit;
	}
	
	function assignPermissions()
	{
		//give admins rights to everything!(top aco)
		$this->Acl->allow('administrators', 'Entire_Site');
		
		//give users right to create and read main models
               //updates and deletes are set at a user level (so only owners can edit or delete their items)

		$this->Acl->allow('users', 'Main_Models','create');
		$this->Acl->allow('users', 'Main_Models','read');
		
		//let them use (read) aux, but nothing else!
		$this->Acl->allow('users', 'Aux_Models','read');
		
		die('done');
	}
	
	function checkPermissions()
	{
		//These all return true:
		echo $this->Acl->check('administrators', 'Settings');
		echo $this->Acl->check('users', 'Items','create');
		echo $this->Acl->check('users', 'Actions','read');
		
		//Remember, we can use the model/foreign key syntax 
		//for our user AROs
		// think can access , // can    User   2356    acsess   Weapons
		//$this->Acl->check(array('model' => 'User', 'foreign_key' => 2356), 'Weapons');
		
		echo 'and dissallows...';
		
		//But these return false:	
//users can not delete or edit auxilary models (inherited)
		echo $this->Acl->check('users', 'Actions', 'delete');
		echo $this->Acl->check('users', 'Actions', 'create');
//nor can they edit or delete main models (until we assign that on an individual basis)
		echo $this->Acl->check('users', 'Items', 'delete');
		echo $this->Acl->check('users', 'Items', 'update');
		die('done');
	}
 }
?> 

### The final touches

The final touches will come as you update or create your model actions. WHen a user creates a new Toolbox (for example) you will immediately grant that user update and delete privileges for that toolbox.

//example code when a user creates a model
//let user with id 1234 update toolbox with id 5678
$this->Acl->allow(array('model' => 'User', 'foreign_key' => 1234), array('model'=>'Toolbox','foreign_key'=>'5678'), 'update');

Next time around you can use ACL to verify those rights to prevent anyone else the same privilege.

//example code when a user attempts action a model
//can user with id 1234 in fact update toolbox with id 5678?
$this->Acl->check(array('model' => 'User', 'foreign_key' => 1234), array('model'=>'Toolbox','foreign_key'=>'5678'), 'update');

### Making Changes to ACO or ARO tables from the Database

### Couldn't resist huh, just had to know what the underlying tables looked like? Good for you. If your none too familiar with hierarchical structures in referential DB tables your probably wondering, what the deal with **lft** and **rght**, and why doesn't just changing a parent ID move things around. (You may have discovered this trying to move yourself from users to administrators through the DB.) For all the lovely details, may I suggest [Nested Trees in CakePHP](https://blog.edwardawebb.com/programming/php-programming/cakephp/nested-trees-cakephp) (though the article really applies more generally to nested lists in any referential Database)
