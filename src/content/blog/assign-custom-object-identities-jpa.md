---
title: 'Assign Custom Object Identities with JPA'
date: Mon, 30 Nov -0001 00:00:00 +0000
draft: false
tags: [java, Java, jpa, persistence]
---

JPA provides the ability to assign primary keys automatically out of the box. Unfortunately the only strategies JPA provides rely on the database, or sequence tables to manage ids. But **if you want to assign your own ids from a id service, or cycles of the moon it can be done. Any possible way you can think of to get a unique ID, you can use with JPA.** This article introduces a custom jpa sequence generator for JPA.  My implementation is OpenJPA, but this is part of the standard JPA 1.2 specification.

The Problem
-----------

None of the provides JPA Id generation strategies meet our needs. We do not want to have to set each object's @Id field manually (although we could ). **We need a way to tell JPA to use a custom id generator or strategy.**

The Solution
------------

We can **write a custom class that will be called by JPA on inserts to automatically assign values to all Id or Identity fields**.

### My Unique ID Source - an Object ID web service

My source is a web service provide by random.com that provides a globally unique object id that I can migrate across all my databases and maintain historically unique ids for all records. I access that through the sample singleton below. This is not required by JPA, but just provides an example to leverage external sources. You can easily use any source of Ids. The two methods to note are getNextId() and getMoreIds()

### My sequencer or sequence generator class

This is the class that JPA cares about. It must respect the interface laid-out by the JPA spec for a sequencer class.  Even so, the only two you really need to obey are the getcurrentid, and getnextid.  I highly recommend you also implement the allocate method to efficiently assign a specified range of ids. This can dramatically increase batch insert performance.

### Sample Entity Annnotations for Custom Identity Field

Next we tell each entity to use the SEQUENCE id generation strategy to generate the unique Ids.  The name we pass is always "system" which we set later in the persitence.xml. BONUS: you could, for whatever reason, use different strategies for particular entities. Maybe only user payouts need a globally unique id..  Just specify each individual sequence class instead of system.

### Sample Persistence.xml to declare the custome id generator

The only secret here is to set the system property for our custom class. Again this is only if you have one custom sequencer. To use multiple classes you will need to specify the fully qualified class name (including "()" even if not required) with each entity for the Sequencer name. If you do specify one here it will be available under the name "system" for any entity that declares it.