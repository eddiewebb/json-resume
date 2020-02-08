{
    "title":"Atlassian Deployment Triggers",
    "link":"https://bitbucket.org/atlassianlabs/bamboo-after-deployment-trigger/pull-requests/2/fixes-issue-2-eliminate/diff",
    "image":"/img/deploysonly-thumb.webp",
    "description":"Using jQuery and REST APIs enables real-time searching to eliminate large data load.",
    "tags":["Java","jQuery","REST APIs","Bamboo","JSON","Continuous Integration","Continuous Delivery","CI/CD Pipelines"],
    "fact":"Reduce page load time from minutes to instantaneous.",
    "weight":"100",
    "sitemap": {"priority" : "0.8"},
    "featured":true
}

Addressed pretty significant page load performance issue found in larger deployments. Eliminates uses of intensive backend query, replacing it with an asynchronous API call against a lucene index. This change reduces page load from from 2+ minutes to nearly instant, with an incredibly responsive UI.
