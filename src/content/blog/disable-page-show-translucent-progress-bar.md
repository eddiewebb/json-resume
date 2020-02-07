---
title: 'Disable entire page and show translucent progress window'
date: Thu, 24 Jul 2008 19:39:03 +0000
draft: false
tags: [ajax, CakePHP, CakePHP, CSS, pagination, progress bar]
---

Ever uploaded an image or iniated another timeful(slow) process on a webpage? Some sites appear to fade out the whole window while a small loading bar appears. \[caption id="attachment_62" align="aligncenter" width="300" caption="Loading Bar translucent overlay"\][![](https://blog.edwardawebb.com/wp-content/uploads/2008/07/windowfade2-300x249.png "Blocked out page")](https://blog.edwardawebb.com/wp-content/uploads/2008/07/windowfade2.png "Example of a page using this technique")\[/caption\] **This not only clearly indicates to users that the server is working in the background, but it is a great way to block the impatient click happy users as well.** Its a pretty straightforward effect done with javascript and css. CakePHP users can let Cake handle the JS. The critical part is using CSS to create a translucent block that we can overlay on the page. 

#### Ok so there is three key pieces to achieving this effect;

*   a hidden div that contains a standard loading bar(shows user we're working)
*   a small translucent png image that we can repeat as a background(''fades-out" original page)
*   Ensuring the background we use covers the entire visible area in FF and IE.(Effectively blocks access)

#### I will explain the process in four steps, in the order I would recommend;

1.  Obtain our progress indicator and background images
2.  Create a hidden <div> element to show our images
3.  Use CSS to format the layout
4.  Use Javascript to turn the effect on /off

The images
----------

*   First you'll need a nifty loading bar, or spinning globe, or spinning dots etc. If you don't already have one you'd like to use, visit [http://www.ajaxload.info](http://www.ajaxload.info "Visit ajaxload to generate a custom loading image")/ to build your own.
*   Next you'll need a small translucent image. If you don't have photoshop, or gimp, than you may use my standard greyish translucent block found below. Don't hotlink!, right-click and save as...[![Image to use as a our background](https://blog.edwardawebb.com/wp-content/uploads/2008/07/transbg.png "Translucent grey image")](https://blog.edwardawebb.com/wp-content/uploads/2008/07/transbg.png)

The hidden div
--------------

//for cakephp users

		image('ajax-loader.gif'); ?>

//plain html

		![](ajax-loader.gif)

the stylesheet
--------------

/\*the basics, and works for FF\*/
#LoadingDiv{
	margin:0px 0px 0px 0px;
	position:fixed;
	height: 100%;
	z-index:9999;
	padding-top:200px;
	padding-left:50px;
	width:100%;
	clear:none;
	background:url(/img/transbg.png);
	/*background-color:#666666;
	border:1px solid #000000;*/
	}
/\*IE will need an 'adjustment'\*/
\* html #LoadingDiv{
     position: absolute;
     height: expression(document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight : document.body.offsetHeight + 'px');
	}

**The CSS above allows the div with the id _LoadingDiv_ to lay on top of any other elements on the page.** Its like when your teacher use to lay a spare piece of paper over a transparency to block the answers from shining through. Yes, that was a reference to overheads ;)

The javascript
--------------

Note: those using CakePHP should first read this article in the bakery on [advanced ajax pagination](http://bakery.cakephp.org/articles/view/advanced-pagination-1-2 "Read this article in the bakery").

var ldiv = document.getElementById('LoadingDiv');
ldiv.style.display='block';
/\*Do your ajax calls, sorting or laoding, etc.\*/
ldiv.style.display = 'none';

### Example: The CakePHP Pagination Call

Those who are using CakePHP 1.2 undoubtedly know about its awesome pagination abilities. Well it can use ajax to complete the task, and we can assign our cool new blockout div as the progress indicator.

			$paginator->options(
            array('update'=>'PPaging',
                    'url'=>array('controller'=>'Posts', 'action'=>$this->action,$project_id),
                    'indicator' => 'LoadingDiv'));

Note: I tried to make this organized and clear, but we all think differently. So if you don't understand anything, please comment below and I will work to dispel any confusion.
