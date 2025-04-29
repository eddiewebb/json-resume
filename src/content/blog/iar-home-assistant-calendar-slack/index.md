---
title: Setting Slack Status from IamResponding (IaR)
date: 2024-04-24 08:00:00
tags: [firefighter, vfd, volunteer, home-assistant]
featured: true
weight: 1
resources:
    - name: iar
      title: Marketing Screenshot for IaR
      src: assets/iar.webp
    - name: eddie
      title: Eddie standing behind parked pump truck 276. 
      src: assets/eddietruck.jpg
    - name: mailbox
      src: assets/mailbox.png
    - name: imap_int
      src: assets/imap_int.png
    - name: imap_rule
      src: assets/imap_rule.png
    - name: slack
      src: assets/slack.png
---
{{< floatimg "eddie" "350x350" "Eddie standing behind parked pump truck 276, Taz" "right" >}}

As a volunteer firefighter I may be called to duty during work hours, and wanted a way to quickly notify my team with a calendar and slack status.

- IaR (I Am Responding)
- Home Assistant
- Google Calendar
- Slack

#### Firefighter?

Yeah! Sorry that probably deserves it's own post, why and when. But I'm a member of our local Volunteer Fire Department, which is staffed by a collection of local residents giving back. Honored to be amongst them.  Also, fire departments across the country need more members, so [considering joining your local department](https://makemeafirefighter.org/), there is a job for everyone!



<!--more-->

- [Intro and Context](#intro-and-context)
  - [What is I am Responding?](#what-is-i-am-responding)
  - [What is the Goal?](#what-is-the-goal)
  - [What's the challenge?](#whats-the-challenge)
- [The Solution:](#the-solution)
  - [Mixing several tools to achieve the goal](#mixing-several-tools-to-achieve-the-goal)
- [The Implementation](#the-implementation)
  - [Setting IaR to send emails](#setting-iar-to-send-emails)
  - [Home Assistant Email Triggers](#home-assistant-email-triggers)
    - [Home Assistant Action - Create Calendar Event](#home-assistant-action---create-calendar-event)
  - [Clockwise or Slack Calendar App to sync](#clockwise-or-slack-calendar-app-to-sync)


### Intro and Context



#### What is I am Responding?

[IamResponding (IaR)](https://www.iamresponding.com/) is a platform for first responders to connect them with incidents, provide details, manage schedules, and importantly indicate when they are able to respond.  This is especially important for Volunteer Firefighters and EMS where availability can vary widely over the course of a day or week.   IaR lets the dispatcher notify everyone, and let's the command officers know who's coming before they send the response team to the scene.

{{< imgresize "iar" "350x350" "Marketing Screenshot for IaR" >}}

#### What is the Goal?

IaR allows me to automatically send a text to my wife when I respond to a fire call. With a single action on my phone I can notify my Fire Chief, my fellow members, and my family that I am leaving wherever I am to respond to the fire station.  

I also work remotely, with a flexible schedule.  THis makes me an ideal VFD member since I can respond during business hours, but it may impact planned meetings with my team or partners.  Rather then shuffling my calendar, and setting my Slack status to OOO, I devised a way to let [Home Assistant](https://www.home-assistant.io/) notify folks for me.

1. Put Out Of Office notice on calendar.
2. Put Out of Office status on Slack.


#### What's the challenge?

Two main challenges I ran into:
1. The only trigger or event that IaR will emit is its ability to send emails on response. No public API exists.
2. Slack's API needs custom app approved by company which too much overhead to set one employee's status.



### The Solution: 


#### Mixing several tools to achieve the goal
With a mix of IaR, Home Assistant, Email, Google Calendar and existing Slack Apps we can achieve this.

1. Eddie receives pager alert
2. Eddie reviews incident details on his phone (we share Fire/EMS duties and I am not EMS)
3. Eddie clicks "I am Responding" in the app.
4. IaR notifies:
   1.  dispatch and other VFD members
   2.  Eddie's wife via a text message
   3.  Email monitored by home assistant
5.  Home Assistant reads email
    1.  Sets a new event on my Google Calendar
6.  Slack's Google Calendar (Clockwise also works) turns my meeting into a OOO status on Slack.


### The Implementation

#### Setting IaR to send emails
 
Pretty straightforward, just add the email address to user profile to send to.  The only caveat for me, which is optional, was that I setup a dedicated email address for this.  If you choose an existing address you will just need to add more filters in home Assistant later.

{{< imgresize "mailbox" "350x350" "Eddie standing behind parked pump truck 276, Taz" >}}

#### Home Assistant Email Triggers

The [IMAP integration in Home Assistant](https://www.home-assistant.io/integrations/imap/) let's us respond to new emails.  In my case it's any new email, but filters (as automation conditions) can be added to only act on ones from IaR.

{{< imgresize "imap_int" "350x350" "Eddie standing behind parked pump truck 276, Taz" >}}

THe integration exposes a trigger as a customer event, and also a service I can use to delete the incoming email. 

{{< imgresize "imap_rule" "650x650" "Eddie standing behind parked pump truck 276, Taz" >}}

##### Home Assistant Action - Create Calendar Event

My HA instance uses the [Google Calendar integration](https://www.home-assistant.io/integrations/google/) to sync events from personal and work calendars. So I can fire an action to add a new event, marking me offline.

```yaml
action: calendar.create_event
metadata: {}
data:
  summary: "On Fire Call (Out of Office) 🧑‍🚒"
  description: >-
    I am out of office responding to an incident for my local Volunteer Fire
    Department
  # starting in 1 minute
  start_date_time: "{{ (now()+timedelta(minutes=1)).strftime('%Y-%m-%d %H:%M:%S') }}"
  # lasting 3 hours
  end_date_time: "{{ (now()+timedelta( hours=3)).strftime('%Y-%m-%d %H:%M:%S') }}"
target:
  entity_id: calendar.eddie_work
enabled: true
```

#### Clockwise or Slack Calendar App to sync

Both Google Calendar (for slack) and Clockwise worked for this.  They will see the calendar event and update your status automatically.


{{< imgresize "slack" "650x650" "Slack Status indicator reading 'Out of Office, Responding to Fire Incident'" >}}