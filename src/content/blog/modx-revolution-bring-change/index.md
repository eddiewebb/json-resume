---
title: 'Will MODx Revolution bring about change?'
date: Tue, 05 Apr 2011 02:18:55 +0000
draft: false
tags: [cms, modx, web development]
---

### Somewhere between CMS and Scaffolding Framework

MODx is a PHP based, mm.. tool, for publishing websites.  I don't want to call it a CMS, though If you read [MODx](http://modx.com/) documentation, they'll call it a Content Management System.  But in my experience products labeled CMS tend to be inflexible tools that require lots of effort to place widgets on custom templates.  I remember using one tool in which you could not have a publicly accessible page not belong to a menu. We ended up building a hidden menu for all such pages - absurd! At the other end of the spectrum are highly flexible frameworks. These are much more flexible, and let you run wild, but leave a good chunk of work to setup decent content management, authorization, etc. before you even get to the site at hand. Well MODx sit nicely between a CMS and a framework in my opinion. You get user management, admin panel, powerful configuration, etc.  But you are not forced into any mold.  In face the default install (without sample content) is literally an empty page!  Uncomfortable at first,  but once you spend a few hours with it you begin to love the freedom.   It is intended for sites that are heavy content focused, but provides full CRUD application abilities as well.

### Experience

I'll admit I'm speaking from limited experience, having only published three sites using MODx Revolution. I used MODx (Evolution), this version's rougher predecessor, a few years back and thought, "meh."  I have also published sites using drupal, joomla, cakephp, wordpress, and concrete5cms. I have varying opinions of all these tools, but have learned what I like, and what annoys me.  

### First Thoughts

I'm impressed.  I'll admit the first site I tried to publish I really struggled, mostly because I stubbornly refused to spend more then 5 minutes [reading the manual](http://rtfm.modx.com "Read the Manual") before diving in.  By the second site though my attitude changed. The ability to start with mockups and publish a flexible and robust app is intuitive and powerful.  Great flexibility is retained while a full package,user, setting management package is provided for you and site maintainers.  

### Learn Another Templating Language ? - No Need

OK, new framework/CMS, get ready to learn a new set of rules for configuring the various files needed to make your template with css and scripts right? **Not at all.  MODx lets you start with pure HTML, including doc declaration tags and head element.** You can(and should) then segement pieces of the template into _chunks_.  Various templates can share chunks and likewise the opposite.Your _blog_ pages can look radically different, or identical to your _support_ pages, but share the same header, modules, etc.  It is basically an <include> statement. So each chunk is just more html.  The result is a pure HTML based template, that is clean to maintain. Think of the power here!

*   Take HTML/CSS mockup directly from your designer
*   Apply the template to some or all of your content
*   No new languages needed

 

### Letting "users" add special content (meta data)

OK, that seems dandy, but the problem with such an open and free model is that if a user wants to include some special content or script I have to let them hack at the base template?!  Well that would be crazy! Instead **the concept of Template Variables (TVs) allow you to extend that idea of <include> to content**.  You specify placeholders in the template or chunk, and the user can fill out additional fields in the content manager.   This allows meta data, widgets, or anything else you want at presentation time to be added to content easily. \[\[+fieldUserAdded\]\]

### And what about more powerful features, I want to code!

If you need more then static content then MODx will not disappoint. The concepts of _snippets_ allows PHP code  and libraries to be included with ease.  Some snippets are very simple, say display the current time formated in the locale style.  Other snippets are just the interface for more elaborate solutions spanning many files.  Snippets except named arguments and will print to screen any output from the code.

\[\[!SayHello? &name=\`mike\`\]\]

in your document,chunk, or template, AND

<?php
echo "Well, Hello There " . $name . "!";
?>

As a _snippet_ would result in: Well, Hello There mike!

### And what about plugins?

You'll need contact forms and comment widgets and polling solutions and .... Well, sort of..  Most solutions you'll leverage are packaged _snippets_.  [FormIt](http://rtfm.modx.com/display/ADDON/FormIt "Form Handling in MODx") for example will take post data, perform validation, send email, etc.  But you still get to design whatever form you want, as long as the form's action is a page that calls the appropriate FormIt snippet.  [Quip](http://rtfm.modx.com/display/ADDON/Quip) is a full solution for comment management, adding the snippet to any page will attach comments to that resource. There is also add-ons for handling searches,  listing content summaries, and data access.  

### What Else?

Oh Man! there are so many more [features in MODx Revolution](http://modx.com/revolution/product/features/) including message queues, internationalization, logging, acl based authorization, and xPDO, an easy ORM api for custom and system objects. . I plan to add the (little) code from my recent site, to help illustrate the points above. Meanwhile let me know if you have thoughts. If you need a new site including custom development then MODx is a great solution. There is strong documentation, clean architecture, and fast results.
