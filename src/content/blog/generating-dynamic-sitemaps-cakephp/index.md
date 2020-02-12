---
title: 'Generating dynamic sitemaps with CakePHP 1.2'
date: Sun, 20 Jul 2008 19:48:25 +0000
draft: false
tags: [CakePHP, CakePHP, router, seo, sitemap, xml]
---

Sitemaps are although not critical, have been accepted as a standard way to let engines and users find the content on your site. **You can generate those sitemaps on the fly in Cake**, and show xml to engines, and formatted text to users. Sitemaps that are generated dynamically are always up to date, which is critical in achieving those top search results. How you may ask? Read on and I shall tell you. You need to decide what content goes in the sitemap. Most would agree that things like pages, posts are good choices. Others way want to add user profiles or other various model records. In this example I care about two models Info, which are like my static pages, and Post which are user posts.

#### Create the controller ( _/app/controllers/sitemaps_controller.php_)

Post->recursive=-1;
		$this->Info->recursive=-1;
		$this->set('posts', $this->Post->find('all', array( 'conditions' => array('is_published'=>1,'is_public'=>'1'), 'fields' => array('date_modified','id'))));
		$this->set('pages', $this->Info->find('all', array( 'conditions' => array('ispublished' => 1 ), 'fields' => array('date_modified','id','url'))));
	}
}
?>

Now rather then building our xml in the standard layout, well need a nice clean xml doctype layout instead.

#### Create the xml layout (/app/views/layouts/xml/default.ctp)

Now that we have a nice clean xml layout, we can populate it using a cool sitemap view.

#### Create the sitemap view (/app/views/sitemaps/xml/index.ctp)

 daily
		1.0 
		
	
	 toAtom($post['Info']['date_modified']); ?>
		0.8 
	
		
	
	 'posts','action'=>'view','id'=>$post['Post']['id']),true); ?>
		toAtom($post['Post']['date_modified']); ?>
		0.8 

You'll notice the use of the Router class to give up the proper fully expanded domain. You can see my two model names 'Info' and 'Post' that were set in the controller. Almost DOne! We need to let Cake parse extensions like xml, and instead use them as part of our directory structure (hence both views belong to xml folders above) this turns urls like _/sitemaps/index.xml_ into _/views/sitemaps/xml/index.ctp_ and uses the appropriate layout based on extension as well, pretty cool huh? (You'll notice I also parse rss extension for my news feed, but thats another post.)

#### In _/app/config/routes.php_ add;

Router::parseExtensions('rss','xml');

Your done, now if you want to class it up, add a better route than /sitemaps/index.xml

#### again, in _/app/config/routes.php_ add;

Router::connect('/sitemap', array('controller' =>; 'sitemaps', 'action' =>; 'index'));

**Now http://example.org/sitemap.xml will dynamically create the most up to date sitemap possible!** Go ahead and submit it to google. All done, enjoy. Wait, didn't he promise a sitemap users could see too? Your right, I did. create a view /app/views/sitemaps/index.ctp (notice no xml folder here)

### Site Pages

	
			>
				

#### 
					link($post['title'],'/posts/view/'.$post['id'],array('title'=>'Read more about '.$post['title']));
					?>
				

				regularize($post['modified']);?>
				

* * * 

**Note, the regular index can be helpful for debugging as well. Now hitting the url http://example.org/sitemap (no xml) will load whatever user friendly code you put into the file above. I only included the posts, to demonstrate use, The actual layout is up to you :)

#### Summary

My goal was to provide a instance that took advantage of Cake's Router class and eliminated the need to statically code any urls. Perks;

*   Works to serve multiple domain sites.Ex. if your site is hosted on example.com, and example.org, both sitemaps will have the proper urls even though they are physically the same code.
*   Can be reused across applications
If you serve multiple applications, the code can be used as part of the core shared by all those apps.*   Never needs to be updated!
