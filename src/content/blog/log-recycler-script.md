---
title: 'Log Recycler Script'
date: Sun, 18 Jan 2009 01:15:39 +0000
draft: false
tags: [bash, delete, linux, log, MIsc.Tips, recycler, turn over]
---

So when I wrote the article that introduced a [script to generate mysql backup files for multiple databases](https://blog.edwardawebb.com/web-development/simple-shell-script-backup-multiple-mysql-databases) I mentioned the trouble that will occur if you don't get a handle on **some means to retire old files**. This applies to log files, mysql backups, or just about any other type of file that is created on a recurring basis. You don't need a error log from 134 days ago, but error logs for the past week could be very useful. So what do you do? Why recycle of course. **This article shares a simple shell script to purge any files older than X days**, where X is of course a number allowing for flexibility. **It is very simple to use a shell script to delete log files, or in this example sql backups.**

The problem
-----------

Your server is being overrun with numerous files that just hang around long after they have served there useful life. These files may be small or large, but something about leaving unused files hanging around doesn't feel right. After just a few days of mysql backups I end up with a directory structure like this;

sql_dumps/
|\-\- edwardawebb.com
|   |\-\- edwardawebb\_wordpress\_01-13-2009.sql.gz
|   |\-\- edwardawebb\_wordpress\_01-14-2009.sql.gz
|   |\-\- edwardawebb\_wordpress\_01-15-2009.sql.gz
|   |\-\- edwardawebb\_wordpress\_01-16-2009.sql.gz
|   |\-\- edwardawebb\_wordpress\_01-17-2009.sql.gz
|   |\-\- edwardawebb\_wordpress\_01-18-2009.sql.gz
|   `\-\- edwardawebb\_wordpress\_01-19-2009.sql.gz
|\-\- mantis.mainsite.org
|   |\-\- mainsite\_mantis\_01-13-2009.sql.gz
|   |\-\- mainsite\_mantis\_01-14-2009.sql.gz
|   |\-\- mainsite\_mantis\_01-15-2009.sql.gz
|   |\-\- mainsite\_mantis\_01-16-2009.sql.gz
|   |\-\- mainsite\_mantis\_01-17-2009.sql.gz
|   |\-\- mainsite\_mantis\_01-18-2009.sql.gz
|   `\-\- mainsite\_mantis\_01-19-2009.sql.gz
`\-\- taskfreak.mainsite.org
    |\-\- mainsite\_taskfreak\_01-11-2009
    |\-\- mainsite\_taskfreak\_01-11-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-12-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-13-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-14-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-15-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-16-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-17-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-18-2009.sql.gz
    `\-\- mainsite\_taskfreak\_01-19-2009.sql.gz

Although 24 files may seem manageable, those who deal with log files and multiple sites know that this can quickly get out of hand.

The solution
------------

We lazily create a shell script to run at weekly intervals to purge all those older files and send them off to the bit bucket. Only files older than X days should be deleted, we'll leave all the fresh and potentially needed logs/backups in place This example assumes mysql logs with the .sql or .sql.gz extensions.

### shell script to purge outdated files

#!/bin/bash

#if you use this script you must attribute to me Eddie - Edwardawebb.com 1/14/09

#this script will run through all nested directories of a parent just killing off all matching files.

######
\### Set these values
######

\## default days to retain (override with .RETAIN_RULE in specific directory
DEFRETAIN=60

#want to append the activity to a log? good idea, add its location here
LOGFILE=\`pwd\`/Recycler.log

\# enter the distinguishing extension, or portion of the filename here (eg. log, txt, etc.)
EXTENSION=sql


#the absolute path of folder to begin purging
#this is the top most file to begin the attack, all sub directories contain lowercase letters and periods are game.
SQLDIR=$HOME/sql_dumps

#####
\##   End user configuartion
#####


#this note will remind you that you have a log in case your getting emails form a cron job or something
echo see $LOGFILE for details

#jump to working directory
cd $SQLDIR

#if your sub-dirs have some crazy characters you may adjust this regex
DIRS=\`ls | grep ^\[a-z.\]*$\`


TODAY=\`date\`

printf "\\n\\n********************************************\\n\\tSQL Recycler Log for:\\n\\t" | tee -a $LOGFILE
echo $TODAY | tee -a $LOGFILE
printf "********************************************\\n" $TODAY | tee -a $LOGFILE

for DIR in $DIRS 
do
	pushd $DIR >/dev/null
	HERE=\`pwd\`
	printf "\\n\\n%s\\n" $HERE | tee -a $LOGFILE
	if \[ -f .RETAIN_RULE \]
	then
		printf "\\tdefault Retain period being overridden\\n" | tee -a $LOGFILE
		read RETAIN < .RETAIN_RULE
	else
		RETAIN=$DEFRETAIN
	fi
	
	printf "\\tpurging files older than %s days\\n" ${RETAIN} | tee -a $LOGFILE
	
	OLDFILES=\`find -mtime +${RETAIN} -regex .*${EXTENSION}.*\`

	set -- $OLDFILES

	if \[ -z $1 \]
	then
		printf "\\tNo files matching purge criteria\\n" | tee -a $LOGFILE
	else
		printf "\\tSQL Files being Delete from $HERE\\n" | tee -a $LOGFILE
		printf "\\t\\t%s\\n" $OLDFILES  | tee -a $LOGFILE
	fi

 	rm -f $OLDFILES
	if \[ $? -ne 0 \]
	then	
		echo "Error while deleting last set" | tee -a $LOGFILE
		exit 2
	else
		printf "\\tSuccess\\n" | tee -a $LOGFILE
	fi
	popd >/dev/null
done

did you notice the bit about .RETAIN\_RULE? good! I added this after I realized that I don't treat all my sites equally. For this very blog which is backed up daily I only need 3-4 days back max. But for other sites that I back up monthly I need to keep the default 60 days or 1-2 files. So I set the default in the script to 60. But I allow it to be overwritten by adding a simple text file to any directory. If a file .RETAIN\_RULE is present it will read the first line (and first line only!) for a new value, example;

#### $HOME/sql\_dumps/dailysite.com/.RETAIN\_RULE

5
#only keep files in this single directory around for 5 days

notice i comment after the actual data! This means my actual directory structure including retain rules looks more like;

#tree -a sql_dumps
sql_dumps/
|\-\- edwardawebb.com
|   |\-\- .RETAIN_RULE
|   |\-\- edwardawebb\_wordpress\_01-13-2009.sql.gz
|   |\-\- edwardawebb\_wordpress\_01-14-2009.sql.gz
|   |\-\- edwardawebb\_wordpress\_01-15-2009.sql.gz
|   |\-\- edwardawebb\_wordpress\_01-16-2009.sql.gz
|   |\-\- edwardawebb\_wordpress\_01-17-2009.sql.gz
|   |\-\- edwardawebb\_wordpress\_01-18-2009.sql.gz
|   `\-\- edwardawebb\_wordpress\_01-19-2009.sql.gz
|\-\- mantis.mainsite.org
|   |\-\- .RETAIN_RULE
|   |\-\- mainsite\_mantis\_01-13-2009.sql.gz
|   |\-\- mainsite\_mantis\_01-14-2009.sql.gz
|   |\-\- mainsite\_mantis\_01-15-2009.sql.gz
|   |\-\- mainsite\_mantis\_01-16-2009.sql.gz
|   |\-\- mainsite\_mantis\_01-17-2009.sql.gz
|   |\-\- mainsite\_mantis\_01-18-2009.sql.gz
|   `\-\- mainsite\_mantis\_01-19-2009.sql.gz
`\-\- taskfreak.mainsite.org
    |\-\- mainsite\_taskfreak\_01-11-2009
    |\-\- mainsite\_taskfreak\_01-11-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-12-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-13-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-14-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-15-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-16-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-17-2009.sql.gz
    |\-\- mainsite\_taskfreak\_01-18-2009.sql.gz
    `\-\- mainsite\_taskfreak\_01-19-2009.sql.gz

### The Result

So as the script walks through the structure above it prints a log to the effect of;

see /home//sql_dumps/Recycler.log for details


\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
	SQL Recycler Log for:
	Sun Feb 8 00:00:07 PST 2009
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*


/home/MYUSERNAME/sql_dumps/edwardawebb.com
       	default Retain period being overridden
	purging files older than 4 days
	SQL Files being Delete from /home/masterkeedu/sql_dumps/edwardawebb.com
		./edwardawebb\_wordpress\_01-28-2009.sql.gz
		./edwardawebb\_wordpress\_02-03-2009.sql.gz
		./edwardawebb\_wordpress\_01-29-2009.sql.gz
		./edwardawebb\_wordpress\_02-02-2009.sql.gz
		./edwardawebb\_wordpress\_01-31-2009.sql.gz
		./edwardawebb\_wordpress\_01-30-2009.sql.gz
		./edwardawebb\_wordpress\_02-01-2009.sql.gz
	Success


/home/MYUSERNAME/sql_dumps/mantis.mainsite.org
	default Retain period being overridden
	purging files older than 4 days
	SQL Files being Delete from /home/masterkeedu/sql_dumps/mantis.mainsite.org
		./webbmaster\_mantis\_01-30-2009.sql.gz
		./webbmaster\_mantis\_01-31-2009.sql.gz
		./webbmaster\_mantis\_02-01-2009.sql.gz
		./webbmaster\_mantis\_01-27-2009.sql.gz
		./webbmaster\_mantis\_01-29-2009.sql.gz
		./webbmaster\_mantis\_02-02-2009.sql.gz
		./webbmaster\_mantis\_01-28-2009.sql.gz
	Success


/home/MYUSERNAME/sql_dumps/taskfreak.mainsite.org
        purging files older than 60 days
        No files matching purge criteria
        Success 

As with any article I welcome feedback or questions!
