---
title: 'Scope Issue in Bash While Loops'
date: Sat, 07 Feb 2009 15:30:32 +0000
draft: false
tags: [bash, linux, read, while]
---

I was writing a pretty complex Log Recylcer script that handles rotation, purging and compression.  I wanted to print a nice summary at the end with all the counts.  I got incredibly frustrated when a simple **variable increment seemed to have scope issue**.** I can only re-create the issue using a pipe and read**.

Background
----------

For those of you familiar with Bash you know that a variable declared inside an if statement or loop can usually be accessed outside that block without issue. unlike other languages (PHP or Java for example) where a variable must be initialized outside the block first. In Bash anything declared inside a block is preserved for the life of the script. **Except when that block happens to be a while loop using read from a piped command!**

What am I talking about?
------------------------

Let us look at an example. Feel free to pop these 3 scripts into your console to learn along with us.

### Bash script NOT requiring initialized variable

#!/bin/bash

#declare nothing for LOOPCOUNT!

#but we'll need something for our while loop
i=0

while [ $i -lt 5 ]
do
	printf "LOOPCOUNT is %d\n" $LOOPCOUNT
	((LOOPCOUNT++))

	((i++))
done
#our count will be preserved
printf "Final LOOPCOUNT is %d\n" $LOOPCOUNT

#### This will print

eddie@linux-cv2g:~/Scripts> ./LoopDemo.sh
LOOPCOUNT is 0
LOOPCOUNT is 1
LOOPCOUNT is 2
LOOPCOUNT is 3
LOOPCOUNT is 4
Final LOOPCOUNT is 4

As you can see, despite the fact that LOOPCOUNT was first introduced inside the While Loop it is still available after the loop has exited. As I mentioned before this is not true of languages like PHP or Java.

### Bash Script ignoring initialized variable !

Now here's the meat of this article. Despite declaring the variable, and incrementing it properly,  as soon as we leave the loop we lose the value! This type of while loop is useful for reading each line of a file, or each entry in a directory listing.

#!/bin/bash

#ls will list all files in this directory, we pump that through a pipe to While which will act on each entry

ls | while read LINE
do
	printf "LOOPCOUNT is %d\n" $LOOPCOUNT
	((LOOPCOUNT++))

done
#our count will NOT be preserved
printf "Final LOOPCOUNT is %d\n" $LOOPCOUNT

Since my demo folder has 8 files in it...

#### This will print

LOOPCOUNT is 0
LOOPCOUNT is 1
LOOPCOUNT is 2
LOOPCOUNT is 3
LOOPCOUNT is 4
LOOPCOUNT is 5
LOOPCOUNT is 6
LOOPCOUNT is 7
Final LOOPCOUNT is 0

Zoot ALors! The variable has amnesia and forgot it's value!!

### Bash Script using While Loop and Read is tamed

#!/bin/bash



#if we break up the ls and while commands we can fix this issue

ls > filelist

#set stdin to the file listing we jsut made
exec 0 #### This will print

LOOPCOUNT is 0
LOOPCOUNT is 1
LOOPCOUNT is 2
LOOPCOUNT is 3
LOOPCOUNT is 4
LOOPCOUNT is 5
LOOPCOUNT is 6
LOOPCOUNT is 7
LOOPCOUNT is 8
Final LOOPCOUNT is 8

(The ls command includes our new script which explains the higher count)

Summary
-------

 **My best guess** is that using a command like

ls | while read LINE; do

 opens a sub-shell for the duration of the loop. 

This would explain while the value is maintained within the loop but lost immediately after.

I would love to hear from some Bash gurus on this topic!
