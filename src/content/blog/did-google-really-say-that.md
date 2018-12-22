---
title: 'Did google really say that?'
date: Sat, 21 Jun 2008 21:42:20 +0000
draft: false
tags: [adsense, google, Site News]
---

For the first time in my use of Google products I just got a very exotic and none too pleasing response; "The Google AdSense website is temporarily unavailable. Please try back later. We apologize for any inconvenience." They were kind enough to display it in just about every language, but still it begs the question...

### Whats the big deal?

I was under the understanding that Google employed an HA stack that allowed for virtually 100% uptime, even through maintenance and failures.

### How?

Independent legs can be brought down, updated and pushed live again, while while the user goes on blissfully unaware, hitting one of the remaining servers that stays up using fail over IP routing. This failover switching usually occurs in two or more physically isolated locations. This way should California fall into the sea, a router in Houston will start kicking data back up to Chicago. What could be the cause of such an outage then, they give no insight, only apologizing for the issue. interestingly the ad service itself seems to be running fine. I must conclude serious changes in the way information is being reported through the adsense service., something more than a simple interface upgrade. OR severe technical troubles in a critical, and apparently overlooked bottleneck.