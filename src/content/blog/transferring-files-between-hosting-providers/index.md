---
title: 'Transferring files between hosting providers'
date: Thu, 08 Jan 2009 23:46:50 +0000
draft: false
tags: [ftp, linux, linux, transfer files, web development]
---

I recently upgraded my hosting provider to DreamHost on the advice of a co-worker. The reasons for the move are many, but the topic of this article is **how I am to move the hundreds of files I host from one server to the other**.

The problem
-----------

I knew there was no way I am going to torment myself by compressing, downloading, uploading and un-compressing the files. So what other options did I have? **I thought about using ftp to transfer files directly between servers**, and even plugged out a little automated bash script to handle this. I quickly realized the fact that **ftp doesn't work for folder structures**, and unless I want to list, recurse, and create directories then this option would not suffice.

The solution
============

So after looking around for a bit I discovered an old friend wget. Unlike ftp, **wget not only usese recursion for the folder structures, but it accurately recreates them on the local machine**. In this case local refers to the server running wget, not my wimpy desktop. If you haven't realized yet I should state for the record, **DreamHost provides full shell access, which you'll need**. Otherwise you'll need to use some other means.

Update
------

If the remote and local server provide for it you can use

rsync -av /source/ user@server:/dest/

to copy all the files to a remote server. But that's for another article perhaps.

The attack plan
===============

In order to keep my sanity in check I decided a staged attack.  I would limit each run of wget to one parent directory on my old server. The folders will all be placed in a subdirectory of my new server which I can then roll out by using standard 'nix commands like mv and cp. I also decided to provide some means of record, so I captured all output into a log. That said I don't want to be in the dark about where the progress stands, so I used another old standby 'nix command, tee,  to split output to the screen and log. Ok, now that I have level-set with the objectives and tools, let us dig in.

Login to your new Host's shell using SSH
----------------------------------------

Yes, one of the reasons I chose DreamHost is the ability to securely access the 'nix shell using SSH. In my case I chose the Bourne Again shell because it is boss :)

eddie@linux-cv2g:~/Scripts/Dream_host> ssh myusername@myprimarydomain.org
myusername@myprimarydomain.org's password: XXXXXXXX
Linux galactus 2.6.24.5-xeon-aufs20081006-grsec #1 SMP Thu Oct 9 15:42:59 PDT 2008 x86_64
              _            _
   __ _  __ _| | __ _  ___| |_ _   _ ___
  / _` |/ _` | |/ _` |/ __| __| | | / __|
 | (_| | (_| | | (_| | (__| |_| |_| \__   \__, |\__,_|_|\__,_|\___|\__|\__,_|___/
  |___/
 Welcome to galactus.dreamhost.com

Any malicious and/or unauthorized activity is strictly forbidden.
All activity may be logged by DreamHost Web Hosting.

Call wget passing the directory to transfer
-------------------------------------------

Although we could leave the directory off, this would result in wget grabbing everything it can find, which just seemed like a bit too much to deal with for one go. In this example I am grabbing the bulk of my files in the HOSTED_SITES folder.

wget -r -l 10 ftp://oldusername:oldpassword@oldhostingprovider.com:21 -I HOSTED_SITES | tee -a ~/transfer_logs/transfer.log

#### What's all this then?

**wget** requires at a minimum the host, a user and a password. But in order to accomplish our task we're best off to add some switches.

*   The _-r_ switch tells wget to act recursively on the folder structure (grabbing sub-folders and files)
*   The _-I_ switch is followed by a list of directories or files to **I**nclude. Alternately you can use _-X_ which, yes you guessed it, is followed by a list of folders or files to eXclude.
*   I added the _-l_ switch after viewing the results on my new host to discover that the recursion only traversed 5 levels. Doh! A quick read through the man pages revealed the **l**evel switch which overrides the default of 5. I recommend you scour your deepest path on the old server and set it to that value (add 1 if your also using the host as a directory)
*   If you happen to interrupt the transfer you can use the _-c_ (continue) option to only complete partial or missing files
*   Finally I used my old friend tee, which as it's name suggests will split the output to the screen and to an alternate output. That alternate in this case is a log file in a directory off my home folder(~). I added the -a switch to append to output. But you can leave it off to overwrite (think of it like >> vs. >).
.

#### Alternately

wget -m ftp://oldusername:oldpassword@oldhostingprovider.com/path/to/grab | tee -a ~/transfer_logs/transfer.log

#### What's all this then?

**-m** is short for mirror and will use infinite recursing (_-l inf_) and maintains timestamps.

Grab yourself a drink and wait for the finish
---------------------------------------------

Yeah, its that easy.  Of course as I mentioned above we're copying the files into a sub-directory which is wget's default behavior. I opted to stick with it so I can keep my top-level directory cleaner. Since I was excluding some paths, my job finished something like this (with a ton of output between);

Not descending to `SITE_DOWN_MESSAGES' as it is excluded/not-included.
Not descending to `_db_backups' as it is excluded/not-included.
Not descending to `cgi' as it is excluded/not-included.
Not descending to `dotproject' as it is excluded/not-included.
Not descending to `php_uploads' as it is excluded/not-included.
Not descending to `phpmyvisites' as it is excluded/not-included.
Not descending to `stats' as it is excluded/not-included.

FINISHED --05:37:43--
Downloaded: 155,152,485 bytes in 12640 files
