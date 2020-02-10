---
title: 'Multiple Sites in Piwik'
date: Wed, 22 Oct 2008 23:16:55 +0000
draft: false
tags: [multiple sites, piwik, web development, web development]
---

So I was checking my analytics (piwik of course ;-) ) today and I noticed a lot of folks landing on my page after searching this title, 'multiple sites piwik'. Unfortunately they were landing on a page that only briefly discussed that it was a capability of piwik, so I felt alot of users were leaving with a bad taste in their mouths. To make amends Ill do my best to sum up this easy process.

### Steps to add additional domains to your piwik analytics.

I'll assume you have Piwik installed? I used a subdomain (piwik.example.com) but that's not necessary, just nice.

1.  First Off log in as an admin by clicking the link in the upper right hand corner while viewing the initial page. [![](pw11-300x95.webp "pw11")](pw11.webp)
2.  Under the heading look for the tab marked Sites, and follow through. [![](pw21-300x240.webp "pw21")](pw21.webp)
3.  Click the line 'Add a new Site' [![](pw31-300x151.webp "pw31")](pw31.webp)
4.  Enter Site Name, and primary url in the text boxes that appear
5.  When finished click the small green checkmark. [![](pw4-300x102.webp "pw4")](pw4.webp) After a moment or so the new information should be added as another level in the table.
6.  Click the 'Show Code' link in the rightmost column. [![](pw5-300x63.webp "pw5")](pw5.webp)
7.  Copy the code into the html of your site, and publish to the world.
8.  Open a new window or tab and Visit your site and hit any url that will activate the code you just added.
9.  Back to our Piwik window, Click the 'Back To Piwik' link [![](pw7-300x69.webp "pw7")](pw7.webp)
10.  Select your new site from the drop drop down in the upper right [![](pw8-300x92.webp "pw8")](pw8.webp)
11.  Finally change the day to the current date to see your results.[![](pw6-300x128.webp "pw6")](pw6.webp) By default, and quite logically, piwik shows yesterday, the last full day of statistics.

That's it, please comment if there is more you would like me to address.
