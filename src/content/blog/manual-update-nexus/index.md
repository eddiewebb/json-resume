---
title: 'Manual Update for Nexus One '
date: Tue, 01 Mar 2011 01:06:26 +0000
draft: false
tags: [android, Android, Gingerbread, Nexus One]
---

I am writing this as the release for Gingerbread (2.3) is being slowly released OTA, but the same steps apply regardless of the rom version you are eagerly awaiting. This is safe and repeatable, and I have done it for 3 updates on 2 devices now, so I am very confident nothing will go wrong. Even so, I waive any responsibility if something goes wrong. For the details and pictures, read below the fold.  

1.  Download the latest ROM, and ensure the file name includes the 3 letter version code for your current build.
    
    > (Go to settings > about phone and scroll, you'll see something like FRG83 , and thats good for me because the rom I just found is titled 81304b2de707.signed-passion-**GRI40**-from-**FRG83G**.81304b2d.zip   - The first letter of those 3 letter codes indicates the major release. This one takes me from **F**royo to **G**ingerbread)
    
2.  Rename the file to update.zip, and copy it to the root of your SD card (you may need to delete the existing update.zip).
3.  Shut down the phone
4.  Hold the Volume Down Button then Power Button to enter HBOOT. \[caption id="attachment_904" align="aligncenter" width="134" caption="The HBOOT menu can be accessed by starting the phone while holding Volume Down"\][![](https://blog.edwardawebb.com/wp-content/uploads/2011/02/IMG_20110228_194813-224x300.jpg "IMG_20110228_194813")](https://blog.edwardawebb.com/wp-content/uploads/2011/02/IMG_20110228_194813.jpg)\[/caption\]
5.  Scroll to Recovery using the Volume Down button, then press Power Button to select (the Nexus simple will flash for a moment)
6.  The next screen is just an exclamation mark \[caption id="attachment_905" align="aligncenter" width="134" caption="Hold Power and Volume Up to Access Recovery Menu"\][![](https://blog.edwardawebb.com/wp-content/uploads/2011/02/IMG_20110228_194958-224x300.jpg "IMG_20110228_194958")](https://blog.edwardawebb.com/wp-content/uploads/2011/02/IMG_20110228_194958.jpg)\[/caption\]
    1.  Hold  Power Button _then_ press Volume Up (hold for just a second)
    2.  Use the scrollwheel to select  and choose "apply sdcard:update.zip" \[caption id="attachment_906" align="aligncenter" width="150" caption="Select Install SDCard:update.zip from the recovery menu"\][![](https://blog.edwardawebb.com/wp-content/uploads/2011/02/IMG_20110228_195207-150x150.jpg "IMG_20110228_195207")](https://blog.edwardawebb.com/wp-content/uploads/2011/02/IMG_20110228_195207.jpg)\[/caption\]
7.  Let the reboot roll and you're all set! \[caption id="attachment_902" align="aligncenter" width="300" caption="The update will take some time, and may flash the Nexus logo as it reboots, be patient!"\][![](https://blog.edwardawebb.com/wp-content/uploads/2011/02/IMG_20110228_193941-300x225.jpg "IMG_20110228_193941")](https://blog.edwardawebb.com/wp-content/uploads/2011/02/IMG_20110228_193941.jpg)\[/caption\]
