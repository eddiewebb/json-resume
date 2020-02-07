---
title: 'Nested trees in CakePHP'
date: Tue, 24 Mar 2009 14:00:19 +0000
draft: false
tags: [CakePHP, CakePHP, nested lists, nested tables, tree]
---

This article started as a footnote to an article I wrote yesterday, [using ACL in CakePHP](https://blog.edwardawebb.com/programming/php-programming/cakephp/started-acl-cakephp "Some advice to get started with ACL component in CakePHP").  I wanted to outline how the hierarchy structure of the Aro and Aco tables worked, and just what **lft** and **rght** columns provided over parent_ID. I soon realized that my topic, although used by ACL was much broader. Not only is it a standard practice in referential DB's requiring a hierarchal structure, but it is used by Cake's Tree behavior as well.  So in order to keep some..order in my site I broke it out into its very own article.

### Where do they come up with this stuff?

Well the principle here is not something those magical Cake developers concocted after a wild bender, nope its a pretty standard way to enhance the performance and usability of structured tree queries, known as **nested set model.** Fortunate for us the team knows and follows so many great standards, and this is just another example.

### Why not use just Parent_ID to create trees?

Mike Hillyer wrote an article on the MySQL developer site and states the problem very well;

> "Most users at one time or another have dealt with hierarchical data in a SQL database and no doubt learned that the management of hierarchical data is not what a relational database is intended for. The tables of a relational database are not hierarchical (like XML), but are simply a flat list."

http://dev.mysql.com/tech-resources/articles/hierarchical-data.html I strongly encourage you t read his full article as he discusses the limitations that exist using a simple 'Adjacency List Model' as he describes it. In summary though;

*   You need to know how many levels in a tree first, and then create a join for each level
*   Take caution when deleting nodes to be sure you don't orphan any records.

So is there a better way, sure is!

#### Nested Set Model

Mike not only details the concept very well, but has some great visual aids that make understanding this concept really easy. There are numerous perks (again, I ask that you read the full article) but in summary;

*   No joins needed to pull back entire tree, no need to know the depth first
*   Easily determine leaf-nodes (childless)
*   Best of all, use count to easily create indented html

That last bullet is worth noting again.  With a single SQL statement we can return all items in a tree along with the count of their parents.  This parental count can then be used to know how far to indent, or how many nested UL tags to use for any given node.  The result is a nicely formatted tree, or nested list.

### What about updating  or adding records?

Ok, your probably pointing out how much more complicated it is to add, or update records that use a Nested List Model. You have to determine where it will fit, determine its new lft and rght values, and update any affected records lft and rght values. Well that's true. But think of it this way. How often do you read from a record compared to how often you create or update one. You might add a new product every now and then, but your customers will list your products 100 times that count.  So where do you want ease and performance to lie? So I hope that clears up the general reasoning behind the lft and rght columns used in ACL and other Nested Lists.  If not, read the [article by Mike Hillyer](http://dev.mysql.com/tech-resources/articles/hierarchical-data.html "Great article explaining the ins and outs of nested lists in a MySQL table")!
