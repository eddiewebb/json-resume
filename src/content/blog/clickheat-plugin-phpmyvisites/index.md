---
title: 'Using ClickHeat plugin for phpMyVisites'
date: Fri, 11 Jul 2008 17:15:21 +0000
draft: false
tags: [clickheat, phpmyvisites, seo, Site News, tutorial]
---

The newest version of phpMyVisites comes with an awesome ClickHeat plugin. Trouble is they have 0 documentation on how to implement the plugin. Below are those details as I discovered the process. Enjoy

[![areas grow 'hotter' the more users click](pagemanager10-299x143.webp "Example ClickHeat results")](pagemanager10.webp)

For all the details in a step by step manner, read on. **To make this easy to understand, there are 4 main parts:** [Activating the Plugin](#activate) [Configuring the Plugin](#configure) [Inserting the JavaScript / Debugging Javascript](#insert) [VIewing the Results](#results)

Activating Plugin
-----------------

1.  Install phpMyVisites and get it working.
2.  Click the 'Administration' link at the bottom of any page. In the left column is a grouping called 'Plugins,' select 'Manage plugins.'
3.  You'll now see a list of plugins, one of which will be ClickHeat.
    *   Select the 'Enabled' checkbox on left.
    *   Select [Menu] and [Pages Viewed] if not already chosen in the middle column.
    *   Click submit.
4.  The plugin is now active!

Configuring ClickHeat
---------------------

1.  Click 'Go to statistics' in the upper right of the screen. (If you use many sites, make sure the one you want to add ClickHeat to is selected.)
2.  Hover over the Pages Viewed menu to reveal the ' ClickHeat - Visitors clicks heatmap' submenu. Choose the ClickHeat menu option.
3.  You should now see a configuration page. Everything can be default except;
    *   Add the allowed domains in the corresponding textbox, no http:// e.g.: example.com,example.org,example.net
    *   Group Names are basically pages. Rather than manually setting the coe for each page you can use some php or javascript to print the url for you dynamically. (if you use CakePHP, you might like this article )
    *   Click the 'Check COnfiguration' button, and if all clear the 'Save Configuration' button.
4.  Configuration is Saved!

Inserting Code into your Site
-----------------------------

If you have followed up to this point you'll be looking at a page that says;

"No logs for the selected period (first think removing filters: browser, screensize). Did you correctly installed JavaScript code on your webpages?"

and at this point, we have not, so go ahead and click the link.

1.  You'll know be shown about 3 lines of Javascript to insert into your pages, **but Wait!**
2.  **You need to insert your full domain to phpMyVisites for the src and clickHeatServer.**
    *   Copy and paste the code into a text editor (notepad or vi)
    *   insert your domain just after _src="_ and just after _clickHeatServer='_
    *   If you have more than one site, verify the site ID in _clickHeatSite=_
    *   Your code should now look like;
        
        <a href="http://www.labsmedia.com/index.html">Open source marketing tools</a>
        
         <!--
        clickHeatSite = 47;clickHeatGroup = 'index';clickHeatServer = 'http://example.com/phpmyvisites/plugins/clickheat/libs/clickpmv.php';initClickHeat(); //--> 
        
3.  Paste the code just above the </body> tag of all your pages to track. Optionally you may add it just under the existing phpMyVisites code on your pages.
4.  Now save your web pages and visit one using the additional parameter _debugclickheat, e.g.; http://example.com/index.html?debugclickheat_
    *   You should be shown a box with the details you entered above.
    *   Try clicking on the page, a 'Server Response' box should say 'OK' If not, you have issues with configuration. Double check everything above and then comment on this page with your details.

Viewing The Results
-------------------

1.  Once again go to the Pages Viewed menu and select ClickHeat.
2.  This time the page should generate a beautiful picture of your site over-layed with the click density map.
    *   No map? Try some more Debugging tips.

Debugging ClickHeat Plugin
--------------------------

1.  Check the log files. log file location is set on the configuration page. there should be a file with todays date, simply listing '104 | 555 | index | firefox' or something similar If so, then the HeatClicks is recording data, check that your viewing the right site id and date range in the url.
2.  visit one of your pages using the additional parameter _debugclickheat,_
    *   _e.g.;_ _http://example.com/index.html?debugclickheat_
    *   You should be shown a box with the details you entered above.
    *   Try clicking on the page, a 'Server Response' box should say 'OK'
    *   If not, you have issues with configuration of the javascript code. Double check everything above and then comment on this page with your details.
