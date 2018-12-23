---
title: 'Script to Backup Files (with Version History) Before Editing'
date: Sat, 12 Jun 2010 01:02:41 +0000
draft: false
tags: [backup, bash, Site News]
---

Editing config files is the only certain thing above taxes and death (too lame?). Whether it's your apache setup, or dns bindings its likely you use vi or another favorite editor to open your server's files, make that needed update and save. If you were good you copied the file first to a backup tagged by date. .. **But managing that process manually is just a workflow annoyance.** **So the script below backups the file, tags it with the date, and opens it for edit. Additionally you can set a maximum number of versions to track any given day.** It adds no more effort than calling vi..

### calling a file to edit

Example, to edit config.conf, just pass the file as a parameter to the script you save.

$ <thisscript>.sh config.conf

the result (for today ) would be a new file

config.conf.backup.61110.1

and vi would then open with config.conf ready to edit. Running it again the same day would produce

config.conf.backup.61110.2 # older file from above renamed
config.conf.backup.61110.1 # your earlier work, now backed up in additona to original

This continues as you save and reopen the file until versions are reached, at which point the oldest gets overwritten.

#### output

version 1 already exists today
version 2 already exists today
version 3 already exists today
version 4 already exists today
version 5 already exists today
version 6 already exists today
version 7 already exists today
version 8 already exists today
version 9 already exists today
version 10 already exists today

### The Code: Script to backup and edit a file with version

#!/bin/bash
\# Author : Eddie Webb https://blog.edwardawebb.com
#License: GNU GPL v3 - http://www.gnu.org/licenses/gpl-3.0-standalone.html
#
\#    backup and edit
\# Script to edit a file only after making a backup tagged with date and version. 
\# Only version will exist for any one day
#



if \[ $# -ne 1 \]
then
	printf"\\nUsage:\\n%s " $0
	exit 1
fi

date=$(date +%m%d%y)
echo $date
maxBacks=10

file=$1

path=$file.backup.$date

echo Backup Scheme: $path

\# check for exsiting backups, and get highest version
for (( i=1;i <= $maxBacks; i=$i+1))
do
version=$i

        if \[ -f "$path.$i" \]
        then
                echo version $i already exists today
        else
                #file doesnt exist, and will be our new highest version
                break
        fi
done
#now push each copy back one for new (higher version are older, version 1 is the latest..
if \[ $version -gt 1 \]
then

        for(( j=$version; j>1; j-- ))
        do
                cp $path.$(($j - 1)) $path.${j}
        done
fi


cp $1 $path.1

#you can pick any editor you like ;)
vi $1