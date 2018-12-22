---
title: 'Add an RSS Feed to your CakePHP Models'
date: Wed, 28 Jan 2009 00:27:10 +0000
draft: false
tags: [CakePHP, CakePHP, feed, rss]
---

I recently developed a prototype for a client who insisted that the site **include an RSS feed for the articles of the site**. Not being one to turn down a challenge, and being aware of the Power of Cake, I assured them it could be completed with such a feature. The newsfeed would provide the latest articles to be consumed by an aggregation software or other feed reader. So in the text that follows I'll outline what is involved to **add news feed or rss feeds to a particular model of your CakePHP site.**

The Problem
-----------

News feeds are everywhere and essential in todays web development.  Your sites are just as good as anyone elses, and deserve this critical feature.

The Solution
------------

**Implement a url that can be consumed by web browsers or feed readers to publicize your latest content to the world.**

Implementing a Feed Generator in CakePHP
----------------------------------------

If we think about this rationally there are 3 peices;

*   A controller action to retrieve the latest articles
*   A view to generate the xml formatted excerpts
*   A routing piece to provide an acceptable url

### The RSS Feed Action

No need to over complicate things here. Imagine you have a standard Model, oh let's say 'Posts'.  All we need to do here is add a newsfeed action. By default the action will pull 5 posts within the last month, but the number can be overridden by passing a different number in the url (as with any action parameter).

#### app/controllers/posts_controller.php -snippet

	/\*\*
	 \* Returns an array of all public posts less than one month old, orderd by date
	 \*
	 \* @return unknown
	 */ 
	function newsfeed($count=null) {
		if(!$count) $count=5;
		$this->Post->recursive = 0;
		$posts=$this->Post->findAll('is_public = 1 
				AND is_published = 1 
				AND Post.date_modified >= now() - INTERVAL 1 MONTH'
					,null,'Post.date_modified DESC',$count);
		if(isset($this->params\['requested'\])) {
                         return $posts;
                 }
                 $this->set('posts',$posts );
	}

It would be really helpful if CakePHP provided an RSS helper. Zoot alors !  They do!

#### app/controllers/posts_controller.php -snippet

var $helpers = array('Rss');
var $components = array ('RequestHandler');

### The XML Generating View

Just like any other view, all we need to do is transform some provided data into a formatted page. This time it will be strict XML without all the html clutter.

#### app/views/posts/rss/newsfeed.ctp

 $item\['Post'\]\['title'\],
		'link' => array('controller' => 'posts', 'action' => 'view', $item\['Post'\]\['id'\]),
		'guid' => array('controller' => 'posts', 'action' => 'view', $item\['Post'\]\['id'\]),
		'description' => strip_tags($item\['Post'\]\['body'\]),
		'pubDate' => $item\['Post'\]\['date_added'\],				
	);
}

$this->set('items', $rss->items($posts, 'rss_transform'));

$this->set('channelData', $channelData);
?>

And of course sticking with format we should want to add an RSS layout.

#### app/views/layouts/rss/default.ctp

header();
		$channelData = array('title' => 'Recent News | Digital Business',
		 'link' => array('controller' => 'posts', 'action' => 'index', 'ext' => 'rss'),
		 'url' => array('controller' => 'posts', 'action' => 'index', 'ext' => 'rss'),
		 'description' => 'The best Digital Business RSS Feed on the web',
		 'language' => 'en-us'
		 );
$channel = $rss->channel(array(), $channelData, $items);
echo $rss->document(array(), $channel);
?>

### The RSS compliant URL

You only need to add 2 lines to your routes configuration file for CakePHP to catch and handle the url to pint to your RSS feed. You might use feed.rss, I choice live.rss.

#### app/config/routes.php -snippet

/\*\*
 \* ...allow rssextensions
 \* and send live.rss to the rss feed
 */
	Router::connect('/live', array('controller' => 'posts', 'action' => 'newsfeed'));
// see my posts on sitemaps to use this next line ;)	
Router::connect('/sitemap', array('controller' => 'sitemaps', 'action' => 'index'));
	
	Router::parseExtensions('rss','xml');

Yes, you'll notice an additional route there for [dynamic sitemaps](https://blog.edwardawebb.com/programming/php-programming/cakephp/generating-dynamic-sitemaps-cakephp), very useful as well. Sweet! Now just visit http://example.com/live.rss, or throw that url in your favorite Feed Reader to see the results.

#### http://example.com/live.rss

 Recent News | Digital Business
		http://digbiz.localhost/posts.rss
		  
		The best Digital Business RSS Feed on the web
		en-us
		 This is a Public, Published General News Article
			http://digbiz.localhost/posts/view/1
			http://digbiz.localhost/posts/view/1
			It should be visible by ALL users and guests.
			Tue, 22 Jul 2008 11:22:51 -0400 
		 New Public News
			http://digbiz.localhost/posts/view/6
			http://digbiz.localhost/posts/view/6
			Lets spice this up a bit...
			Fri, 01 Aug 2008 13:00:25 -0400 
		 Neil Hair Guest Essay in Democrat and Chronicle
			http://digbiz.localhost/posts/view/9
			http://digbiz.localhost/posts/view/9
			 Dr. Neil Hair comments on the Virtual Workforce of the
				future.
				http://www.democratandchronicle.com/apps/pbcs.dll/article?AID=2008810050343
			Mon, 06 Oct 2008 09:03:36 -0400