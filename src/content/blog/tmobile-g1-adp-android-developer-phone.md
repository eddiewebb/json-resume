---
title: 'T-Mobile G1 to ADP (Android Developer Phone)'
date: Thu, 08 Apr 2010 21:24:40 +0000
draft: false
tags: [adp, android, g1, Nexus One, Site News]
---

So I purchased a G1 from t-mobile when they were reasonably new, and have since was kindly donated a nexus one (best phone ever).   **But what to do with my old G1?   Obvi -  turn it into an Android Developer Phone** that I can run without a sim card, and test my apps on anything faster than the emulator.   Not to mention the value of actual phone, accelerometer and leds. I know G1's are locked, hence I took the action as a good citizen and called T-Mobile. **Turns out if you have the phone for 90 days then they will just give you the Unlock Code.** So I naively thought that would allow me to wipe the phone, and run sans sim.  Wrong.  **Turns out that you only get the unlock prompt if you have a foreign sim card.  But if I use a bunk sim, I wont have a data connection, and could not get past registration.** I ended up with a useless piece of hardware that would do nothing but report the absence of a sim card. Let me share a few other highlights:

*   ADP "Dream" images can not be flashed to G1s due to signature issues of boot loader UNLESS
*   You can root your phone and use sqlite to modify some system settings to bypass the protection HOWEVER
*   Only RC29 or earlier OS releases have the vulnerability allowing this, mine did not BUT
*   You can supposedly downgrade the image to RC29, root the phone and  flash thereafter UNFORTUNATELY
*   This just seems like a ridiculous way to get any functionality of a device I paid for and T-Mobile is willing to let me unlock anyhow

So I took a simpler approach. **SInce I am still a t-mobile customer with a data plan I just pulled my sim from the Nexus ONe, back into my G1, and registered a new bogus user.** After the user is registered I turned on wifi, and usb debug, then restarted. After the restart I turned off the phone to remove the sim. (my first attempt of removing sim without a clean reboot resulted in a no sim card lockout)  This way I can still lend the device to a co-worker as a dev phone, without worrying about my info. **So if any of you happen to have a legit way to bypass the sim card lockout and enter the htc/t-mobile provided unlock code to permanently eliminate the need for a sim card, please share.**