---
title: 'Prevent Image use by outside sites '
date: Fri, 02 Jan 2009 18:12:05 +0000
draft: false
tags: [apache, apache, hotlinking, htaccess, MIsc.Tips, web development]
---

Hotlinking... one of the most dastardly crimes to hit the internet.  This is especially concerning if your hosting plan caps your bandwidth. Hotlinking is when users insert a url to your images on their own site rather than linking to your page (or just uploading the image to their own servers) **What is a simple webmaster like yourself to do with these hooligans that are chewing away at your bandwidth allocations? Well block them of course.  The solution is simple and straightforward.** Best of all you can even server up a humorous or fearful image to replace the one being hijacked.

### The problem:

You innocently hosted a sweet background image or icon only to find that devilish designers or bloggers are hotlinking to the image within their own sites.

### The solution:

Catch the incoming requests and instead return a static image that warns they have been caught in the act.  The image should be of minimal size to lower bandwidth consumption.

### Implementation:

Again we will rely on the quintessential Apache Rewrite module to preform this task. Open up the .htaccess file in your top-most directory and add the following snippet;

 SetEnvIfNoCase Referer "^http://(\[^/\]*\\.)?example.com/" requested_locally=1
RewriteCond %{ENV:requested_locally} !=1
RewriteRule ".*" "/no-hotlink.gif" \[L\] 

**What's all this then?** Here's a breakdown line by line;

*   For any files that end with image extensions, use the following rules
*   Case insensitive check against the headers referrer sent by browser. (yes referrer is spelled wrong as it was in the original specs) If the referrer is your own, set an environmental variable to 1
*   If our environmental variable is not set (meaning its not a local request)
*   Then send them an ugly/funny/angry photo instead
*   end rules for files matching image extensions