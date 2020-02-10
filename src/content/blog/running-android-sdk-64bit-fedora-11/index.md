---
title: 'Running Android SDK on 64bit Fedora 11'
date: Sun, 25 Oct 2009 00:36:55 +0000
draft: false
tags: [android, fedora, linux, SDK, Site News, x86_64]
---

I just got up and running with Fedora 11 after Ubuntu finally pushed me over the edge.  Every update seemed to break something else for me. But anyway Fedora is great, save one small caveat - I couldn't run any 3rd party 32bit applications. Ok, make that one huge caveat.  Consider some critical apps like Flash, or Android SDK that just wouldn't fly.  Rather than downgrade my distribution to the 32bit flavor (which too would solve this dilemma) I opted to keep my 64bit distribution and just add the needed 32 bit binaries. **SO you want to install Android SDK, or another 32bit app on Fedora 64bit? Read on!** Maybe you saw an error like;

**Bad ELF interpreter error: no such ld-linux-so.2 file or directory**

What the heck does that mean?  Well I don't know all the details, but basically it means that you are trying to run a 32bit binary without the supporting libraries (glibc, etc)

Solution
--------

My saving grace was [this nice post about 32 bit support on 64bit Fedora](http://beginlinux.com/blog/2009/09/installing-32-bit-support-into-64-bit-fedora-11/ "Support 32 bit applications on Fedora 64bit"), hmm. sounds fitting. Sure enough it worked like a charm. Bascially we just explicity install all the dependent libraries of the i586 version. By Fedora 12 this will need to be i686, but hopefully by then the Android SDK will be in a 64bit version anyway, so this trick will be meaningless. Here's to positive thinking!
