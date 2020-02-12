{
    "title":"Fix Performance in Atlassian Bamboo - Deployment Triggers",
    "link":"https://bitbucket.org/atlassianlabs/bamboo-after-deployment-trigger/pull-requests/2/fixes-issue-2-eliminate/diff",
    "image":"/img/deploysonly.gif",
    "description":"Using jQuery and REST APIs enables real-time searching to eliminate large data load.",
    "tags":["Java","jQuery", "Lucene","REST APIs","Bamboo","JSON","Continuous Integration","Continuous Delivery","CI/CD Pipelines"],
    "fact":"Reduce page load time from minutes to instantaneous.",
    "weight":"100",
    "sitemap": {"priority" : "0.8"},
    "featured":true
}

While supporitng Bamboo for ~5,000 users, we noticed really bad performance causing Bamboo to lock users out during the day.

We did some heap dumps and ran profiling to identify a few significant queries that were taking a long time to run and getting hit rather often.  This led us to a configuration page exposed to pipeline admins which ran an intensive backend query on every page load.


I was able to contrast this with the project summary page that loaded significantly faster. Why? -- It used an index.

I submitted a PR to the Atlassian team to have this admin page use the same index only when an admin attempts to change the field value.


**This change reduces page load from from 2+ minutes to nearly instant, with an incredibly responsive UI.**. Because it used a cached index instead of live DB queries it also cut a significant amount of resources to be used by more important tasks like actually running builds!

![gif showing project search UI](/img/deploysonly.gif)
