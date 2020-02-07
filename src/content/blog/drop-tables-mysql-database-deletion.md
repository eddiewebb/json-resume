---
title: 'Drop all tables from a MySQL Database without deletion'
date: Fri, 13 Feb 2009 22:25:52 +0000
draft: false
tags: [Database Tips, linux, mysql]
---

**This solution allows you to purge all tables from a database without actually deleting the database.** This may not seem practical to those that have full rights and wonder.. "Why not just create a new DB?". For others that are using a hosting plan or work for a large company with restrictive bureaucracy will appreciate this simple tip.  The reason is that **your account may only have specific rights on that Database** and absolutely no rights on the hosting server.  Even if you had permission to delete the old DB, you would have to jump through hoops to get a new one created.  So in short, "Because we can't" It has also been pointed out as a way to maintain the schema.

Write a script to loop through all current tables and drop them? - NO!
----------------------------------------------------------------------

You could get a listing of all tables, iterate through an loop and drop the tables, but let's see if we can't think of a one liner...

Rely on mysqldump and mysql to do all the work? - YES!
------------------------------------------------------

We need to drop tables, that's obvious.  But how to get all the tables with drop command in hand.  What about our ever so faithful and functional friend mysqldump? Of course! Not only can mysqldump handle giving us the names of all the tables, but it can also hand us the drop command. **You'll need to execute this command where mysqldump and mysql binaries live, typically this is /usr/bin.**

/usr/bin/mysqldump -uuser\_name -psecretpassword --add-drop-table database\_name | grep ^DROP | /usr/bin/mysql  -uuser\_name -psecretpassword database\_name

SO we pump out all the table and data from the database,use grep to trash everything but the lines that begin with the drop commands and pass that right back into mysql. Works, but should we be passing and parsing all the data just to trash it? Probably not.

Keeping the workload small - no data!
-------------------------------------

Particularly for those of you that have rather large Databases we don't want to waste time passing around data, so let's leave it out entirely.

/usr/bin/mysqldump -uuser\_name -psecretpassword --no-data --add-drop-table database\_name | grep ^DROP | /usr/bin/mysql  -uuser\_name -psecretpassword database\_name
