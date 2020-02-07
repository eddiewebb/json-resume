---
title: "Maven SCM Plugin Security Fix"
date: 2018-02-21T14:35:46-05:00
description: "Addressed vulnerability that leaked passwords on failed SVN or git operations."
tags: ["Subversion","git","Maven","Java","Mojo","Security"]
image: "/img/maven.webp"
link: "https://github.com/apache/maven-scm/pull/45"
fact: "Addressed a critical security issue leaking production credentials for anyone using `mvn release:perform`"
weight: 999
sitemap:
  priority : 0.5
featured: true
---

Our software teams use Maven heavily, and it was reported to my central platforms team that certain failed operations were leaking our SCM passwords.  Digging in I was able to find the cause in the underlying Maven SCM plugin used by Maven Release Plugin.

```
[ERROR] fatal: unable to access 'https://myuser:mypassword@myserver.com/scm/project/project.git/'
```

I contrubuted a fix that masked the pattern known to nbe passwords, providing test cases to validate that future leaks would not regress into the code base.


```
[ERROR] fatal: unable to access 'https://myuser:****@myserver.com/scm/project/project.git/'
```
