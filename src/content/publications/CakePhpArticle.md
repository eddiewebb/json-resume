---
title: "Implementing Access Control Lists in CakePHP"
date: 2009-03-01
pubtype: "Tech Article"
featured: false
description: "Demonstrating ability to convey complext technical concepts, this article breaks down the concepts and implementation of ACL for authorization rules in the CakePHP framework. One of the more popular articles on Eddie's now neglected tech blog."
tags: ["Technical Writing","PHP","CakePHP"]
image: "/img/cakephp-acls.png"
link: "URL linked from project details page"
fact: "Interesting little tidbit shown below image on summary and detail page"
weight: 500
sitemap:
  priority : 0.8
---


CakePHP is an MVC based framework for PHP that encourages good separation of concerns. It provides ability to rapidly scaffold from defined data models, and eliminate much boilerplate code found in accessing datasets.

Another great feature is the integrated Authentication and Authtorization support, but configuring the right Access Control List was poorly documented at the time of this article.  It provides the rationale, configuration and sample code to setup a basic ACL for a site considering multiple types of users (Admins, Users) and multiple access rights (view, edit, etc).
