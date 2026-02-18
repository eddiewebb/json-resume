---
title: 'Earning my Technician Amateur Radio Operator'
date: 2026-02-18
draft: false
weight: 1
featured: true
tags: [hobby, radio, ham, diy]
---

I recently joined members of "the greatest hobby in the world" - an amateur radio operator.  I earned my Technician class operator license about a month back, fulfilling an interest I had way back as child.  My official FCC assigned callsign is `KE2HOA`.

### Technician Class License

Technician is the intial / entry level class for operators, allowing limited operation across lower frequency ranges. As my experience grows I plan to pursue the General class to expand my access to those larger bands.  (Band size is inverse to Frequency)

### First Radio

Of course what good is a driver's license without a car, and the same can be said to radio operation, you need a radio!

I bought a cheapo radio that had decent ratings from an online retailer specializing in amateur radio equipment. It's a TyTech TH-9800 Plus.  It's a 'mobile' unit meaning it's intended to be installed in a vehicle, and that's just what I did.

#### Vehicle Install

The first step was installing the radio inside my truck. And while you can get power adapters for the cigarette outlet, and magnetic mounts for the antenna, I decided I wanted to do it "right" and go for a cleaner install. 

##### External Antenna

The antenna is mounted externally, which means you need to get it passed into the interior somehow. Slamming the door on a loose cable was not an option, so I did some research and found trucks like mine have a spare grommet installed at the factory. 

{{< imgresize "assets/grommetseated.webp" "600x400" "spare grommet under back seats" >}}

I punched a small hole that allowed me to strech the connector of the RG-58 through with a nice seal.

{{< imgresize "assets/grommethole.webp" "600x400" "grommet sealing coaxial cable" >}}

I was then able to conceal that cord underneath the carpet below the seats, and over to the side channels where I ran it up to the front seat.  My radio has a neat feature allowing the faceplate to be detached, and installed elsewhere.  This means I was able to hide the big bulk part of the radio under my drivers seat, and sneak a small cat6 cord up to the faceplate on my center console.

{{< imgresize "assets/rearchannel.png" "600x400" "antenna cable stealthily hidden" >}}


#### Power Supply

With antenna solved, I also needed to run power. These little radios draw a surprising amount of juice, 10-12 amps for my model. So I needed a dedicated tap with fuse just for the radio.  Fuse taps are a common solution that let you plug into the existing fuse panel, and add a new isolated circuit with it's own fuse.

I pulled those wires from the radio under my seat, and up along the driver's side channel to just under the steering column where that passenger fuse panel lives.

{{< imgresize "assets/powerchannel.webp" "600x400" "power cables fished out from under seat" >}}

#### Close it all up

With the cable run I was able to close up the channels, re-install the plastics under the steering column, and celebrate my hidden radio.  Only the faceplate is visible which I mounted right under my climate control.

{{< imgresize "assets/radio.webp" "600x400" "radio's faceplate installed on center console" >}}

In full disclosure by the time I got to routing the cat6 cable I was loosing steam and I plan to go back and conceal that better to come out through an empty button socket in the console just behind the mount.

### Fighting with Chirp, and friending their team

[Chirp](chirpmyradio.com) is an open source programming solution for radios of all makes and models, that provides a user experience worlds ahead of most OEM software.  

Unfortunately the "plus" in my Th-9800 Plus meant a whole new chipset and memory structure that was not supported by Chirp.  I found an open issue for it, unfortunately it looked like it had not make much progress.  But I followed the the procedures outlined and shared my debug logs with the team. They responded within an hour!

>Eddie, I'm working on a proper module to handle the issue with the last one. I'll post here when I get it done and would very much appreciate help testing it as this effort has stalled out a bit due to that being difficult for the OP.

With a bit more back and forth Dan was able to ship a fix allowing Chirp to work with the new model architecture.  OSS for the win!

> Excellent, thanks very much Eddie, I'll queue this for the next build!

### Learn More

If you're even curious about operating an amateur radio (ham) I would encourage you to checkout ARRL's site which has great info.  [Getting Licensed](https://www.arrl.org/getting-licensed)

/73

KE2HOA