---
title: 'Redirecting users to a Site-Down message'
date: Wed, 29 Oct 2008 22:58:11 +0000
draft: false
tags: [apache, apache, htaccess, redirect, web development]
---

**When making changes to your backend or user interface, it is nice to let users know just what is going on.** Changing out your index page will only work for users who go to your main pages. In order to effectively block all pages, and redirect to a proper message, I recommend using apache's .htaccess. The best part about this feature is you can **still allow your development team to access the site while blocking everyone else.**

### There are two main pieces to this method;

1.  Create a pretty, funny or informational page explaining why users can't reach the good stuff.
2.  Create an .htaccess file to point all request (except yours) to the page above.

### The site down message

A simple 'This site is down for maintenance" works, but how boring!  Instead you'll see a lot of sites using humor to mask the horrible technical struggle that may be taking place behind the scenes.  Elaborate messages like "Unfortunately our intern, Scott, decided that CAT 5e cables are overrated. However he soon discovered that telepathy is not a common trait among servers.  Please be patient as we work to restore service." may or may not hit your target audience. But whatever the case try to be unique in the way that your users have come to rely on.

##### sitedown.html

Baby come back

This site is down, but no need for alarm
========================================

You were right, it wasn't you.. it was us.

But we're different know, and we really _want_ to change.

Give us another chance, and by tomorrow we'll be a whole new site, a better site, promise.

'

#### Service should be restored by the end of October 29th

We apologize for any inconveniences caused

### The redirect

Once you've created your page, whatever it may say, save it to the root directory of your site. The .htaccess is a file read by apache when a directory is accessed.  For redirection it requires that mod_rewrite is enabled in apache.  There is already much good information on general practice and such for [.htaccess](http://httpd.apache.org/docs/1.3/howto/htaccess.html), so we'll keep it simple here. **Basically we'll use some regular expressions to apply  rules to all incoming requests.**

1.  IF  the request is not from an internal IP address
2.  AND it is not for our sitedown page (that would cause an infinite redirect loop, oh my!)
3.  THEN send them to the site down page instead.

##### in /.htaccess

RewriteEngine On
RewriteBase /
RewriteCond %{REMOTE_ADDR} !^10\\.103\\.18\\.104     # <--YOUR IP HERE
RewriteCond %{REQUEST_URI} !^/sitedown\\.html$                      
RewriteRule ^(.*)$ http://example.com/sitedown.html \[R=503\]

The piece \[R=503\] is the type of header sent to the requester, and used by search engines and other bots. **You should not use 404 or other 400 level errors**. 404 for example means "this page does not exist" (and never will). In reality our page could be valid on any other day. **503 in contrast means "service (temporarily) unavailable." It indicated the redirect to be temporary in nature, as appose to a 301, or 404 meaning permanent.** This tells Google that your site , and all its pages will be back eventually, and to not purge them from its index. **Another perk of 503 is that dependent services on your site can intelligently relay the message to users.**

### That's it!

**Just restart apache to pick up the changes;** /etc/init.d/apache2 restart

Troubleshooting
---------------

1.  **Nothing happens!** No worries, check in **httpd.conf** or **default-server.conf** for code that looks similar to whats below AND references your web root directory. In this case it is my /src/www/htdocs directory.  
    
    #
    \# Configure the DocumentRoot
    #
     #
    	# Possible values for the Options directive are "None", "All",
    	# or any combination of:
    	#   Indexes Includes FollowSymLinks SymLinksifOwnerMatch ExecCGI MultiViews
    	#
    	# Note that "MultiViews" must be named \*explicitly\* --- "Options All"
    	# doesn't give it to you.
    	#
    	# The Options directive is both complicated and important.  Please see
    	# http://httpd.apache.org/docs-2.2/mod/core.html#options
    	# for more information.
    	Options All
    	# AllowOverride controls what directives may be placed in .htaccess files.
    	# It can be "All", "None", or any combination of the keywords:
    	#   Options FileInfo AuthConfig Limit
    	AllowOverride All
    	# Controls who can get stuff from this server.
    	Order allow,deny
    
    	Allow from all 
    
    Make sure the AllowOverride is set to All.
2.  **Error about infinite loop** Make sure you have a line like the one below, and that it accurately reflects the location of your message page.
    
    RewriteCond %{REQUEST_URI} !^/sitedown\\.html$  
    
    Notice the characters
    
    !, ^, $
    
    , these are special [metacharacters](http://www.catpumps.com/help/en/regex3.html). **!** means NOT, **^** is the start just after your domain, and **$** is the end of the url. So it meets my example of "http://example.com**/sitedown.html**"
