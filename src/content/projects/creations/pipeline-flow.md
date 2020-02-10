{
    "title":"Pipeline Flow for Bamboo",
    "link":"https://marketplace.atlassian.com/plugins/com.edwardawebb.bamboo-flow/server/overview",
    "image":"/img/flow-summary-thumb.webp",
    "description":"Enables deployment environments to behave as stages within the pipeline, triggering additional build stages. Also adds sweet visualization.",
    "tags":[
          "Atlassian",
          "Maven",
          "Java",
          "Bamboo",
          "Continuous Integration",
          "Continuous Delivery",
          "CI/CD Pipelines"
        ],
    "fact":"Fan-Out / Fan-In with Bamboo Pipelines",
    "weight":"100",
    "featured":true,
    "sitemap": {"priority" : "0.8"}
}

- [Visualization](#visualization)
- [Deployment Environment Integration](#deployment-environment-integration)
- [Configuring Deployment Integration](#configuring-deployment-integration)



Adds fan-out/fan-in capabilities to Bamboo embedding Deployment Environments as part of the end-to-end flow.


![Sample flow with parallel jobs and staggered deployments](/img/flow-summary.webp)


There are two main components to this plugin; Fancy flow diagram visualization, and ability for builds to embed deployments as intermediate steps.

### Visualization

Bamboo Flow provides a "railroad diagram" style view of all build and deployment details,
whether the specific plan is using Bamboo Flow to control deployment integration or not.

![Visualize flow for all projects](/img/flow-parallel.webp)

Bamboo Flow will also show a much smaller visualization of the latest build in the Plan Overview heading.

![Visualize flow for all projects](/img/latest-breadcrumb.webp)

These features are automatically enabled, and requires not additional configuration. You can disable the Plugin Modules to disable either of them

### Deployment Environment Integration

Bamboo Flow allows linked deployment project environments to be embeded not as a final stage, but
a step within the build process, triggering additional downstream build stages.


![Visualize flow for integrated project](/img/flowtasksummary.webp)

This feature requires plans to be configured as described below.

### Configuration

Flow diagrams are enabled by default for all projects. These steps are only necessary to embed deployments as stages within a pipeline, triggering additional build stages on their completion.

1. Create all build plan stages and jobs as you normally would **
1. For any *stage* that should wait for deployment environments, [mark them as manual](https://www.google.com/search?q=bamboo+manual+stages&oq=bamboo+manual+stages)
![Configure plan with manual stages](/img/plan-config.webp)
1. Create deployment Project and Environments as you normally would
1. For any Deployment Environment that should run before build plan stages from #2:
   1. Add the "After Successful Stage" trigger, and select the previous stage
   ![Add "After Stage" trigger to environments](/img/env-trigger.webp)
   1. Add the "Bamboo Flow" task to that environment (order does not matter, it acts as a flag)
   ![Add "Continue Flow Task" to environments](/img/flowtask.webp)


** Jobs run in parallel, stages run sequentially
