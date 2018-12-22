---
title: 'Getting IP addresses for remote nodes'
date: Thu, 29 Jul 2010 15:14:07 +0000
draft: false
tags: [bash, linux, MIsc.Tips, nslookup, shell]
---

I recently had the need to **get the ip address for a remote node**. Wait, scratch that.. I had to **get the IP addresses for about 60 remote nodes**. You're right... I probably _could have_ typed

nslookup targetNode

60 times. But I am a programmer! **SO I decided to pass my choir off to a shell script.** If you have a similar need, read on! The script is simple, just add all target nodes as a space separated list, and run the file.

#!/bin/bash 
\# author: Edward A Webb (https://blog.edwardawebb.com
\# license: Just use it! its like 10 lines of shell script...

\# add your actual nodes here.....
nodes=( gonzo fenway einstein yogurt toxic babmbi rambo donna INXS etc... )

ips=( ) # placeholder for results

printf "\\t Determing IP addresses for provided nodes \\n ignore these lines...\\n"
for (( i = 0 ; i < ${#nodes\[@\]} ; i++ ))
do
	str=$(nslookup ${nodes\[$i\]} | tail --lines=2 | head --lines=1)
	ips\[$i\]=$(echo $str | cut -f 2 -d " ")
	
done

printf "\\t COMPLETE\\n Here are the results you care about..\\n"

for (( i = 0 ; i < ${#ips\[@\]} ; i++ ))
do
	echo address for ${nodes\[$i\]} is ${ips\[$i\]} | tee -a ip_results.txt
done