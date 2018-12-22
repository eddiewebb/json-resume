---
title: 'Getting the most of cell phone favorites - a.k.a. free calls'
date: Sun, 12 Jul 2009 14:15:27 +0000
draft: false
tags: [awk, calls, MIsc.Tips, phone, t-mobile]
---

Many cell phone carriers are moving to implement a circle of friends that you can call for free. T-Mobile has MyFaves™,  Alltel has My Circle ™, even Verizon offers a discount on the ten numbers you call most. This begs the question; "**Who do I call Most?**" Well you can be subjective about it and decide you like Danny better than Mary-Lou, but the truth is that Mary-Lou calls you constantly, and that's going to put a dent in your anytime minutes. The more objective and scientific method is to actually count the minutes you spend on each number and rank the accounts in order of use. Hmm, I am already thinking AWK. **Read on to get the awk script to sort your monthly calling logs into facts you can use!**

The Problem
-----------

You need to know if your circle of chosen numbers is giving you the best use of your free calling.

The Solution
------------

Tally up those calls and compare.   This uses some stanard 'nix utils including awk and sort. Start by jumping to your carriers website. They all  provide a digital view of your call logs.  You can copy and paste into a text file, or download a CSV file that lists them out.  Name this file callLogs. (If you are using a CSV, I recommend replacing the commas with semi-colons, or another character that won't be found anywhere else in the record. Removing extraneous quotations is helpful as well.)

### Sample Call Log

07/11/09;INCOMING;06:09 PM;555-420-1118;;1
07/11/09;PLATTSBG, NJ;05:55 PM;555-420-5141;(V);1
07/11/09;PLATTSBG, NJ;05:55 PM;555-420-1318;;1
07/11/09;INCOMING;05:38 PM;555-420-5141;(V);2
07/11/09;PLATTSBG, NJ;05:20 PM;555-420-5141;(V);1
07/11/09;INCOMING;05:15 PM;555-420-5141;(V);2
07/11/09;VM Retrieval;05:12 PM;221;(F);5
07/11/09;POUGHA, NJ;04:04 PM;555-643-8173;;2
07/11/09;VM Retrieval;04:04 PM;221;(F);1
07/11/09;PLATTSBG, NJ;12:23 PM;555-563-1689;(V);2
07/11/09;INCOMING;12:36 AM;555-593-1910;;2

This is a T-Mobile Call Log. There are 6 fields. I only care about 3 of them. The number ($4) Their bucket, e.g. MyFave, Mobile to Mobile, ($5) and the call time ($6). Excellent.  Now we need some **script to sort, total and report on those numbers**. Enter AWK.

### The AWK Script to Total and Sort Call Logs

\*\*\* Please pay attention to the field numbers used ($4,$5,$6)  the order and count of your fields may differ ***

\# awk script that totals minutes based on verizon call log (pasted form site)

#usage: cat callLog | awk -F";" -f #in T-Mobile world a F denote mobile to mobile and V denote my fave
#will have 3 buckets in total then
$2 !~ "(\[VF\])" {minutes\[$1\] += $3}  #whenever minutes
$2 == "(V)" {faves\[$1\] += $3} #myfaves
$2 == "(F)" {tm\[$1\] += $3} #mobile to mobile

#print a nice summary please
END {		
		for (i in minutes)
		{			
			 total += minutes\[i\]
			printf "%s calltime totaled %d\\n", i, minutes\[i\]
		}
		printf "Total: %d",total
		printf "\\n\\n Faves Totals\\n"
		for (i in faves)
		{			
			 ftotal += faves\[i\]
			printf "%s calltime totaled %d\\n", i, faves\[i\]
		}
		printf "Total: %d",ftotal
		printf "\\n\\n T-Mobile Totals\\n"
		for (i in tm)
		{			
			 ttotal += tm\[i\]
			printf "%s calltime totaled %d\\n", i, tm\[i\]
		}
		printf "Total: %d",ttotal
	} 

Great, now we can **run our call log through the awk script** to see what we get..

The Result
----------

I am on T-Mobile, so I have **3 Categories of calls; My anytime or whenever minutes,  my MyFaves™ minutes, and my T-Mobile to T-Mobile calls.**

Eddie@HP-dv6z-420 ~
$ cat callLog | awk -F";" -f ~/scripts/CallLogSummary
555-448-3547 calltime totaled 2
555-572-7255 calltime totaled 2
555-593-0910 calltime totaled 5
555-643-8773 calltime totaled 2
555-433-1328 calltime totaled 8
555-578-2088 calltime totaled 2
555-682-8397 calltime totaled 2
555-335-1974 calltime totaled 3
555-334-3041 calltime totaled 5
555-373-8408 calltime totaled 7
555-593-2753 calltime totaled 26
555-351-8146 calltime totaled 12
555-420-6768 calltime totaled 4
555-531-0398 calltime totaled 4
555-420-6318 calltime totaled 8
555-448-2571 calltime totaled 1
555-740-4700 calltime totaled 1
Total: 94

 Faves Totals
555-563-0689 calltime totaled 76
555-420-5169 calltime totaled 23
555-593-1531 calltime totaled 5
555-420-5641 calltime totaled 23
530-721-0449 calltime totaled 23
Total: 150

 T-Mobile Totals
123 calltime totaled 12
555-420-8399 calltime totaled 4
221 calltime totaled 6
Total: 22

As you can see I am NOT getting the most of my plan. I will switch the low My Fave out, and add the Highest called number from the first block.