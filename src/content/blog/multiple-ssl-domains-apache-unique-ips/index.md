---
title: 'Multiple SSL Domains on Apache without Unique IPs'
date: Tue, 01 Sep 2009 13:19:40 +0000
draft: false
tags: [apache, apache, dreamhost, linux, ssl, web development]
---

So you host 13 domains on one server and want SSL certs for each domain. The cost of unique IPs is an obstacle indeed, but what if you didn't need any unique IP addresses? IMpossible you say? Not with the release of Apache 2.2.13! I stumbled on this nice little feature called SNI (or _Server Name Indication_) that allows multiple domains to share an IP and implement SSL without showing warnings to users or confusing Apache.  I found this beauty after reading another great article on Linux Magazine, [Ten Things You Didn't KNow Apache (2.2) Could Do](http://www.linux-mag.com/cache/7480/1.html) So those of you running your own servers can take advantage by upgrading today! For those of you relying on a Host you should start bombarding them with requests immediately. **DreamHost members can [vote up the already created suggestion  to implement this](https://panel.dreamhost.com/index.cgi?tree=home.sugg&category=_all&search=Support%20for%20name-bas "Vote for this Feature on all DreamHost servers.").**
