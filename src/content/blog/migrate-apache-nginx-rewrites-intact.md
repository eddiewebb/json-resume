---
title: 'Migrate from Apache to nginx (and keep rewrites intact)'
date: Thu, 28 Jan 2010 20:10:13 +0000
draft: false
tags: [apache, apache, nginx, nginx, rewrite, Site News]
---

**nginx** is a very fast and very lightweight web server that can handle static HTML blazingly fast, and does very well with dynamic (PHP) content as well.   In fact the very site your viewing is running atop of [nginx](http://wiki.nginx.org/Main "Learn more about nginx").  nginx isn't ideal for every server, and can't handle SVN or WebDAV among other protocols.  But for your average site running PHP, Ruby or Django, **nginx is choice**. The trouble was that I have lots of site (like this one!) that rely on a myriad of rewrite rules and logic to direct users properly.  **Because we lose the mod_rewrite provided by apache, we need to tell nginx about our rewrite rules.** **Luckily the logic is very similar, and all expression based as before...**

### create domain specific configuration

The first step is creating directories for each site you want to customize.  Any file within this directory will be read into configuration when nginx starts or reloads. /home/my_user/nginx/edwardawebb.com/wordpress.conf

### Harvest those .htaccess files

next we turn to our existing rules as a launch pad for our new rewrite logic.

#### your apache rule (from .htaccess)

RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.php?url=$1 \[QSA,L\]

#### your new nginx config (into wordpress.conf)

if (!-e $request_filename) {
rewrite ^(.*)$ /index.php?url=$1 last;
}

**Note the similarity!** " if the path they are looking for does not exist, give them this path instead. " The differences are subtle but important.  Apache assumed absolute paths in the created path, so index.php would be /index.php - but nginx does not make that assumption, so we need to explicitly include the root /.

### Got more rules to rewrite?

I am actually finding nginx's logic based syntax much easier to master than Apache's.  You can specify rules for specific domains or servers, and use many variables including the user agent and [http://nginx.org/en/docs/http/converting\_rewrite\_rules.html](http://nginx.org/en/docs/http/converting_rewrite_rules.html "Learn how to migrate more rewrite rules.") [http://wiki.nginx.org/NginxConfiguration](http://wiki.nginx.org/NginxConfiguration "Learn how to conifgurwe the most common tools (wordpress, drupal, Passenger, python, etc)")

### Reload nginx

For any changes to take affect you will need to force nginx to reload. sudo /etc/init.d/nginx reload If you still have questions maybe it is because you have not read the page [here](http://wiki.nginx.org/NginxConfiguration "How to configure ANYTHING on nginx") \- but please post your thoughts!