# Data Fed resume

Created from [Start Bootstrap - Resume](https://startbootstrap.com/template-overviews/resume/), augmented with Handlebars for dynamic data entry.

Published via CI pipelines to [Eddie's Website](https://edwardawebb.com), current status: [![CircleCI](https://circleci.com/gh/eddiewebb/json-resume.svg?style=svg)](https://circleci.com/gh/eddiewebb/json-resume)


## Technology & Setup

The primary technology is HTML5 and CSS3 to create a static webpage.  Rather than copy and paste the same formatting used for multiple projects, experiences and others, I dropped the data into json files, and have a single template in HTML.  Using Handlebars to render multiple instances of the template as needed.

### Data files

[/data/skills.js](/data/skills.js)
[/data/projects.js](/data/projects.js)
[/data/contributions.js](/data/contributions.js)
[/data/experience.js](/data/experience.js)
[/data/publications.js](/data/publications.js)

### Sample template

```html
<script id="contributionsTemplate" type="text/x-handlebars-template">
    {{#each this}}
        <h3>{{this.name}}</h3>
        <h5><a href="{{this.link}}">{{this.link}}</a></h5>
        <p>{{{this.summary}}}<p>
        {{#if this.image}}
            <img src="{{this.image}}" style="max-height:300px;"/>
        {{/if}}
        <span class="project-fact">{{this.fact}}</span>
        <ul class="tags">
            {{#each this.tags}}
              <li><a class="tag">{{this}}</a></li>
            {{/each}}
        </ul>
    {{/each}}
</script>
```


## About (from Start Bootstrap)

Start Bootstrap is an open source library of free Bootstrap templates and themes. All of the free templates and themes on Start Bootstrap are released under the MIT license, which means you can use them for any purpose, even for commercial projects.

* https://startbootstrap.com
* https://twitter.com/SBootstrap

Start Bootstrap was created by and is maintained by **[David Miller](http://davidmiller.io/)**, Owner of [Blackrock Digital](http://blackrockdigital.io/).

* http://davidmiller.io
* https://twitter.com/davidmillerskt
* https://github.com/davidtmiller

Start Bootstrap is based on the [Bootstrap](http://getbootstrap.com/) framework created by [Mark Otto](https://twitter.com/mdo) and [Jacob Thorton](https://twitter.com/fat).

## Copyright and License

Copyright 2013-2018 Blackrock Digital LLC. Code released under the [MIT](https://github.com/BlackrockDigital/startbootstrap-resume/blob/gh-pages/LICENSE) license.
