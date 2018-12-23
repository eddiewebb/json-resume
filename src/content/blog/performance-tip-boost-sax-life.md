---
title: 'Performance Tip: Boost Your SAX Life'
date: Fri, 16 Oct 2009 15:55:23 +0000
draft: false
tags: [java, MIsc.Tips, parser, SAX, xml]
---

SAX, or _Simple API for XML_ has grown to be the standard in Java XML parsing.  Numerous studies show how its performance, in the majority of circumstances, beats others such as PULL. Does that mean you should just bang out a custom handler and expect solid performance, hardly. This article has only two  tips, but it can have a huge impact.

Sample Code
-----------

In case it has been  a while since you wrote your last SAX XML handler, below is a sample method for the start of each element in an XML stream. This method will be called each and every time a new element starts, no matter how nested or trivial.

public void startElement(String uri, String name, String qName,	Attributes atts) {
		if (name.trim().equals("category")){
			inCategory = true;
		}else if (name.trim().equals("availability")){
			inAvailability = true;
		}else if (name.trim().equals("delivery_formats")){
			inFormats = true;
		}else if (name.trim().equals("queue_item")){
			inQueueItem = true;
		}else if (name.trim().equals("id")){
			inId = true;
		}else if (name.trim().equals("average_rating")){
			inRating = true;
		}else if (name.trim().equals("position")){
			inPosition = true;
		}else if (name.trim().equals("title")){
			inTitle = true;
		}else if (name.trim().equals("box_art")){
			inBoxArt = true;	
		}else if (name.trim().equals("etag")){
			inETag = true;			
		}else if (name.trim().equals("number\_of\_results")){
			inResultsTotal = true;
		}else if (name.trim().equals("results\_per\_page")){
			inResultsPerPage = true;
		}
	}

(That is part of a handler I use for Netflix's API responses.)

Keep it Simple SAX
------------------

So this may seem obvious to some of you, and is based on a well understood matter.  **String comparisons are not cheap**. They're not explicitly expensive, and having a half a dozen in one method would not usually cause any performance bottle necks. But now imagine calling the same method 1,000's of times. That's 6,000 string comparisons! Each method in a SAX parse will do just that! So how do we reduce the number of comparisons needed? So if your not using "reasults\_per\_page" then there is no need to check for that element. It may be useful to create separate handlers for various needs. One can get the quick and dirty summary, while the other can capture all the gritty details. Hooray! we just knocked off 1,000 comparisons!

Order is Everything!
--------------------

So keeping the If Else blocks short makes sense, the less comparisons, the faster the parsing.  But even for those blocks that require numerous element checks we can tune performance substantially by adjusting the order. The next tip, and a hugely important one, is to carefully consider the frequency of each element called. To illustrate is a sample XML response form Netflix.

 26049040137
	http://api.netflix.com/users/se3cret/queues/disc?{-join|&|sort|start\_index|max\_results} 
	32
	0
	25
	 http://api.netflix.com/users/secret/queues/disc/available/1/70056440 
		1
		
		Available Now
		1185814282
		
		
		
		
		
			Zack Snyder directs this faithful adaptation of Frank Miller's (Sin City) graphic novel about the storied Battle of Thermopylae, a conflict that pitted the ancient Greeks against the Persians in 480 B.C. The film, which blends live-action shots with virtual backgrounds to capture Miller's original vision, co-stars [Gerard Butler](http://www.netflix.com/RoleDisplay/Gerard_Butler/20015853) as the Spartan King Leonidas, who leads his small band of 300 soldiers against an army of more than one million. \]\]>
		
		
		2007
		
		
		
		
		
		
		
		
		6960
		
			  
		
		
		
		
		
		4.0 
	 ... 

So there are some important things to note;

*   'queue' occurs once, and only once
*   Likewise 'etag', and result counts occur once and only once
*   'queue_item' occurs once for each movie (1 to many times)
*   'id', 'position' and movie details also occur once for each listing (1 to many times)
*   'availability' may occur 1 to 3 times for each movie (3 to (3*many) times )
*   'category' is by far the most notorious, occurring within each title multiple times, and within each availability (lots of times)

So what does that mean? **It means the very first element we'll check for is 'category', then 'availability', and work our way to the least common element, 'queue'.** This is a very effective way to increase performance because **once a match is found, we skip all the rest**. So a **12** comparison method effectively becomes a **single comparison** if we are in a 'category', and a 2 comparison method if we are in 'availability', etc. Until finally on the rarest 'queue' which occurs only once do we evaluate all 12 comparisons.

Results
-------

This test is hardly conclusive, but you can see the average and max parse times of a randomly arranged handler and a popularity arranged handler. ![](http://spreadsheets.google.com/oimg?key=0ApQs0QFa9ReJdHpselhsbGwxZVB3ZXdDa01ObmQ3Nnc&oid=4&v=1256445520530) ![](http://spreadsheets.google.com/oimg?key=0ApQs0QFa9ReJdHpselhsbGwxZVB3ZXdDa01ObmQ3Nnc&oid=6&v=1256445692757)