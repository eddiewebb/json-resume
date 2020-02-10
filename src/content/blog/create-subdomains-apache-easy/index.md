---
title: 'Create Subdomains with Apache - The Easy Way'
date: Fri, 10 Oct 2008 15:04:16 +0000
draft: false
tags: [apache, apache, CakePHP, localhost, subdomains, web development]
---

**This will walk through the process of adding sub domains to your local server ( onesite.localhost  , twosite.localhost, etc ).** To understand this need you are liekly working on multiple sites at once on your local development machine.  So lets say you have an excellent CakePHP application, a gnarly JS sandbox, and your personal start page all belonging to different directories. Problem is, there is only one localhost.  But just like your live server can have subdomains, you can skip DNS and use virtualhosts in Apache do the work.  **Imagine, unlimited sub domains all live at one on your localhost pointing to folders all across your machine.** First off I will be be clear that this is instructions for a Linux device.  If your not running Linux, then [start today](http://download.opensuse.org "Download the latest SuSE Linux DVD"). You'll be happy you made the switch to the ubiquitous LAMP architecture.

#### First thing to do is choose a subdomain for each folder, in my case I have two sub domains;

*   digbiz.localhost             -   /home/eddie/workspace/Digital_Business/
*   phpmyadmin.loclahost   -   /srv/www/phpMyAdmin

#### These are in additions to my usual localhost path;

*   localhost                      -  /srv/www/htdocs/

Setting your top domain - localhost
-----------------------------------

Most of you have already done this step long ago, but just to be certain, you have set your documentroot and settings in

#### **/etc/apache2/default-server.conf**

#
# Global configuration that will be applicable for all virtual hosts, unless
# deleted here, or overriden elswhere.
# 

DocumentRoot "/srv/www/htdocs"
#
# Configure the DocumentRoot Properties
#
 Options All
	# AllowOverride controls what directives may be placed in .htaccess files.
	# It can be "All", "None", or any combination of the keywords:
	#   Options FileInfo AuthConfig Limit
	AllowOverride All
	# Controls who can get stuff from this server.
	Order allow,deny
	Allow from all 
#
# Configure Sub-Domain Properties. This prevents those nasty 403 errors
#

# mysql administration tool
 Options Indexes MultiViews
	AllowOverride All
	Order allow,deny
	Allow from all 

# a client web site built with CakePHP
 Options All
	AllowOverride All
	Order allow,deny
	Allow from all 

Setting your sub domain's paths
-------------------------------

In order for this to work we'll need to be specific about which sub domain points where, easy enough. You'll notice I am not using httpd.conf, but rather a configuration file in a sub direcotry that is referenced in the main configuration file. This is the typical setup, and any *.conf file in most of the *.d directoriess should be read. **If the folder vhosts.d does not exist, add this code directly to the end of httpd.conf.**

#### /etc/apache2/vhosts.d/subdoms.conf

NameVirtualHost localhost:80
# the mysql tool's url
 # and absolute path
DocumentRoot "/srv/www/phpMyAdmin/" 
#Same for the Client Site
 DocumentRoot "/home/eddie/workspace/Digital_Business/app/webroot/" 

You may add as many as you want ( to a limit I Imagine) by adding more of the < through> blocks. The very first line of the code should only be used once.  The names you use here are the host names we'll need below, so keep note.

Setting your new sub domains as valid hosts
-------------------------------------------

For this part you need to edit your you can either edit /etc/hosts directly, or for those who are unsure, use the systems **administration panel > network (services) > host(name)s**.  I'm running suse so my system panel is Yast, for you it may differ. [caption id="attachment_154" align="aligncenter" width="300" caption="Begin by launching the Adminstration Panel"][![Begin by launching the Adminstration Panel](mnu-300x263.webp "From the Menu")](mnu.webp)[/caption] [caption id="attachment_155" align="aligncenter" width="300" caption="Run the Host Configuration module"][![Run the Host Configuration module](network-300x182.webp "network")](network.webp)[/caption] Once your inside the Host configuration module (or hosts file) just add a new record for every sub domain. In my example I use ::1 as the IP address only because IPv6 is enabled on my server. You may need to use 127.0.0.1. [caption id="attachment_156" align="aligncenter" width="300" caption="Enter each sub domain as a new record"][![Enter each sub domain as a new record](adding-300x153.webp "Adding records to hosts file")](adding.webp)[/caption] If you open that image up you'll see I have already added 'digbiz.localhost' and was in the process of adding 'phpmyadmin.localhosts.'  Remember, these are the virtual hosts we setup just before.

Restart Apache
--------------

Once your done adding the sub-domains clcik finish and the settings will be saved. You can now restart apache and test it out.

# /etc/init.d/apache2 restart

Note: I was curious if you could set up completely new domains, mylocalhost. I didn't have much luck though. If anyone has a reason, or has in fact succeeded I would love to hear about it.
