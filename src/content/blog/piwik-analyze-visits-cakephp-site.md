---
title: 'Using Piwik to Analyze visits on a CakePHP site'
date: Wed, 28 Jan 2009 17:53:24 +0000
draft: false
tags: [analytics, CakePHP, CakePHP, piwik]
---

This is another article based on current search terms for my site. A good number of searches for "piwik + cakephp" are landing on various pages of my site. So if your one of those folks I'll assume you want to use Piwik Analytics in your CakePHP site. Well your in luck, the solution is nice and easy. CakePHp provides some nice variables that we can use for detailed page tracking.  
  

The Problem
-----------

You love Piwik, and/or You love Cake  and just want the two to get along nicely.  
  

The Solution
------------

They couldn't get along better!  Two outstanding products that make you feel all warm and fuzzy when you smoosh them together, so let's get started.  
  
  

Implementing Piwik in a CakePHP application
-------------------------------------------

First thing is first, you need to install Piwik.  I recommend that you dedicate a distinct sub-domain to Piwik, since it can serve multiple sites.  
For instance, I serve analytics to all my sites from one Piwik install.  The installation does not need to share a domain or server with the applications it tracks.  
The install process for Piwik is well documented, and much like any other LAMP application. Just create a DB, upload the files, and run the install scripts.**  
The next step is adding a new site to Piwik.  THat is also well documented, but can be found here is you need help, [Adding multiple sites to Piwik](https://blog.edwardawebb.com/web-development/multiple-sites-piwik "How to add a new site to your Piwik install").**  
Ok so once you add the site to Piwik it will give you a snippet of JavaScript to insert in your site.  **For CakePHP sites we'll add this snippet to our default layout. (And any other layouts you want to track)**  

#### Piwik Site Snippet

 [var pkBaseURL = (("https:" == document.location.protocol) ? "https://piwik.example.com/" : "http://piwik.example.com/");
document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E"));  piwik\_action\_name = '';
piwik_idsite = 10;
piwik_url = pkBaseURL + "piwik.php";
piwik\_log(piwik\_action\_name, piwik\_idsite, piwik_url); 

<p>Free analytics <img src="http://piwik.example.com/piwik.php?idsite=10" style="border:0" alt=""/></p>](http://piwik.org "Free analytics")

  
Ok so the code's in the layout, but you may find an issue with Piwik's method of obtaining the url. Luckily we can build our own variable to pass to piwik.  
This way we ensure that the pages list accurately reflects the layout of our site, like this; \[caption id="attachment_357" align="aligncenter" width="488" caption="Sample Pages Hierarchy"\]![Sample Pages Hierarchy](https://blog.edwardawebb.com/wp-content/uploads/2009/01/greenlife.png "Sample Pages Hierarchy")\[/caption\]  
In order to ensure our urls are captured correctly I wrote a small php snippet to create the page url to use. This varies slightly from 1.1 to 1.2 based on the changes for parameters from $params to $this->params.  

#### CakePHP 1.1 app/views/layouts/default.ctp

			
Using:>'.$pageUrl.'<';
	//echo $arraykeys->getKeys($params\['pass'\]);
	?>

  

#### CakePHP 1.2 app/views/layouts/default.ctp

			
params;
				
	//determine whtehr to use url (which doesnt work on homepge ) or not.
	$pageUrl='';
	if(empty($params\['url'\]\['url'\])) {
		//we need to concat our own url
		$pageWeSee=$params\['controller'\];
		//only append action if not 'info' pages ('index' is hidden in url, and should be hidden here)
		if($pageWeSee!=='info') $pageWeSee.='/'.$params\['action'\];
		//any parmaeterrs we should know about?
		$ps='';
		foreach( $params\['pass'\] as $p){
			$ps.='/'.$p;
		}//end for each
		$pageUrl=$pageWeSee.$ps;
	}else{
		//oh how sweet, a fully built url for us
		$pageUrl=$params\['url'\]\['url'\];
	}
	//echo  '  
Using:>'.$pageUrl.'<';
	//echo $arraykeys->getKeys($params\['pass'\]);
	?>

  
  
So all together the footer of your layouts should look like this;

#### app/views/layouts/default.ctp

Using:>'.$pageUrl.'<';
	//echo $arraykeys->getKeys($params\['pass'\]);
	?>
	 [var pkBaseURL = (("https:" == document.location.protocol) ? "https://piwik.example.com/" : "http://piwik.example.com/");
	document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E")); 
	 <!--
	piwik\_action\_name = '<?php echo $pageUrl;?>';
	piwik_idsite = 5;
	piwik_url = pkBaseURL + "piwik.php";
	piwik\_log(piwik\_action\_name, piwik\_idsite, piwik_url);
	//-->  <p>Website analytics <img src="http://piwik.example.com/piwik.php" style="border:0" alt="piwik"/></p>](http://piwik.org "Website analytics") 
 

  

### The Result

On any give page like http://example.com/posts/view/10042 the resulting piwik code would look like;

	 [var pkBaseURL = (("https:" == document.location.protocol) ? "https://piwik.example.com/" : "http://piwik.example.com/");
	document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E"));  piwik\_action\_name = 'posts/view/10042';
	piwik_idsite = 5;
	piwik_url = pkBaseURL + "piwik.php";
	piwik\_log(piwik\_action\_name, piwik\_idsite, piwik_url); 
	

<p>Free analytics <img src="http://piwik.example.com/piwik.php?idsite=10" style="border:0" alt=""/></p>](http://piwik.org "Free analytics")