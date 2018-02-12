{
    "title":"Happy Hour Command for Slack",
    "contributionUrl":"https://bitbucket.org/eddiewebb/slackbot-happy-hour-lambda",
    "image":"/img/happyhour.png",
    "description":"Queries Google for local establishments meeting specified criteria randomly selecting a match based on reviews and distance.",
    "tags":["Python", "AWS Lambdas", "AWS KMS","REST APIs", "Slack"],
    "fact":"I always pick Brick House anyway..."
}

<p>This was a silly little project to explore Lambdas in AWS. Having deployed some Slack integrations previously the infrequent call/response interacton seemed the perfect fit.  It was happy coincidence that the team had wasted a bit of time the nightbefore deciding where to meet for our weekly happy hour.</p>

<p>The project requires Amazon KMS service to decrypt keys used against Slack and Google APIs used to query local establishments meeting specified criteria randomly selecting a match based on reviews and distance.</p>
