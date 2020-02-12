---
title: 'Plugins for a Full Featured Wordpress Content Manager'
date: Tue, 04 May 2010 14:06:05 +0000
draft: false
tags: [bookmarks, cms, MIsc.Tips, plugins, Reviews, sharing, twitter, web development, wordpress]
---

More and more **clients are asking for dynamic sites that allow them to edit specials and pages at will**. This is great because it surely means they will come back for more questions and changes as they use the site. (read : more income). What they want are CMS, or content management systems. **What I give them is usually wordpress loaded with useful plugins**. (If custom business logic is needed i turn to CakePHP). ANd why not? The Wordpress engine provides post and page management, RSS feeds and discussion features, and customizable "widgets." But a few key features are needed to make the leap to a decent CMS. **Read This** (**Update**: **FInally a CMS that clients can use! - found [concrete5 CMS](http://www.concrete5.org/ "concrete5 - FInally a CMS that clients can use!") very recently, and first impression is wow!- trust me its worth a demo** ) Besides, no matter how many times I explain creating a new page in drupal, or how to add a side box in joomla. There is just too many steps and switches for the average small business owner. (is that a huge stereotype? yes, I apologize..) **But honestly, most non-technical users don't think in terms of elements like footer, and side bars, and such. they think of pages! (and conrete5 does that in a spectaciular manner)** ..but if you don't want to give that a shot first, read on. The plugins handle 4 critical areas for any decent site:

*   **Page and Menu Management**
*   **SEO and Meta data**
*   **Sitemaps**
*   **Web 2.0 / Bookmarking / Sharing**

**SO what plugins come standard on a Edward A Webb hosted Wordpress install**? [Read more](/web-development/7-plugins-full-featured-wordpress-content-manager#more-738) to bathe in the glory of these awesome plugins.

Page Management
---------------

Wordpress has great page management, but the connection to Menus is lacking.  Clients need to hide  and reorder pages constantly, and explaining the "weighted order" field is not worth the effort.

1.  [PageMash](http://wordpress.org/extend/plugins/pagemash/ "PageMash - Ajax page sorting plugin for Wordpress")
    
    > Customise the order your pages are listed in and manage the parent structure with this simple ajax drag-and-drop administrative interface with an option to toggle the page to be hidden from output. Great tool to quickly re-arrange your page menus.
    

SEO Enhancement
---------------

Yes I can use buzz words. But SEO is legitimately important when administering a site for any business.  So to maximize client click-throughs and search ranking I use a few plugins to add clean urls and descriptive tags to everything!

1.  [All in One SEO Pack](http://wordpress.org/extend/plugins/all-in-one-seo-pack/ "All in One SEO Pack - get your meta tags in line!")
    
    > *   Support for CMS-style WordPress installations
    > *   Automatically optimizes your **titles** for search engines
    > *   Generates **META tags automatically**
    > *   Avoids the typical duplicate content found on Wordpress blogs
    > *   For beginners, you don't even have to look at the options, it works out-of-the-box. Just install.
    
2.  [SEO Friendly Images](http://wordpress.org/extend/plugins/seo-image/ "SEO Friendly Images - add title attributes to all images")
    
    > SEO Friendly Images is a Wordpress optimization plugin which automatically updates all images with proper ALT and TITLE attributes. If your images do not have ALT and TITLE already set, SEO Friendly Images will add them according the options you set. Additionally this makes the post W3C/xHTML valid as well.
    
3.  [SEO Slugs](http://wordpress.org/extend/plugins/seo-slugs/ "SEO Slugs - removes words liek at or the from urls")
    
    > The SEO Slugs Wordpress plugin removes common words like 'a', 'the', 'in' from post slugs to improve search engine optimization.
    

Sitemaps
--------

Technically a perk for SEO, but the plugin I use exposes a nice user readable sitemap as well.

1.  [Google XML Sitemaps](http://wordpress.org/extend/plugins/google-sitemap-generator/ "Google XML Sitemaps - generates xml sitemaps for google, yahoo, bing and your readers!")
    
    > This plugin will generate a special XML sitemap which will help search engines like Google, Bing, Yahoo and Ask.com to better index your blog. With such a sitemap, it's much easier for the crawlers to see the complete structure of your site and retrieve it more efficiently.
    

Social Media / Bookmarking
--------------------------

If you have a group of dedicated followers - they can be your biggest tool for grabbing more readers. But you have to make their job easy!  That's why **I recommend a simple sharing plugin for any wordpress site**.

1.  [SexyBookmarks](http://wordpress.org/extend/plugins/sexybookmarks/ "SexyBookmarks - Sharing is sexy .. and easy!")
    
    > Though the name may be a little "edgy" for some, SexyBookmarks has proven time and time again to be an extremely useful and successful tool in getting your readers to actually **submit your articles** to numerous social bookmarking sites.
    
2.  [WP to Twitter](http://wordpress.org/extend/plugins/wp-to-twitter/ "WP to Twitter - automatically shorten and post your titles to Twitter")
    
    > The WP-to-Twitter plugin posts a Twitter status update from your WordPress blog using either the Cli.gs or Bit.ly URL shortening services to provide a link back to your post from Twitter. _You can also use Wordpress' built in ?p=529 for short urls._
    

That's it! Just install those 7 plugins and you'll be running the next Tumblr.. I swear. Ok well that might be an overstatement, or understatement.. but it's a good goal to shoot for.

Feedback
--------

How about you? Am I missing any great ones, have you found ones that work better than my listed choices? Please share!

Script It?
----------

You didn't honestly expect me to expect you to download 7 or ore zip files and upload them to a wp install did you? Hell no, I won't even make you curl them individually from your server, just add the scripts you want to the plugins array and run the bash script below against your wp install!

$ sh wp_plugins.sh path/to/wp/root

#! /bin/bash

# upload plugins to wordpress site
# edward a webb - May 7, 2010
#  https://blog.edwardawebb.com/web-development/7-plugins-full-featured-wordpress-content-manager

plugins=( all-in-one-seo-pack google-sitemap-generator.3.2.3 pagemash )


if [ $# -eq 1 ]
then
	wproot=$1
else
	echo "Usage: $0 path/to/wp/root"
	exit 1
fi

if [ -d $wproot ]
then

	for (( i = 0 ; i < ${#plugins[@]} ; i++ ))
	do
		curl http://downloads.wordpress.org/plugin/${plugins[$i]}.zip -o ${plugins[$i]}.zip
		unzip ${plugins[$i]}.zip -d $wproot/wp-content/plugins/
		rm -f ${plugins[$i]}.zip


	done  
else
	printf "\t Could not locate $wproot\n"
	exit 2

fi
