{
    "title":"Enterprise SSH Key Management for Bitbucket",
    "link":"https://github.com/libertymutual/ssh-key-enforcer-stash",
    "image":"/img/bitbucket-keys-thumb.webp",
    "description":"Adds Enterprise Key rotation/enforcement policies to Atlassian Bitbucket.",
    "tags":["Java","Bitbucket","Security","git","jQuery"],
    "fact":"Companies can specify the tolerated age for key expiry/deletion, and users are notified by email to create a new pair.",
    "weight":"150",
    "sitemap": {"priority" : "0.8"},
    "featured":true
}

### Context
The use of SSH keypairs to authenticate against git repos is standard fair for most developers. This functionality came enabled out of the box in Atlassian Bitbucket Server.

### Problem
But company security policy threatened to block this functionality as **the concern of unmanaged and non-expiring secrets was a strict no-no in the enterprise** environment. We needed a solution to track and rotate the keyspairs assigned to developers, and ensure that no single key was alive more than 30 days, and also enforce that there was never more than 1 valid key per developer. 

### Solution
This contribution required understanding of SSH crypto funtionality, Bitbucket's event architecture to augment the vendor's base offering.  The solution seemed valuable to a broader audidence, so I worked through company process to open source the solution, enabling other companies to enforces key rotation and expiry policies for their users and repositories in Atlassian bitbucket.

The plugin introduced a new UI covering the default SSH pages which:
- Listed their existing keys and linked to company policy.
- Generated new keys meeting cipher requirements of the org.
- Provide user the private half (never written to disk!) and instructions to create and secure the file on their machine.
- Warned users via Email for pending expiration
- Purged expited cookies and sent users link to fix it.

![Bitbucket Key Enforcer](/img/bitbucket-keys.webp)