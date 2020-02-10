---
title: 'Link to element IDs inside a jQuery tabs - read "Stateless"'
date: Tue, 26 Apr 2011 21:48:20 +0000
draft: false
tags: [Site News]
---

I recently implemented JQuery's Tabs feature into a site I am building for a client.  My first though was "wow, that was easy."  **And then the usability issues starting making themselves apparent**. ** I like stateless web. Everything is linkable and bookmarkable, and once you have something the way you want, you should be able to share it with nothing more then the unique and repeatable url.** WHat do I mean by usability issues, let me explain with a few scenarios.

Problems
--------

### Problem 1: Switching tabs is not reflected by the URL, making the page stateful

Ugh, we _hate_ stateful web sites!

1.  Your visitor lands on PageA that has 3 tabs: Main content, Dynamic Map, and User comments.
2.  To see the maps, user clicks on "Tab2". (URL remains unchanged)
3.  User wants to share map, and sends link to a friend, but all they see is the welcome content - OOps!

In this case user A would need to supply User B with a link, and instructions to get to the right tab. **This violates the principle that the web should be stateless, and repeatable.  If content changes, the URL should too.**

### Problem 2:  Elements inside hidden tabs are not reachable by URL alone

1.  User A is reading the comments tab "Tab3" and decides she wants to add her own.
2.  After supplying her info, and the CAPTCHA she submits the form
3.  Let's suppose the user forgot to add her actual comment, and the form tries to re-render with the validation message - OOps!

Here User A expected to see the comment form again, and instead sees the page re-rendered, but Tab1, the default tab, is shown. **She has no awareness that the form (on Tab3) failed, and assumes her comment was submitted.** But what if she had successfully submitted her comment? The same problem will crop up when the comment widget tries to redirect our user to her submitted comment (mysite.com/pageA#YourNewComment) Because the ID "YourNewComment" is part of the hidden content of Tab3, the page will just load Tab1, and leave our user curious.  

Solution
--------

Fortunately it only takes a few lines of clever jQuery code to solve these usability issues.

1.  If the current tab changes, we update the URL with the correct anchor (mysite.com/PageA#Tab2)
2.  If a URL contains the anchor of a tab, we make _that_ tab active
3.  <The icing> If the URL contains an anchor for an element that resides _inside_ a tab, we make the parent tab active and scroll to the specified element

I need to thank Mark Yoon for numbers 1&2 that are based on a comment he left _somewhere_ (i;ve been googling this issue alot!) Number 3 was my own addition, and the most critical to me, because it allows existing widgets to work inside the tabs, and makes the tabs transparent from a URLs perspective.     Alright, assume the following HTML:

 
	

 
		*   [Tab1](#Tab1)
 
		*   [Tab2](#Tab2)
 
	

 
	

 
		Content for Tab one, active by default
	

 
	

 
		Content for Tab two, hidden by default
		

 A simple form to submit comments

		

 The third comment, hidden by default

		

 The second comment, hidden by default

		

 The first comment, hidden by default

	

 

 

So we could supply a URL for the default tab: _PageA.html**#Tab1**_. We could supply a URL for the inactive tab: _PageA.html**#Tab2**._ We can also supply a URL for the hidden comment #3 on Tab2: _PageA.html**#com3**_ And! If a user lands on tab1, but switches to tab2, we update the URL instantly so they can share the right tab with friends.  

The Code
--------

I included this code right under the call to initialize my tabs, which is also shown for illustration purposes.

				 $(function() {
		//initiate tabs
		$( "#tabs" ).tabs();

		//Determine is the URL contains an Anchor, and what the value is
		var anchor = $(document).attr('location').hash; // the anchor in the URL- Thanks Mike!

		//now the 3 scenarios we need to handle
		if($("#Tab2").find( anchor).size()>0){
			//the anchor lives in Tab2
			$("#tabs").tabs('select', 1);
		}else if($("#Tab1").find( anchor).size()>0){
			//the anchor lives in Tab1
			$("#tabs").tabs('select', 0);
		}else{
		    var index = $('#tabs div.ui-tabs-panel').index($(anchor)); //Thanks Mike! 
		    if(index >=0){
			//the anchor _is_ tab 1 or 2
			$('#tabs').tabs('select', index); 
		    }
		}
		//anchor resides outside tabs, or doesn't exist, take no action


		//This line will update our URL anytime a tab is selected - Thanks Mike!
		//setting this before now will cause odd behavior
		$("#tabs").bind('tabsshow', function(event, ui){document.location =$(document).attr('location').pathname + "#" + ui.panel.id; });

	}); 

That's it! You can now ignore the tabs as far as URLs are concerned, and point to any valid element's ID on the page! Please let me know if anyone has found a better way to achieve these 3 goals.
