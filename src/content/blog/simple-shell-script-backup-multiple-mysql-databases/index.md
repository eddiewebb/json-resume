---
title: 'Simple shell script to backup multiple mysql databases'
date: Thu, 12 Feb 2009 23:32:32 +0000
draft: false
tags: [backup, bash, Database Tips, linux, linux, mysql, mysqldump, web development]
---

To **backup a mysql database from a unix command** line is relatively simple.  It is equally easy to automate this task with a shell script and a crontab (cron jobs).  In my case I needed to backup ~15 unique databases and I despise repetitious code, so here's what I came up with. **Update Added means to allow different User and password based on current DB. ** ANother Update! - better [error handling](#error-handling).

The problem
-----------

I have multiple databases that need to be backed up into different archive folders. Each database requires a unique host, username and password.

THe solution
------------

The bash shell of course! First off we should all be familiar with mysqldump.  It lives idle in nearly every 'nix box just waiting to dump a mysql database onto the screen, or file. ANd unless you want your mysqldump binary to be sad you should take full well use of it. The most basic use of the program couldn't be simpler, but it is happy to meet more complex needs as well. FOr this article we'll keep it simple.

mysqldump -h HOSTNAME -u USERAME -pPASSWORD DATABASE > OUTPUTFILE

now you can of course add additional switches, c and e are two I use pretty frequently. See your machine's man pages to learn more. But wait that only handles 1 DB on 1 host with 1 user and password. True. SO here's where we take use of a script to make this puppy work overtime.

The Shell Scripts
-----------------

### Many mysql Databases on one host

#!/bin/bash

#####
# Set these values!
####


# space seperated list of domain names (will be used as part of the output path)
domains=( name4subfolders inSQLfolderabove canbedomains orsomethingelse )
#list of corresponding DB names
sqldbs=( fulldbname1 db2 db3 db4 )

#list of IDs and passwords
usernames=( user1 user2 user3 user 4 )
passwords=( pass1 pass2 pass3 pass4 )

#Directory to save generated sql files (domain name is appended)
opath=$HOME/sql_dumps/

# your mysql host
mysqlhost=mysql.webbmaster.org



#####
# End of config values
#####


#date to append
suffix=$(date +%Y-%m-%d)


#run on each domain
for (( i = 0 ; i < ${#domains[@]} ; i++ ))
do
	#set current output path
	cpath=$opath${domains[$i]}
	
	#check if we need to make path
	if [ -d $cpath ]
	then
		# direcotry exists, we're good to continue
		filler="just some action to prevent syntax error"
	else
		#we need to make the directory
		echo Creating $cpath
		mkdir -p $cpath
	fi

	#now do the backup
	SQLFILE=${cpath}/${sqldbs[$i]}_$suffix.sql.gz
	
	mysqldump -c -h $mysqlhost --user ${usernames[$i]} --password=${passwords[$i]} ${sqldbs[$i]} 2>error | gzip > $SQLFILE

	if [ -s error ]
	then	   
		printf "WARNING: An error occured while attempting to backup %s  \n\tError:\n\t" ${sqldbs[$i]} 
		cat error
		rm -f er
	else
		printf "%s was backed up successfully to %s\n\n" ${sqldbs[$i]} $SQLFILE
	fi
done

In either case you'll want to save it to a file, let's say... daily_sql_backup.sh And then make the script executable

#chmod 0750 daily_sql_backup.sh

Now you can test the script by calling it by name

# daily_sql_backup.sh

**Sweet, a single command will backup any databases we include in the script. And we can call it again and again**. A simple output reports the results;

database1 was backed up successfully to /home/YOURNAME/sql_dumps/site1.com/database1_2009-01-14.sql.gz

taskfreak_database was backed up successfully to /home/YOURNAME/sql_dumps/taskfreak.sitetwo.com/taskfreak_database_2009-01-14.sql.gz

mantis_database was backed up successfully to /home/YOURNAME/sql_dumps/mantios.yetanother.org/mantis_database_2009-01-14.sql.gz

### Error Reporting 

I recently had to update the error handling because it was letting failures pass by! That was because mysqldump would fail, throw an error to stderr, but gzip would then come along and happily report that is successfully compressed nothing! The new model outputs any errors to a file named "error" before everything is piped into gzip and the error code is lost. We then check for the file, and if present show it to the user (log it) before deleting the file and moving on. So in a bad scenario I would now see:

Attempting to run MySQL dump on 2 databases
domain1.com
domain2.com


domain1_com was backed up successfully to /home/user/sql_dumps/
domain1/domain1_com_2011_05_05.sql.gz

WARNING: An error occured while attempting to backup domain2 
        Error:
        mysqldump: Got error: 1045: Access denied for user 'domain2_com'@'domain2.com' (using password: YES) when trying to connect

But wait! We wanted to automate this whole thing right? And so we shall.

Using Cron to automate the process
----------------------------------

If your using a webhost they likely provide a GUI to add cron jobs. If that's the case you can just point to the full path where you saved the above script, select the interval and your good to go. If your using this on your own server you'll need to get your hands dirty with a crontab. You can open the crontab file in your editor of choice, or call it from the command line. IN this example we'll rely in vi, my systems default editor. Create a crontab file if it does not already exist and open it for edit

crontab -e

You may see some existing lines or you may not. Just remember one job per line. THe layout may seem overwhelming at first, but its quite simple, and breaks down like this

min     hour     day    month    weekday     job_to_Run

The values are in the respective ranges for day of week 0 is Sunday.

0-59    0-23     1-31    1-12     0-6        filename

To omit a field replace it with an asterisk (*) which means all values. Alternately you may use comma separated lists. Although I believe it will treat any whitespace as a delimiter I use tabs to make the organization a little nicer. So let's suppose I want to run this job nightly, it is after all named DAILY sql backup :) I will add the following line to my crontab

15    0     *    *   *     $HOME/scripts/daily_sql_backup.sh > logfile.log

This means every day @ 00:15 a.k.a 15 minutes past midnight it will run the script and print any output into the specified logfile. If you leave off the redirect to logfile it will email the user with the results. To omit any output use the handy standby

>/dev/null 2>&1

. well I think that covers it. THere's tons of good resources to learn more about any particular topic, but I would be happy to field comments.

### The End Result

After your newly created cron jobs have the chance to run for a few days you'll end up with a nice and neat directory structure like this;

sql_dumps/
|-- edwardawebb.com
|   |-- edwardawebb_wordpress_01-13-2009.sql.gz
|   |-- edwardawebb_wordpress_01-14-2009.sql.gz
|   |-- edwardawebb_wordpress_01-15-2009.sql.gz
|   |-- edwardawebb_wordpress_01-16-2009.sql.gz
|   |-- edwardawebb_wordpress_01-17-2009.sql.gz
|   |-- edwardawebb_wordpress_01-18-2009.sql.gz
|   `-- edwardawebb_wordpress_01-19-2009.sql.gz
|-- mantis.mainsite.org
|   |-- mainsite_mantis_01-13-2009.sql.gz
|   |-- mainsite_mantis_01-14-2009.sql.gz
|   |-- mainsite_mantis_01-15-2009.sql.gz
|   |-- mainsite_mantis_01-16-2009.sql.gz
|   |-- mainsite_mantis_01-17-2009.sql.gz
|   |-- mainsite_mantis_01-18-2009.sql.gz
|   `-- mainsite_mantis_01-19-2009.sql.gz
`-- taskfreak.mainsite.org
    |-- mainsite_taskfreak_01-11-2009
    |-- mainsite_taskfreak_01-11-2009.sql.gz
    |-- mainsite_taskfreak_01-12-2009.sql.gz
    |-- mainsite_taskfreak_01-13-2009.sql.gz
    |-- mainsite_taskfreak_01-14-2009.sql.gz
    |-- mainsite_taskfreak_01-15-2009.sql.gz
    |-- mainsite_taskfreak_01-16-2009.sql.gz
    |-- mainsite_taskfreak_01-17-2009.sql.gz
    |-- mainsite_taskfreak_01-18-2009.sql.gz
    `-- mainsite_taskfreak_01-19-2009.sql.gz

Note: this example would generate 3 files each night. After 1 month thats ~150 files depending on the month. That's why I also wrote a simple [Recycler script](https://blog.edwardawebb.com/linux/log-recycler-script) to purge all old files. As soon as I draft that article I'll ad the link here.
