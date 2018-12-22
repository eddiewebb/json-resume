---
title: 'Automatically choose database connections in CakePHP '
date: Sat, 05 Jul 2008 22:04:40 +0000
draft: false
tags: [CakePHP, CakePHP, database]
---

**When developing applications it is wise to isolate development environments from live production environments**. This is true of your code and your database structures For me this means my local SuSE server runs any developmental code before I push it off to a shared hosting account out on the real live web. **The frustrating part for me was changing between two distinct database connections.** Every time I uploaded the complete application I would need to manually change connection strings. Well no more! A simple logic switch can do the work for me (and you), hooray!.

### Old database.php

class DATABASE_CONFIG
{
	var $default = 
		array(
			'driver' => 'mysql',
			'connect' => 'mysql_connect',
			'host' => 'localhost',
			'login' => 'cakeuser',
			'password' => 'cake4ever',
			'database' => 'site_db',
			'prefix' => 'mydb_'
		);
}

### Improved database.php

class DATABASE_CONFIG
{
	//initalize variable as null
	var $default=null;

	//set up connection details to use in Live production server
	var $prod = 
		array(
			'driver' => 'mysql',
			'connect' => 'mysql_connect',
			'host' => 'mysql123.example.com',
			'login' => 'username',
			'password' => 'pa55word',
			'database' => 'dbname',
			'prefix' => 'dbpre_'
		);

	// and details to use on your local machine for testing and development
	var $dev = 
		array(
			'driver' => 'mysql',
			'connect' => 'mysql_connect',
			'host' => 'localhost',
			'login' => 'username',
			'password' => 'password',
			'database' => 'baungenjar',
			'prefix' => 'dbpre_'
		);

	// the construct function is called automatically, and chooses prod or dev. UPdate! works for baking now
	function __construct ()
	{		
		//check to see if server name is set (thanks Frank)
		if(isset($\_SERVER\['SERVER\_NAME'\])){
			switch($\_SERVER\['SERVER\_NAME'\]){
				case 'digbiz.localhost':
					$this->default = $this->dev;
					break;
				case 'digbiz.example.com':
					$this->default = $this->prod;
					break;
			}
		}
	    else // we are likely baking, use our local db
	    {
	        $this->default = $this->dev;
	    }
	}
}

### What's Happening

PHP provides a whole bunch of useful server variables, one of which is the name of the server hosting the scripts. When the database class gets created, the construct function (if present) is called. This is true of any PHP class. We take advantage of this to check our server's name before actually setting up the connections. If we are not using the local server, then we set the default connection to use our production connection, otherwise we use our local connection. NOTE: The order is important here, since CakePHP's bake script will not have a server name, so we should always default to localhost, since thats where any backing would occur anyhow.