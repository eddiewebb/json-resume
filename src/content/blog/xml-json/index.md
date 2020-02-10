---
title: 'XML vs JSON '
date: Sat, 27 Mar 2010 16:20:58 +0000
draft: false
tags: [android, json, MIsc.Tips, xml]
---

I recently read an [article on Linux Magazine that suggested JSON is a better tool for data transfer than XML on Android phones](http://www.linux-mag.com/cache/7717/1.html "Article from Linux Mag").  So I decided to try switching some of QueueMan's queue retrieves over to JSON.  Eliminating the verbose tags may be much quicker over wireless airwaves. **The choir I tackled was to compare the performance of XML and JSON by downloading the user's recommendations from the Netflix API.** To make testing quick I would make a call to both XML and JSON classes in each loop, and repeat 10-30 times for each sample point.  The sample points were 1,5,10,15,25,50, and 64 discs. (64 being the current # of recommendations Netflix is offering me) I used org.xml.sax, and org.json. JSON* as the libraries for my parsing.

#### Why JSON is thought to be superior to XML

So the thought, as I have seen and heard it is as follows:

> JSON's lightweight payload allows for reduced bandwidth needs and faster transfers.

That is particularly attractive for mobile devices.

#### What my Testing Revealed about XML vs JSON

![](https://spreadsheets.google.com/oimg?key=0ApQs0QFa9ReJdFBMSkt3Sl9UVXVGd29ZOU5KZmVyMFE&oid=1&v=1269704842669) You can see from the 108 samples above that i**n the 1-5 disc range that JSON indeed performed a bit quicker** than XML. **However the numbers quickly turned, and JSON grew exponentially slower as the disc count increased**.  XML's time grew much slower.

#### Why XML is a better Performer

The argument that JSON's has a lighter data definition structure is true, but only by 50%.   And the structure for 5 discs is less than 1% of the total character payload  (0.8% in JSONs case, assuming an average label of 12 characters, not counting all the commas, parentheses, and escape characters needed).  And this drops as the numbers increase.  So if you're just passing a "tag_names" with payloads like "8974" than JSON would be much lighter.  Once you start passing text that far exceeds your tag lengths, than JSON loses its edge. **Size Matters**

{ "average_tag" :  {
"term1": "it's all about the data",
"term2": "and the amount of information",
"term3": "you need to transport"
}

<average_tag>
<term1>"it's all about the data</term1>
<term2>and the amount of information</term2>
<term3>you need to transport</term3>
</average_tag>

So although the payload is just slightly lighter,  it has one major trade-off.  XML is a parse-once-and-you're-done deal. The entire XML file is walked once by Sax, and you just build a neat little Object as you go.  With JSON you rely on setting objects to represent the structure of the file and pull pieces using their index.   I suspect the JSON parsers walk though the string numerous times. (hence the requirement for a string, and not an input stream like Sax.) **So, as far as QueueMan and I are concerned, we'll stick with XML.**
