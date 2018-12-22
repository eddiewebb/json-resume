---
title: 'Verify file Checksum in Windows with context menu'
date: Tue, 07 Jun 2011 00:54:47 +0000
draft: false
tags: [checksum, MIsc.Tips, windows]
---

Checking the integrity of a file on a unix node is simple thanks to a confusingly named "checksum" utility. It, oddly enough gives you the checksum of a file. If your stuck on (or just love) windows, you can give yourself the ability to **check any files checksum with the click of a mouse**. \[caption id="attachment_956" align="aligncenter" width="421" caption="Right-Click any file to validate the checksum integrity "\][![Right-Click any file to validate the checksum integrity ](https://blog.edwardawebb.com/wp-content/uploads/2011/06/Capture.jpg "rightclickverify")](https://blog.edwardawebb.com/wp-content/uploads/2011/06/Capture.jpg)\[/caption\]  

### Download Microsoft's FCIV.exe

You can download their unsupported command line utility fciv from the following link, [http://support.microsoft.com/kb/841290](http://support.microsoft.com/kb/841290). If you have another tool, you may substitute and move on.

### Create a simple Batch file

..to run the checksum utility of your choice, and then pause

@echo off
:: edward a webb
:: June 6 2011
:: runs micorsofts fciv command line tool against file and wiats, fort use as context menu
:: https://blog.edwardawebb.com/?p=955
cls
fciv.exe %1
pause

### Drop both onto your PATH

You can either add them to you system variables , or drop them in a folder like <x>:\\windows\\system 32.   I'm lazy and did the latter.

### Add the batch file as an context menu option

Just save the file below, right click and merge into your registry.  It makes any file's right click menu include the value of the first key as the text you'll see, and the value of the second ("command") key, the actual command to be run. Substitute "%1"  for the file (yes use double-quotes escaped in case the file your checking is on a path with spaces).

Windows Registry Editor Version 5.00

\[HKEY\_CLASSES\_ROOT\\*\\shell\\Checksum\]
@="Verify CHecksum"

\[HKEY\_CLASSES\_ROOT\\*\\shell\\Checksum\\Command\]
@="verify-checksum.bat \\"%1\\""

That's it, the changes are effective immediately, so try it out.