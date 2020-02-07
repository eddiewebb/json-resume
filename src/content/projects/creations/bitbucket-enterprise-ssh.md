{
    "title":"Enterprise SSH Key Management for Bitbucket",
    "link":"https://github.com/libertymutual/ssh-key-enforcer-stash",
    "image":"/img/bitbucket-keys.webp",
    "description":"Adds Enterprise Key rotation/enforcement policies to Atlassian Bitbucket.",
    "tags":["Java","Bitbucket","Security","git","jQuery"],
    "fact":"Companies can specify the tolerated age for key expiry/deletion, and users are notified by email to create a new pair.",
    "weight":"150",
    "sitemap": {"priority" : "0.8"},
    "featured":true
}


The use of SSH keypairs to authenticate against git repos is standard fair for most developers. But company security policy threatened to block this functionality as the concern of non-expiring secrets was a strict no-no in the enterprise environment. We needed a solution to track and rotate the keyspairs assigned to developers, and ensure that no single key was alive more than 30 days, and also enforce that there was never more than 1 valid key per developer. This contribution required understanding of SSH crypto funtionality, Bitbucket's event architecture to augment the vendor's base offering.  The solution seemed valuable to a broader audidence, so I worked through company process to open source the solution, enabling other companies to enforces key rotation and expiry policies for their users and repositories in Atlassian bitbucket.
