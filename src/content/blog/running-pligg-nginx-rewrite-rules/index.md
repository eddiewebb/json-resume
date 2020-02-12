---
title: 'Running Pligg on Nginx - Rewrite rules'
date: Fri, 19 Feb 2010 19:56:00 +0000
draft: false
tags: [apache, nginx, nginx, pligg, rewrite rules, web development]
---

As I mentioned in my article ["Migrate form Apache to Nginx and keep rewrite rules intact"](https://blog.edwardawebb.com/site-news/migrate-apache-nginx-rewrites-intact), Nginx is an awesome and lightweight web server. The only trouble I have ran into since the switch is Pligg. The htaccess file is ridiculously complex, and I suspect some of the rewrite rules to be repetitive or overlapping in areas. **Using the rules from my past article though I was able to get nginx rules in place that seem to work.**

#### Pliggs default htaccess file

AddDefaultCharset UTF-8

## 404 Error Page
## If Pligg is installed in a subfolder, change the below line to ErrorDocument 404 /name-of-subfolder/404error.php
ErrorDocument 404 /404error.php

## Re-directing Begin
Options +FollowSymlinks -MultiViews
RewriteEngine on
## If Pligg is installed in a subfolder, change the below line to RewriteBase /name-of-subfolder
RewriteBase /
## If installed in a subfolder you may need to add ## to the beginning of the next line
RewriteCond %{THE_REQUEST} ^[A-Z]{3,9} /.*index\.php HTTP/

## Remove these two lines if you have a sub-domain like  http://subdomain.pligg.com  or http://localhost
## Keep if your site it like   http://www.pligg.com
RewriteCond %{HTTP_HOST} !^www\.
RewriteRule .* http://www.%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
##### Re-directing End #####

## You can find the below lines pre-made for you in the category management section of the admin panel ##
RewriteRule ^(all)/([^/]+)/?$ story.php?title=$2 [L]
RewriteRule ^(all)/?$ ?category=$1 [L]
##

## The settings that you should configure are all above this line.
## Continue below only if you are an advanced user.

##### URL Method 2 Begin #####
RewriteRule ^/?$ index.php [L]
RewriteRule ^advanced-search/?$ advancedsearch.php [L]
RewriteRule ^cache/([0-9]+)/?$ index.php [L]
RewriteRule ^cache/admin_c([0-9]+)/?$ index.php [L]
RewriteRule ^cache/templates_c/([0-9]+)/?$ index.php [L]
RewriteRule ^category/([^/]+)/?$ index.php?category=$1 [L]
RewriteRule ^category/([^/]+)/([^/]+)/?$ story.php?title=$2 [L]
RewriteRule ^live/?$ live.php [L]
RewriteRule ^login/?$ login.php [L]
RewriteRule ^login/([a-zA-Z0-9-]+)/?$ login.php?return=$1 [L]
RewriteRule ^login/([a-zA-Z0-9-]+)/([a-zA-Z0-9-]+)/?$ login.php?return=$1/$2 [L]
RewriteRule ^logout/?$ login.php?op=logout&return=index.php [L]
RewriteRule ^logout/([a-zA-Z0-9-]+)/([a-zA-Z0-9-]+)/?$ login.php?op=logout&return=$1/$2 [L]
RewriteRule ^out/([\d]+)/?$ out.php?id=$1 [L]
RewriteRule ^out/(https?:.+)$ out.php?url=$1 [L]
RewriteRule ^out/([^/]+)/?$ out.php?title=$1 [L]
RewriteRule ^profile/?$ profile.php [L]
RewriteRule ^recommend/([a-zA-Z0-9-]+)/?$ recommend.php?id=$1 [L]
RewriteRule ^register/?$ register.php [L]
RewriteRule ^search/([^/]+)/page/(\d+)/?$ search.php?search=$1&page=$2 [L]
RewriteRule ^search/(.+)/?$ search.php?search=$1 [L]
RewriteRule ^searchurl/(.+)/?$ search.php?url=$1 [L]
RewriteRule ^settemplate/?$ settemplate.php [L]
RewriteRule ^story/([0-9]+)/?$ story.php?id=$1 [L]
RewriteRule ^story/([^/]+)/?$ story.php?title=$1 [L]
RewriteRule ^story/([0-9]+)/editcomment/([0-9]+)/?$ edit.php?id=$1&commentid=$2 [L]
RewriteRule ^story/([0-9]+)/edit/?$ editlink.php?id=$1 [L]
RewriteRule ^submit/?$ submit.php [L]
RewriteRule ^tag/(.+)/(.+)/?$ search.php?search=$1&tag=true&from=$2 [QSA,NC,L]
RewriteRule ^tag/(.+)/?$ search.php?search=$1&tag=true [QSA,NC,L]
RewriteRule ^tagcloud/?$ cloud.php [L]
RewriteRule ^tagcloud/range/([0-9]+)/?$ cloud.php?range=$1 [L]
RewriteRule ^topusers/?$ topusers.php [L]
RewriteRule ^trackback/([0-9]+)/?$ trackback.php?id=$1  [L]
RewriteRule ^upcoming/?$ upcoming.php [L]
RewriteRule ^upcoming/category/([^/]+)/?$ upcoming.php?category=$1 [L]
RewriteRule ^upcoming/category/([^/]+)/page/(\d+)/?$ upcoming.php?category=$1&page=$2 [L]
RewriteRule ^upcoming/(year|month|week|today|yesterday|recent|alltime)/?$ upcoming.php?part=$1 [L]
RewriteRule ^upcoming/(year|month|week|today|yesterday|recent|alltime)/category/([^/]+)/?$ upcoming.php?part=$1&category=$2 [L]
RewriteRule ^upcoming/page/([0-9]+)/?$ upcoming.php?page=$1 [L]
RewriteRule ^upcoming/(year|month|week|today|yesterday|recent|alltime)/page/(\d+)/?$ upcoming.php?part=$1&page=$2 [L]
RewriteRule ^upcoming/(year|month|week|today|yesterday|recent|alltime)/category/([^/]+)/page/(\d+)/?$ upcoming.php?part=$1&category=$2&page=$3 [L]
RewriteRule ^user/?$ user.php [L]
RewriteRule ^user/search/([^/]+)/?$ user.php?view=search&keyword=$1 [L]
RewriteRule ^user/([^/]+)/?$ user.php?view=$1 [L]
RewriteRule ^user/([^/]+)/([^/]+)/?$ user.php?view=$1&login=$2 [L]
RewriteRule ^user/([^/]+)/link/([0-9+]+)/?$ user_add_remove_links.php?action=$1&link=$2 [L]

## Admin
RewriteRule ^admin/?$ admin/admin_index.php [L]
RewriteRule ^admin_comments/page/([^/]+)/?$ admin/admin_comments.php?page=$1 [L]
RewriteRule ^admin_links/page/([^/]+)/?$ admin/admin_links.php?page=$1 [L]
RewriteRule ^admin_users/page/([^/]+)/?$ admin/admin_users.php?page=$1 [L]
RewriteRule ^story/([0-9]+)/modify/([a-z]+)/?$ admin/linkadmin.php?id=$1&action=$2 [L]
RewriteRule ^view/([^/]+)/?$ admin/admin_users.php?mode=view&user=$1 [L]

## Groups
RewriteRule ^groups/?$ groups.php [L]
RewriteRule ^groups/submit/?$ submit_groups.php [L]
RewriteRule ^groups/(members|name|oldest|newest)/?$ groups.php?sortby=$1 [L]
RewriteRule ^groups/([^/]+)/?$ group_story.php?title=$1 [L]
RewriteRule ^groups/([^/]+)/page/([0-9]+)?$ group_story.php?title=$1&page=$2 [L]
RewriteRule ^groups/([^/]+)/?$ group_story.php?title=$1&view=published [L]
RewriteRule ^groups/([^/]+)/(published|upcoming|shared|members)/?$ group_story.php?title=$1&view=$2 [L]
RewriteRule ^groups/([^/]+)/(published|upcoming|shared|members)/page/([0-9]+)?$ group_story.php?title=$1&view=$2&page=$3 [L]
RewriteRule ^groups/([^/]+)/(published|upcoming|shared|members)/category/([^/]+)/?$ group_story.php?title=$1&view=$2&category=$3 [L]
RewriteRule ^groups/([^/]+)/(published|upcoming|shared|members)/category/([^/]+)/page/([0-9]+)?$ group_story.php?title=$1&view=$2&category=$3&page=$4 [L]
RewriteRule ^groups/delete/([0-9]+)/?$ deletegroup.php?id=$1 [L]
RewriteRule ^groups/edit/([0-9]+)/?$ editgroup.php?id=$1 [L]
RewriteRule ^groups/id/([0-9]+)/?$ group_story.php?id=$1 [L]
RewriteRule ^groups/join/([0-9]+)/? join_group.php?id=$1&join=true [L]
RewriteRule ^groups/member/admin/id/([0-9]+)/role/([a-zA-Z0-9_-]+)/userid/([0-9]+)/?$ groupadmin.php?id=$1&role=admin&userid=$3 [L]
RewriteRule ^groups/member/normal/id/([0-9]+)/role/([a-zA-Z0-9_-]+)/userid/([0-9]+)/?$ groupadmin.php?id=$1&role=normal&userid=$3 [L]
RewriteRule ^groups/member/moderator/([0-9]+)/role/([a-zA-Z0-9_-]+)/userid/([0-9]+)/?$ groupadmin.php?id=$1&role=$2&userid=$3 [L]
RewriteRule ^groups/member/flagged/([0-9]+)/role/([a-zA-Z0-9_-]+)/userid/([0-9]+)/?$ groupadmin.php?id=$1&role=flagged&userid=$3 [L]
RewriteRule ^groups/member/banned/id/([0-9]+)/role/([a-zA-Z0-9_-]+)/userid/([0-9]+)/?$ groupadmin.php?id=$1&role=banned&userid=$3 [L]
RewriteRule ^groups/page/([0-9]+)/?$ groups.php?page=$1 [L]
RewriteRule ^groups/unjoin/([0-9]+)/? join_group.php?id=$1&join=false [L]
RewriteRule ^groups/withdraw/([0-9]+)/user_id/([0-9]+)/?$ join_group.php?group_id=$1&user_id=$2&activate=withdraw [L]
RewriteRule ^join_group/action/(published|queued|discard)/link/(\d+)/?$ join_group.php?action=$1&link=$2 [L]

## Live
RewriteRule ^comments/?$ live_comments.php [L]
RewriteRule ^comments/page/([^/]+)/?$ live_comments.php?page=$1 [L]
RewriteRule ^live_published/?$ live_published.php [L]
RewriteRule ^published/page/([^/]+)/?$ live_published.php?page=$1 [L]
RewriteRule ^unpublished/?$ live_unpublished.php [L]
RewriteRule ^unpublished/page/([^/]+)/?$ live_unpublished.php?page=$1 [L]

## Modules
RewriteRule ^inbox/?$ module.php?module=simple_messaging&view=inbox [L]
RewriteRule ^sitemapindex.xml module.php?module=xml_sitemaps_show_sitemap [L]
RewriteRule ^sitemap-([a-zA-Z0-9]+).xml module.php?module=xml_sitemaps_show_sitemap&i=$1 [L]
RewriteRule ^status/([0-9]+)/?$ modules/status/status.php?id=$1 [L]
RewriteRule ^toolbar/(\d+)/?$ modules/pligg_web_toolbar/toolbar.php?id=$1
RewriteRule ^sitemapindex.xml module.php?module=xml_sitemaps_show_sitemap [L]
RewriteRule ^sitemap-([0-9a-z]+).xml module.php?module=xml_sitemaps_show_sitemap&i=$1 [L]

## Pages
RewriteRule ^about/?$ page.php?page=about [L]
RewriteRule ^static/([^/]+)/?$ page.php?page=$1 [L]

## Pagination
RewriteRule ^category/([^/]+)/page/([^/]+)/?$ index.php?category=$1&page=$2 [L]
RewriteRule ^page/([^/]+)/?$ index.php?page=$1 [L]
RewriteRule ^page/([^/]+)/([^/]+)category/([^/]+)/?$ index.php?page=$1&part=$2&category=$3 [L]
RewriteRule ^published/page/([^/]+)/?$ index.php?page=$1 [L]
RewriteRule ^published/page/([^/]+)/category/([^/]+)/?$ index.php?page=$1&category=$2 [L]
RewriteRule ^published/page/([^/]+)/([^/]+)category/([^/]+)/?$ index.php?page=$1&part=$2&category=$3 [L]
RewriteRule ^published/page/([^/]+)/([^/]+)/?$ index.php?page=$1&part=$2 [L]
RewriteRule ^published/page/([^/]+)/range/([^/]+)/?$ ?page=$1&range=$2 [L]
RewriteRule ^search/page/([^/]+)/([^/]+)/?$ search.php?page=$1&search=$2 [QSA,NC,L]
RewriteRule ^topusers/page/([^/]+)/?$ topusers.php?page=$1 [L]
RewriteRule ^topusers/page/([^/]+)/sortby/([^/]+)?$ topusers.php?page=$1&sortby=$2 [L]
RewriteRule ^user/page/([^/]+)/([^/]+)/([^/]+)/?$ user.php?page=$1&view=$2&login=$3 [L]
RewriteRule ^user/([^/]+)/([^/]+)/page/(\d+)/?$ user.php?page=$3&view=$1&login=$2 [L]

## Sort
RewriteRule ^(year|month|week|today|yesterday|recent|alltime)/?$ index.php?part=$1 [L]
RewriteRule ^(year|month|week|today|yesterday|recent|alltime)/category/([^/]+)/?$ index.php?part=$1&category=$2 [L]
RewriteRule ^(year|month|week|today|yesterday|recent|alltime)/page/(\d+)/?$ index.php?part=$1&page=$2 [L]
RewriteRule ^(year|month|week|today|yesterday|recent|alltime)/category/([^/]+)/page/(\d+)/?$ index.php?part=$1&category=$2&page=$3 [L]

## RSS
RewriteRule ^([^/]+)/rss/?$ storyrss.php?title=$1 [L]
RewriteRule ^rss/?$ rss.php [L]
RewriteRule ^rss/([a-zA-Z0-9-]+)/?$ rss.php?status=$1 [L]
RewriteRule ^rss/category/([^/]+)/?$ rss.php?category=$1 [L]
RewriteRule ^rss/category/upcoming/([^/]+)/?$ rss.php?status=queued&category=$1 [L]
RewriteRule ^rss/category/published/([^/]+)/?$ rss.php?status=published&category=$1 [L]
RewriteRule ^rss/category/([^/]+)/queued/?$ rss.php?status=queued&category=$1 [L]
RewriteRule ^rss/category/([^/]+)/published/?$ rss.php?status=published&category=$1 [L]
RewriteRule ^rss/category/([^/]+)/group/([^/]+)/?$ rss.php?category=$1&group=$2 [L]
RewriteRule ^rss/category/upcoming/([^/]+)/([^/]+)/?$ rss.php?status=queued&category=$1&group=$2 [L]
RewriteRule ^rss/category/published/([^/]+)/([^/]+)/?$ rss.php?status=published&category=$1&group=$2 [L]
RewriteRule ^rss/search/([^/]+)/?$ rss.php?search=$1 [L]
RewriteRule ^rss/user/([^/]+)/?$ userrss.php?user=$1 [L]
RewriteRule ^rss/user/([^/]+)/([a-zA-Z0-9-]+)/?$ userrss.php?user=$1&status=$2 [L]
RewriteRule ^rssfeeds/?$ rssfeeds.php [L]

RewriteRule ^upcoming/([^/]+)/?$ upcoming.php?category=$1 [L]
RewriteRule ^upcoming/([^/]+)/page/(\d+)/?$ upcoming.php?category=$1&page=$2 [L]
RewriteRule ^upcoming/(year|month|week|today|yesterday|recent|alltime)/([^/]+)/?$ upcoming.php?part=$1&category=$2 [L]
RewriteRule ^upcoming/(year|month|week|today|yesterday|recent|alltime)/([^/]+)/page/(\d+)/?$ upcoming.php?part=$1&category=$2&page=$3 [L]
RewriteRule ^published/page/([^/]+)/([^/]+)/?$ index.php?page=$1&category=$2 [L]
RewriteRule ^published/page/([^/]+)/([^/]+)/([^/]+)/?$ index.php?page=$1&part=$2&category=$3 [L]
RewriteRule ^(year|month|week|today|yesterday|recent|alltime)/([^/]+)/?$ index.php?part=$1&category=$2 [L]
RewriteRule ^(year|month|week|today|yesterday|recent|alltime)/([^/]+)/page/(\d+)/?$ index.php?part=$1&category=$2&page=$3 [L]

## 9.9.5 compatibility
RewriteRule ^user/view/([a-zA-Z0-9-]+)/?$ user.php?view=$1 [L]
RewriteRule ^user/view/([a-zA-Z0-9+]+)/([a-zA-Z0-9+]+)/?$ user.php?view=$1&login=$2 [L]
RewriteRule ^user/view/([a-zA-Z0-9+]+)/login/([a-zA-Z0-9+]+)/?$ user.php?view=$1&login=$2 [L]
RewriteRule ^published/([a-zA-Z0-9-]+)/?$ index.php?part=$1
RewriteRule ^published/([a-zA-Z0-9-]+)/category/([^/]+)/?$ index.php?part=$1&category=$2
RewriteRule ^about/([a-zA-Z0-9-]+)/?$ page.php?page=about [L]
RewriteRule ^upcoming/page/([^/]+)/category/([^/]+)/?$ upcoming.php?page=$1&category=$2 [L]
RewriteRule ^upcoming/page/([^/]+)/upcoming=([^/]+)category/([^/]+)/?$ upcoming.php?page=$1&part=upcoming&order=$2&category=$3 [L]
RewriteRule ^statistics/page/([^/]+)/?$ module.php?module=pagestatistics&page=$1


RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^([^/]+)/?$ index.php?category=$1 [L]
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^([^/]+)/page/([^/]+)/?$ index.php?category=$1&page=$2 [L]
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^([^/]+)/([^/]+)/?$ story.php?title=$2 [L]
##### URL Method 2 End #####

## Disable directory browsing
Options All -Indexes

## Gzip Begin ##
## To enable Gzip and decrease the load times of your Pligg site
## change /home/path/to to your absolute server path and remove the # from the lines below
# php_value auto_prepend_file /home/path/to/begin_gzip.php
# php_value auto_append_file /home/path/to/end_gzip.php
# AddType "text/javascript" .gz
# AddEncoding gzip .gz
# RewriteCond %{HTTP:Accept-encoding} gzip
# RewriteCond %{THE_REQUEST} ^(.*).js
# RewriteCond %{SCRIPT_FILENAME}.gz -f
# RewriteRule ^(.*)\.js $1.js.gz [L]
## Gzip End ##

## Block out any script trying to set a mosConfig value through the URL
RewriteCond %{QUERY_STRING} mosConfig_[a-zA-Z_]{1,21}(=|\%3D) [OR]
## Block out any script trying to base64_encode stuff to send via URL
RewriteCond %{QUERY_STRING} base64_encode.*\(.*\) [OR]
## Block out any script that includes a  tag in URL
RewriteCond %{QUERY_STRING} (\<|%3C).*script.*(\>|%3E) [NC,OR]
## Block out any script trying to set a PHP GLOBALS variable via URL
RewriteCond %{QUERY_STRING} GLOBALS(=|\[|\%[0-9A-Z]{0,2}) [OR]
## Block out any script trying to modify a _REQUEST variable via URL
RewriteCond %{QUERY_STRING} _REQUEST(=|\[|\%[0-9A-Z]{0,2})

## Block pycurl bot
RewriteEngine on
RewriteCond %{HTTP_USER_AGENT} ^pycurl/ [NC]
RewriteRule .* - [F]

</pre>


<h4> NEW Pligg rules for Nginx</h4>
<pre lang="text">
# convetefd from default pligg rules to nginx

## 404 Error Page
## If Pligg is installed in a subfolder, change the below line to ErrorDocument 404 /name-of-subfolder/404error.php
#ErrorDocument 404 /404error.php
error_page 404 502 = /404error.php;





if (!-e $request_filename){
	## Re-directing Begin
	## You can find the below lines pre-made for you in the category management section of the admin panel ##
	rewrite ^(all)/([^/]+)/?$ story.php?title=$2 last;
	rewrite ^(all)/?$ ?category=$1 last;
	##

	## The settings that you should configure are all above this line.
	## Continue below only if you are an advanced user.

	##### URL Method 2 Begin #####
	rewrite ^/?$ /index.php last;
	rewrite ^/advanced-search/?$ /advancedsearch.php last;
	rewrite ^/cache/([0-9]+)/?$ /index.php last;
	rewrite ^/cache/admin_c([0-9]+)/?$ /index.php last;
	rewrite ^/cache/templates_c/([0-9]+)/?$ /index.php last;
	rewrite ^/category/([^/]+)/?$ /index.php?category=$1 last;
	rewrite ^/category/([^/]+)/([^/]+)/?$ /story.php?title=$2 last;
	rewrite ^/live/?$ /live.php last;
	rewrite ^/login/?$ /login.php last;
	rewrite ^/login/([a-zA-Z0-9-]+)/?$ /login.php?return=$1 last;
	rewrite ^/login/([a-zA-Z0-9-]+)/([a-zA-Z0-9-]+)/?$ /login.php?return=$1/$2 last;
	rewrite ^/logout/?$ /login.php?op=logout&return=index.php last;
	rewrite ^/logout/([a-zA-Z0-9-]+)/([a-zA-Z0-9-]+)/?$ /login.php?op=logout&return=$1/$2 last;
	rewrite ^/out/([\d]+)/?$ /out.php?id=$1 last;
	rewrite ^/out/(https?:.+)$ /out.php?url=$1 last;
	rewrite ^/out/([^/]+)/?$ /out.php?title=$1 last;
	rewrite ^/profile/? /profile.php last;
	rewrite ^/recommend/([a-zA-Z0-9-]+)/?$ /recommend.php?id=$1 last;
	rewrite ^/register/? /register.php last;
	rewrite ^/search/([^/]+)/page/(\d+)/?$ /search.php?search=$1&page=$2 last;
	rewrite ^/search/(.+)/?$ /search.php?search=$1 last;
	rewrite ^/searchurl/(.+)/?$ /search.php?url=$1 last;
	rewrite ^/settemplate/? /settemplate.php last;
	rewrite ^/story/([0-9]+)/?$ /story.php?id=$1 last;
	rewrite ^/story/([^/]+)/?$ /story.php?title=$1 last;
	rewrite ^/story/([0-9]+)/editcomment/([0-9]+)/?$ /edit.php?id=$1&commentid=$2 last;
	rewrite ^/story/([0-9]+)/edit/?$ /editlink.php?id=$1 last;
	rewrite ^/submit/? /submit.php last;
	rewrite ^/tag/(.+)/(.+)/?$ /search.php?search=$1&tag=true&from=$2 last;
	rewrite ^/tag/(.+)/?$ /search.php?search=$1&tag=true last;
	rewrite ^/tagcloud/? /cloud.php last;
	rewrite ^/tagcloud/range/([0-9]+)/?$ /cloud.php?range=$1 last;
	rewrite ^/topusers/? /topusers.php last;
	rewrite ^/trackback/([0-9]+)/?$ /trackback.php?id=$1  last;
	rewrite ^/upcoming/? /upcoming.php last;
	rewrite ^/upcoming/category/([^/]+)/?$ /upcoming.php?category=$1 last;
	rewrite ^/upcoming/category/([^/]+)/page/(\d+)/?$ /upcoming.php?category=$1&page=$2 last;
	rewrite ^/upcoming/(year|month|week|today|yesterday|recent|alltime)/?$ /upcoming.php?part=$1 last;
	rewrite ^/upcoming/(year|month|week|today|yesterday|recent|alltime)/category/([^/]+)/?$ /upcoming.php?part=$1&category=$2 last;
	rewrite ^/upcoming/page/([0-9]+)/?$ /upcoming.php?page=$1 last;
	rewrite ^/upcoming/(year|month|week|today|yesterday|recent|alltime)/page/(\d+)/?$ /upcoming.php?part=$1&page=$2 last;
	rewrite ^/upcoming/(year|month|week|today|yesterday|recent|alltime)/category/([^/]+)/page/(\d+)/?$ /upcoming.php?part=$1&category=$2&page=$3 last;
	rewrite ^/user/? /user.php last;
	rewrite ^/user/search/([^/]+)/?$ /user.php?view=search&keyword=$1 last;
	rewrite ^/user/([^/]+)/?$ /user.php?view=$1 last;
	rewrite ^/user/([^/]+)/([^/]+)/?$ /user.php?view=$1&login=$2 last;
	rewrite ^/user/([^/]+)/link/([0-9+]+)/?$ /user_add_remove_links.php?action=$1&link=$2 last;

	## Admin
	rewrite ^/admin/?$ /admin/admin_index.php last;
	rewrite ^/admin_comments/page/([^/]+)/?$ /admin/admin_comments.php?page=$1 last;
	rewrite ^/admin_links/page/([^/]+)/?$ /admin/admin_links.php?page=$1 last;
	rewrite ^/admin_users/page/([^/]+)/?$ /admin/admin_users.php?page=$1 last;
	rewrite ^/story/([0-9]+)/modify/([a-z]+)/?$ /admin/linkadmin.php?id=$1&action=$2 last;
	rewrite ^/view/([^/]+)/?$ /admin/admin_users.php?mode=view&user=$1 last;

	## Groups
	rewrite ^/groups/?$ /groups.php last;
	rewrite ^/groups/submit/?$ /submit_groups.php last;
	rewrite ^/groups/(members|name|oldest|newest)/?$ /groups.php?sortby=$1 last;
	rewrite ^/groups/([^/]+)/?$ /group_story.php?title=$1 last;
	rewrite ^/groups/([^/]+)/page/([0-9]+)?$ /group_story.php?title=$1&page=$2 last;
	rewrite ^/groups/([^/]+)/?$ /group_story.php?title=$1&view=published last;
	rewrite ^/groups/([^/]+)/(published|upcoming|shared|members)/?$ /group_story.php?title=$1&view=$2 last;
	rewrite ^/groups/([^/]+)/(published|upcoming|shared|members)/page/([0-9]+)?$ /group_story.php?title=$1&view=$2&page=$3 last;
	rewrite ^/groups/([^/]+)/(published|upcoming|shared|members)/category/([^/]+)/?$ /group_story.php?title=$1&view=$2&category=$3 last;
	rewrite ^/groups/([^/]+)/(published|upcoming|shared|members)/category/([^/]+)/page/([0-9]+)?$ /group_story.php?title=$1&view=$2&category=$3&page=$4 last;
	rewrite ^/groups/delete/([0-9]+)/?$ /deletegroup.php?id=$1 last;
	rewrite ^/groups/edit/([0-9]+)/?$ /editgroup.php?id=$1 last;
	rewrite ^/groups/id/([0-9]+)/?$ /group_story.php?id=$1 last;
	rewrite ^/groups/join/([0-9]+)/? /join_group.php?id=$1&join=true last;
	rewrite ^/groups/member/admin/id/([0-9]+)/role/([a-zA-Z0-9_-]+)/userid/([0-9]+)/?$ /groupadmin.php?id=$1&role=admin&userid=$3 last;
	rewrite ^/groups/member/normal/id/([0-9]+)/role/([a-zA-Z0-9_-]+)/userid/([0-9]+)/?$ /groupadmin.php?id=$1&role=normal&userid=$3 last;
	rewrite ^/groups/member/moderator/([0-9]+)/role/([a-zA-Z0-9_-]+)/userid/([0-9]+)/?$ /groupadmin.php?id=$1&role=$2&userid=$3 last;
	rewrite ^/groups/member/flagged/([0-9]+)/role/([a-zA-Z0-9_-]+)/userid/([0-9]+)/?$ /groupadmin.php?id=$1&role=flagged&userid=$3 last;
	rewrite ^/groups/member/banned/id/([0-9]+)/role/([a-zA-Z0-9_-]+)/userid/([0-9]+)/?$ /groupadmin.php?id=$1&role=banned&userid=$3 last;
	rewrite ^/groups/page/([0-9]+)/?$ /groups.php?page=$1 last;
	rewrite ^/groups/unjoin/([0-9]+)/? /join_group.php?id=$1&join=false last;
	rewrite ^/groups/withdraw/([0-9]+)/user_id/([0-9]+)/?$ /join_group.php?group_id=$1&user_id=$2&activate=withdraw last;
	rewrite ^/join_group/action/(published|queued|discard)/link/(\d+)/?$ /join_group.php?action=$1&link=$2 last;
	 
	## Live
	rewrite ^/comments/? /live_comments.php last;
	rewrite ^/comments/page/([^/]+)/?$ /live_comments.php?page=$1 last;
	rewrite ^/live_published/? /live_published.php last;
	rewrite ^/published/page/([^/]+)/?$ /live_published.php?page=$1 last;
	rewrite ^/unpublished/? /live_unpublished.php last;
	rewrite ^/unpublished/page/([^/]+)/?$ /live_unpublished.php?page=$1 last;

	## Modules
	rewrite ^/inbox/?$ /module.php?module=simple_messaging&view=inbox last;
	rewrite ^/sitemapindex.xml module.php?module=xml_sitemaps_show_sitemap last;
	rewrite ^/sitemap-([a-zA-Z0-9]+).xml module.php?module=xml_sitemaps_show_sitemap&i=$1 last;
	rewrite ^/status/([0-9]+)/?$ /modules/status/status.php?id=$1 last;
	rewrite ^/toolbar/(\d+)/?$ modules/pligg_web_toolbar/toolbar.php?id=$1;
	rewrite ^/sitemapindex.xml module.php?module=xml_sitemaps_show_sitemap last;
	rewrite ^/sitemap-([0-9a-z]+).xml module.php?module=xml_sitemaps_show_sitemap&i=$1 last;

	## Pages
	rewrite ^/about/?$ /page.php?page=about last;
	rewrite ^/static/([^/]+)/?$ /page.php?page=$1 last;

	## Pagination
	rewrite ^/category/([^/]+)/page/([^/]+)/?$ /index.php?category=$1&page=$2 last;
	rewrite ^/page/([^/]+)/?$ /index.php?page=$1 last;
	rewrite ^/page/([^/]+)/([^/]+)category/([^/]+)/?$ /index.php?page=$1&part=$2&category=$3 last;
	rewrite ^/published/page/([^/]+)/?$ /index.php?page=$1 last;
	rewrite ^/published/page/([^/]+)/category/([^/]+)/?$ /index.php?page=$1&category=$2 last;
	rewrite ^/published/page/([^/]+)/([^/]+)category/([^/]+)/?$ /index.php?page=$1&part=$2&category=$3 last;
	rewrite ^/published/page/([^/]+)/([^/]+)/?$ /index.php?page=$1&part=$2 last;
	rewrite ^/published/page/([^/]+)/range/([^/]+)/?$ ?page=$1&range=$2 last;
	rewrite ^/search/page/([^/]+)/([^/]+)/?$ /search.php?page=$1&search=$2 last;
	rewrite ^/topusers/page/([^/]+)/?$ /topusers.php?page=$1 last;
	rewrite ^/topusers/page/([^/]+)/sortby/([^/]+)?$ /topusers.php?page=$1&sortby=$2 last;
	rewrite ^/user/page/([^/]+)/([^/]+)/([^/]+)/?$ /user.php?page=$1&view=$2&login=$3 last;
	rewrite ^/user/([^/]+)/([^/]+)/page/(\d+)/?$ /user.php?page=$3&view=$1&login=$2 last;

	## Sort
	rewrite ^/(year|month|week|today|yesterday|recent|alltime)/?$ /index.php?part=$1 last;
	rewrite ^/(year|month|week|today|yesterday|recent|alltime)/category/([^/]+)/?$ /index.php?part=$1&category=$2 last;
	rewrite ^/(year|month|week|today|yesterday|recent|alltime)/page/(\d+)/?$ /index.php?part=$1&page=$2 last;
	rewrite ^/(year|month|week|today|yesterday|recent|alltime)/category/([^/]+)/page/(\d+)/?$ /index.php?part=$1&category=$2&page=$3 last;

	## RSS
	rewrite ^/([^/]+)/rss/?$ /storyrss.php?title=$1 last;
	rewrite ^/rss/? /rss.php last;
	rewrite ^/rss/([a-zA-Z0-9-]+)/?$ /rss.php?status=$1 last;
	rewrite ^/rss/category/([^/]+)/?$ /rss.php?category=$1 last;
	rewrite ^/rss/category/upcoming/([^/]+)/?$ /rss.php?status=queued&category=$1 last;
	rewrite ^/rss/category/published/([^/]+)/?$ /rss.php?status=published&category=$1 last;
	rewrite ^/rss/category/([^/]+)/queued/?$ /rss.php?status=queued&category=$1 last;
	rewrite ^/rss/category/([^/]+)/published/?$ /rss.php?status=published&category=$1 last;
	rewrite ^/rss/category/([^/]+)/group/([^/]+)/?$ /rss.php?category=$1&group=$2 last;
	rewrite ^/rss/category/upcoming/([^/]+)/([^/]+)/?$ /rss.php?status=queued&category=$1&group=$2 last;
	rewrite ^/rss/category/published/([^/]+)/([^/]+)/?$ /rss.php?status=published&category=$1&group=$2 last;
	rewrite ^/rss/search/([^/]+)/?$ /rss.php?search=$1 last;
	rewrite ^/rss/user/([^/]+)/?$ /userrss.php?user=$1 last;
	rewrite ^/rss/user/([^/]+)/([a-zA-Z0-9-]+)/?$ /userrss.php?user=$1&status=$2 last;
	rewrite ^/rssfeeds/? /rssfeeds.php last;

	rewrite ^/upcoming/([^/]+)/?$ /upcoming.php?category=$1 last;
	rewrite ^/upcoming/([^/]+)/page/(\d+)/?$ /upcoming.php?category=$1&page=$2 last;
	rewrite ^/upcoming/(year|month|week|today|yesterday|recent|alltime)/([^/]+)/?$ /upcoming.php?part=$1&category=$2 last;
	rewrite ^/upcoming/(year|month|week|today|yesterday|recent|alltime)/([^/]+)/page/(\d+)/?$ /upcoming.php?part=$1&category=$2&page=$3 last;
	rewrite ^/published/page/([^/]+)/([^/]+)/?$ /index.php?page=$1&category=$2 last;
	rewrite ^/published/page/([^/]+)/([^/]+)/([^/]+)/?$ /index.php?page=$1&part=$2&category=$3 last;
	rewrite ^/(year|month|week|today|yesterday|recent|alltime)/([^/]+)/?$ /index.php?part=$1&category=$2 last;
	rewrite ^/(year|month|week|today|yesterday|recent|alltime)/([^/]+)/page/(\d+)/?$ /index.php?part=$1&category=$2&page=$3 last;

	## 9.9.5 compatibility
	rewrite ^/user/view/([a-zA-Z0-9-]+)/?$ /user.php?view=$1 last;
	rewrite ^/user/view/([a-zA-Z0-9+]+)/([a-zA-Z0-9+]+)/?$ /user.php?view=$1&login=$2 last;
	rewrite ^/user/view/([a-zA-Z0-9+]+)/login/([a-zA-Z0-9+]+)/?$ /user.php?view=$1&login=$2 last;
	rewrite ^/published/([a-zA-Z0-9-]+)/?$ index.php?part=$1;
	rewrite ^/published/([a-zA-Z0-9-]+)/category/([^/]+)/?$ index.php?part=$1&category=$2;
	rewrite ^/about/([a-zA-Z0-9-]+)/?$ /page.php?page=about last;
	rewrite ^/upcoming/page/([^/]+)/category/([^/]+)/?$ /upcoming.php?page=$1&category=$2 last;
	rewrite ^/upcoming/page/([^/]+)/upcoming=([^/]+)category/([^/]+)/?$ /upcoming.php?page=$1&part=upcoming&order=$2&category=$3 last;
	rewrite ^/statistics/page/([^/]+)/?$ module.php?module=pagestatistics&page=$1;


	##### URL Method 2 End #####

}

if (!-e $request_filename){
	rewrite ^/([^/]+)/?$ /index.php?category=$1 last;
}
if (!-e $request_filename){
	rewrite ^/([^/]+)/page/([^/]+)/?$ /index.php?category=$1&page=$2 last;
}
if (!-e $request_filename){
	rewrite ^/([^/]+)/([^/]+)/?$ /story.php?title=$2 last;
}

## Gzip Begin ##
## To enable Gzip and decrease the load times of your Pligg site
## change /home/path/to to your absolute server path and remove the # from the lines below
# php_value auto_prepend_file /home/path/to/begin_gzip.php
# php_value auto_append_file /home/path/to/end_gzip.php
# AddType "text/javascript" .gz
# AddEncoding gzip .gz
# RewriteCond %{HTTP:Accept-encoding} gzip
# RewriteCond %{THE_REQUEST} ^(.*).js
# RewriteCond %{SCRIPT_FILENAME}.gz -f
# rewrite ^(.*)\.js $1.js.gz last;
## Gzip End ##


if ($query_string ~* 'mosConfig_[a-zA-Z_]{1,21}(=|\%3D)' ){
 return 405;
}
if ($query_string ~* base64_encode.*\(.*\) ){
 return 405;
}
if ($query_string ~* (\<|%3C).*script.*(\>|%3E) ){
 return 405;
}
if ($query_string ~* 'GLOBALS(=|\[|\%[0-9A-Z]{0,2})' ){
 return 405;
}
if ($query_string ~* '_REQUEST(=|\[|\%[0-9A-Z]{0,2})' ){
 return 405;
}
## Block out any script trying to set a mosConfig value through the URL
## RewriteCond %{QUERY_STRING} mosConfig_[a-zA-Z_]{1,21}(=|\%3D) [OR]
## Block out any script trying to base64_encode stuff to send via URL
## RewriteCond %{QUERY_STRING} base64_encode.*\(.*\) [OR]
## Block out any script that includes a <script> tag in URL
## RewriteCond %{QUERY_STRING} (\<|%3C).*script.*(\>|%3E) [NC,OR]
## Block out any script trying to set a PHP GLOBALS variable via URL
## RewriteCond %{QUERY_STRING} GLOBALS(=|\[|\%[0-9A-Z]{0,2}) [OR]
## Block out any script trying to modify a _REQUEST variable via URL
## RewriteCond %{QUERY_STRING} _REQUEST(=|\[|\%[0-9A-Z]{0,2})

## Block pycurl bot by returnhing a forbidden
if ($http_user_agent ~* ^pycurl/){
	return 405;
} 


</pre>
So most of the major functionality seems to work, but my Pligg install is used enough to verify that it is 100%

</div></x-turndown>
