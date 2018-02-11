var projectsInventory = [
    {
        "name":"Docker image for Bitbucket CI/CD Pipelines  \"shipit\"",
        "link":"https://hub.docker.com/r/eddiewebb/bitbucket-pipelines-marketplace/",
        "image":"",
        "summary":"Provides required dependencies and additional utilities to simplify and codify the process of building, testing and delivering Atlassian plugins all the way to the live marketplace.<ul> <li>Executes integration/AUT level tests against all stated compatible versions for the product</li><li>Uploads generated artifact to Atlassian marketplace</li><li>Provides corresponding metadata indicating version, release notes, and compatibility</li></ul>",
        "tags":[
              "Docker",
              "Maven",
              "Java",
              "Python",
              "REST APIs",
              "Bash/Shell"
            ],
        "fact":" 700+ \"pulls\" from docker hub"
    },

    {
        "name":"BOSH release for Bamboo & Remote Agents",
        "link":"https://github.com/eddiewebb/bosh-bamboo",
        "image":"img/aafb-agent-ids-match-bamboo.png",
        "summary":"BOSH (Bosh Outer SHell) \"...<em> is an open source tool for release engineering, deployment, lifecycle management, and monitoring of distributed systems.</em>\" And it's amazingly powerful. This examples uses BOSH to provision an Alassian vendor app running on JDK along with the support Postgres database and agents to support it.  The releases manages the health of services and will automatically provision, start/stop processes across the various services.",
        "tags":["DevOps","BOSH", "Java", "Atlassian Ecosystem", "monit", "python", "xml/xslt", "bash/shell","REST APIs"],
        "fact":""
    },

    {
        "name":"Happy Hour Command for Slack",
        "link":"https://bitbucket.org/eddiewebb/slackbot-happy-hour-lambda",
        "image":"",
        "summary":"Queries Google for local establishments meeting specified criteria randomly selecting a match based on reviews and distance.",
        "tags":["Python", "AWS Lambdas", "AWS KMS","REST APIs", "Slack"],
        "fact":"I always pick Brick House anyway..."
    },

    {
        "name":"Atlassian Marketplace Plugins",
        "link":"https://marketplace.atlassian.com/vendors/1017039",
        "image":"",
        "summary":"Multiple plugins used by thousands of teams that provide enhanced functionality of Atlassian’s core products (primarily JIRA and Bamboo) to enrich CI/CD capabilities, DevOps automation, or productivity. Functionality spans user interface, web services and persistence.",
        "tags":["Java", "Spring", "REST APIs", "Javascript", "Atlassian Developer Ecosystem", "Bamboo", "JIRA", "Bitbucket", "Confluence","DevOps"],
        "fact":"1,500+ Active installations across large and small companies."
    }
]
