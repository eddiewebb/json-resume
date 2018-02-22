{
  "title": "BOSH release for Bamboo & Remote Agents",
  "date": "2018-02-11T12:41:05-05:00",
  "contributionUrl": "https://github.com/eddiewebb/bosh-bamboo",
  "image": "/img/aafb-agent-ids-match-bamboo.png",
  "description": "Large scale orchestration of Bamboo server, agents and database using BOSH",
  "tags": ["DevOps","BOSH", "Java", "Atlassian Ecosystem", "monit", "python", "xml/xslt", "bash/shell","REST APIs","Continuous Integration","Continuous Delivery","CI/CD Pipelines"],
  "fact": "Single command will scale-up/scale-down without user interuption",
  "weight":"200",
  "sitemap": {"priority" : "0.8"},
  "featured":true
}

BOSH (Bosh Outer SHell) "...<em> is an open source tool for release engineering, deployment, lifecycle management, and monitoring of distributed systems.</em>" And it's amazingly powerful. This examples uses BOSH to provision an Alassian vendor app running on JDK along with the support Postgres database and agents to support it.  The releases manages the health of services and will automatically provision, start/stop processes across the various services.

Another aspect of the **Remote Agents API** is that agents can initiate self-healing or updates on their own schedule, coordinating any outage with the master server to prevent loss of capacity across the build farm.
