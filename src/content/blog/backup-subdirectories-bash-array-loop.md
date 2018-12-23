---
title: 'Backup all sub-directories with a Bash array loop'
date: Thu, 15 Apr 2010 22:02:05 +0000
draft: false
tags: [backup, bash, cron, linux, MIsc.Tips, shell, tar]
---

I manage lots of domains, and offer my clients free backup and recovery service. Nice selling perk, but I best be damn sure I am backing things up regularly.  Since there is no way my space-cadet brain would remember that, I rely on my 'nix friends: **bash, cron and tar** to neatly package every sub-directory of my webroot into their own little tarballs. **The bash script included after the break reads all directories into an array that we can loop through** and manipulate as needed**.**

Background
----------

My webroot is pretty straightforward. Each subdirectory is the full URL of a site. Example:

webroot
|\-\- baungenjar.com
|\-\- bythebootstrap.com
|\-\- cafe--espresso.com
|\-\- crm.webbmaster.org
|\-\- eaw-technologies.com
|\-\- edwardawebb.com
|\-\- entrepreneurmeetcapitalist.com
|\-\- kicksareforribs.com
|\-\- ollitech.com
|\-\- outlaw-photography.com
|\-\- piwik.baungenjar.com
|\-\- rendinaro.com
|\-\- riversidegrillnh.com
|\-\- sidi.webbmaster.org
|\-\- status.webbmaster.org
|\-\- steadfastsites.com
|\-\- stonybrookpottery.com
|\-\- survey.webbmaster.org
|\-\- top.webbmaster.org
|\-\- trippymedia.com
|\-\- webbmaster.org
`\-\- wishlist.webbmaster.org

So I want to take each directory and create a gzipped tarball using _tar -zcf_.    I don't want to do any manual intervention. *ALso, I want to exclude some directories.

Solution
--------

This actually took me much longer than it should have. **Too many articles insisted you should change the internal field separator (IFS) to a newline character and just use _ls_**.  Now in my training I was learn-ed that messing with IFS can be dangerous, and will disrupt many things, including any command that relies on options or arguments (i.e. ALL) **So rather than make my entire script confirm to pesky newlines returned by ls, I did one simpler - eliminate the newlines in place of a decent token separator, like a space!** To exclude directories I just use a magic file ".DONT_BACKUP" that the script checks for.

Code
----

#!/bin/bash
#
\# Backup all directories within webroot
\# use empty file ".DONT_BACKUP" to exclude any directory


\# days to retain backup. Used by recycler script
DEFRETAIN=14
LOGFILE=/home/webb\_e/site\_backups/WebrootBackup.log
#
#
BU\_FILE\_COUNT=0
#
\# and name of backup source subfolder under the users home
WEBDIR=webroot
#
\# and name of dest folder for tar files
DESDIR=site_backups

#alright, thats it for config, the rest is script
#########################################


cd ${HOME}/${WEBDIR}/


TODAY=\`date\`
BU\_FILE\_COUNT=0
suffix=$(date +%m-%d-%Y)
printf "\\n\\n********************************************\\n\\tSite Backup r Log for:\\n\\t" | tee -a $LOGFILE
echo $TODAY | tee -a $LOGFILE
printf "********************************************\\n" $TODAY | tee -a $LOGFILE
echo "see ${LOGFILE} for details"

#for DIR in $(ls | grep ^\[a-z.\]*$) 

for DIR in $(ls | grep ^\[a-z.\]*$) 
do
	echo $DIR
	#tar the current directory
	if \[ -f $DIR/.DONT_BACKUP \]
	then

		printf "\\tSKIPPING $DIR as it contains ignore file\\n" | tee -a $LOGFILE
		
	else
		cpath=${HOME}/${DESDIR}/${DIR}
		#
		#check if we need to make path
		#
		if \[ -d $cpath \]
		then
			# direcotry exists, we're good to continue
			filler="umin"
		else
			echo Creating $cpath
			mkdir -p $cpath
			echo $DEF\_RETAIN > $cpath/.RETAIN\_RULE
		fi
		#
		 
		tar -zcf ${HOME}/${DESDIR}/${DIR}/${DIR}_$suffix.tar.gz ./$DIR
		BU\_FILE\_COUNT=$(( $BU\_FILE\_COUNT + 1 ))
	fi
	
done
printf "\\n\\n********************************************\\n" | tee -a $LOGFILE
echo $BU\_FILE\_COUNT sites were backed up
printf "********************************************\\n" $TODAY | tee -a $LOGFILE

Result
------

$ ~/scripts/file_backups/SiteBackup.sh
see /home/myself/site_backups/WebrootBackup.log for details


\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
        Site Backup r Log for:
        Thu Apr 15 14:31:53 PDT 2010
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
albums.stonybrookpottery.com
baungenjar.com
bythebootstrap.com
crm.webbmaster.org
digbiz.webroot.com
dotproject.webbmaster.org
edwardawebb.com
kicksareforribs.com
mantis.webbmaster.org
        SKIPPING mantis.webbmaster.org as it contains ignore file
ollitech.com
openx.webbmaster.org
piwik.baungenjar.com
rendinaro.com
riversidegrillnh.com
sidi.webbmaster.org
status.webbmaster.org
steadfastsites.com
stonybrookpottery.com
survey.webbmaster.org
svn.webbmaster.org
taskfreak.webbmaster.org
test.kicksareforribs.com
texpat.webbmaster.org
top.webbmaster.org
        Creating /home/myself/site_backups/top.webbmaster.org
trac.webbmaster.org
trippymedia.com
wave.webbmaster.org
webbmaster.org
wishlist.webbmaster.org


\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
33 sites were backed up
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*

But wait! We wanted to automate this whole thing right? And so we shall.

Using Cron to automate the process
----------------------------------

If your using a webhost they likely provide a GUI to add cron jobs. If that's the case you can just point to the full path where you saved the above script, select the interval and your good to go. If your using this on your own server you'll need to get your hands dirty with a crontab. You can open the crontab file in your editor of choice, or call it from the command line. IN this example we'll rely in vi, my systems default editor. Create a crontab file if it does not already exist and open it for edit

crontab -e

You may see some existing lines or you may not. Just remember one job per line. THe layout may seem overwhelming at first, but its quite simple, and breaks down like this

min     hour     day    month    weekday     job\_to\_Run

The values are in the respective ranges for day of week 0 is Sunday.

0-59    0-23     1-31    1-12     0-6        filename

To omit a field replace it with an asterisk (*) which means all values. Alternately you may use comma separated lists. Although I believe it will treat any whitespace as a delimiter I use tabs to make the organization a little nicer. So let's suppose I want to run this job nightly, it is after all named DAILY sql backup :) I will add the following line to my crontab

15    0     *    *   *     $HOME/scripts/file_backup.sh > logfile.log

This means every day @ 00:15 a.k.a 15 minutes past midnight it will run the script and print any output into the specified logfile. If you leave off the redirect to logfile it will email the user with the results. To omit any output use the handy standby

>/dev/null 2>&1

.

More Help
---------

**If you are curious about the script that will actually recycle old backups, then I suggest [Log Recycler Script](https://blog.edwardawebb.com/linux/log-recycler-script) which could easily be updated to handle .tar.gz files instead of .sql.gz files :)** **If you want to backup your MySQL databases, I have that too, [Shell script to backup multiple databases](https://blog.edwardawebb.com/web-development/simple-shell-script-backup-multiple-mysql-databases)**