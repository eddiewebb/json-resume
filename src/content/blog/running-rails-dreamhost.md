---
title: 'Running with Rails on Dreamhost'
date: Wed, 05 Aug 2009 18:35:15 +0000
draft: false
tags: [dreamhost, rails, ruby, web development]
---

A quick and dirty tutorial to get a new **Ruby on Rails application running on your [DreamHost](http://www.dreamhost.com/r.cgi?488244/hosting.html|EDDIESAVES "Save $50 off the yearly cost of hosting with Promo Code "EDDIESAVES"")** server.  In am going to concentrate on the easiest method, which is to use the Phusion Passenger module, a.k.a. 'mod_rails'.  
  

Introduction
------------

Some wise warnings from the [DreamHost Passenger Wiki](http://wiki.dreamhost.com/Passenger "View the Support Wiki article on Rails for more great info.") page;

*   "Passenger and [Mongrel](http://wiki.dreamhost.com/Mongrel "Mongrel") fulfill very much the same roles so you most likely do NOT want to be using both of them on the same domain or website."
*   "Passenger disables some mod_rewrite functionality."

Alright, so without further adue I will jump into the process of **getting a Ruby on Rails application to run on DreamHost** servers.

Special thanks to members of the [DreamHost support wiki](http://wiki.dreamhost.com/) and [RubyDreams](http://rubydreams.dreamhosters.com/2009/05/running-an-application-using-passenger-mod_rails/) for inspiration and guidance.

7 Steps to get Ruby on Rails moving with  DreamHost hosting
-----------------------------------------------------------

1.  **Sign up with DreamHost** I imagine if your reading this article then you've done this step - Congratualtions! But just in case [here's $50 towards your first year](http://www.dreamhost.com/r.cgi?488244/hosting.html|EDDIESAVES "$50 off your first year of DreamHost web hosting.").
    
2.  **Activate mod_rails** This is very easy, and very important. When you are setting up a new domain, be sure to check the 'mod_rails' checkbox. _DreamHost Panel > Manage Domains > (Add or Edit)_ \[caption id="attachment_546" align="aligncenter" width="300" caption="Setting up the domain to use Passenger"\][![Setting up the domain to use Passenger](https://blog.edwardawebb.com/wp-content/uploads/2009/08/dh_passenger-300x171.PNG "dh_passenger")](https://blog.edwardawebb.com/wp-content/uploads/2009/08/dh_passenger.PNG)\[/caption\] DreamHost will yell at you and say something about a public directory. Just append the word 'public' to the end of the path, e.g. "/home/username/mynewdomain.com/public".  This directory will be populated in the following steps.
    
3.  **Create DB** \- will be ready by the completion of next step Use the DreamHost web panel to create a new DB. _Goodies > MySQL Databases > Create New_ \[caption id="attachment_547" align="aligncenter" width="300" caption="Setting up a new DB on DreamHost"\][![Setting up a new DB on DreamHost](https://blog.edwardawebb.com/wp-content/uploads/2009/08/dh_db-300x288.PNG "dh_db")](https://blog.edwardawebb.com/wp-content/uploads/2009/08/dh_db.PNG)\[/caption\]
    
4.  **Create Rails app** For this you'll need to open up your favorite console and ssh to your DreamHost account. Navigate to your webroot directory and type the following;
    
    $ rails -d mysql mynewdomain.com
    
    (I have a standard of putting all domains in a folder called webroot, so my full path is /home/username/webroot/mynewdomain.com ) You can browse around now and notice several created directories and files including the 'public' folder required above.
    
5.  **Edit DB Connection Strings** Of course we need to tell our Ruby app about the DB, and how to connect. Open the file /yourapp/config/database.yml Edit the parameters;
    
    development:
    adapter: mysql
    encoding: utf8
    database: my\_ruby\_app_db
    pool: 5
    username: unsername
    password:dbpassowrd
    host: mysql.host
    
6.  **Prepare the DB for use** By now the new DB should be up and running thanks to one of many Happy DreamHost Robots. cd into the directory created in the last step;
    
    $ cd mynewdomain.com
    $ rake db:migrate
    
    This will ensure your connections strings are correct and the DB is ready.
    
7.  **Restart Rails** This is the area that was unknown to me as a total Rails newbie. You can always **restart your application** and clear any cached configuration information by throwing a special file into the tmp directory.
    
    $ touch tmp/restart.txt
    

Hooray!   That's it.  In about 15 minutes you have created a new Ruby on Rails application.  At this point it is a pretty _useless_ application. But don't let that dishearten you, there are lots of great tutorials that will show you how to make something useful! Like this one for example. You can skip the DB and basic setup and jump right into the coding - [http://guides.rubyonrails.org/getting_started.html](http://guides.rubyonrails.org/getting_started.html "Create a simple Blog using Ruby.")