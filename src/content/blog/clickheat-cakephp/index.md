---
title: 'Using Clickheat with CakePHP '
date: Thu, 17 Jul 2008 20:43:21 +0000
draft: false
tags: [CakePHP, CakePHP, clickheat, layouts, visitor tracking]
---

The [Clickheat](http://www.labsmedia.com/clickheat/index.html) software, rocks. Personally I use the plugin for [phpMyVisites](http://www.phpmyvisites.us/downloads.html), but I could understand anyone adopting the standalone package too. CakePHP layouts can be setup to automatically print the most sensible url in each page it loads. This concept will work with any visitor tracking software that has a page or url attribute that is manually assigned. To learn how and see the code, continue reading.

_In /views/layouts/default.ctp;_

params;
if(empty($params\['url'\]\['url'\])) {
	//we need to concat our own url
	$pageWeSee=$params\['controller'\];
	//only append action if not 'info' pages ('index' is hidden in url, and should be hidden here)
	if($pageWeSee!=='info') $pageWeSee.='/'.$params\['action'\];
	//any parmaeterrs we should know about?
	$ps='';
	foreach( $params\['pass'\] as $p){
		$ps.='/'.$p;
	}//end for each
	$pageUrl=$pageWeSee.$ps;
}else{
	//oh how sweet, a fully built url for us
	$pageUrl=$params\['url'\]\['url'\];
}
?>

 [<!--
var a_vars = Array();
var pagename='<?php echo $pageUrl; ?>';

var phpmyvisitesSite = 94;
var phpmyvisitesURL = "http://example.org/phpmyvisites/phpmyvisites.php";
//--> 

<p>Free web analytics, website statistics
<img src="http://example.org/phpmyvisites/phpmyvisites.php" alt="Statistics" style="border:0" />
</p>](http://www.phpmyvisites.net/ "Free web analytics, website statistics")
 

<a href="http://www.labsmedia.com/index.html">Free marketing tools</a>

<!--
clickHeatSite = 93;clickHeatGroup = '<?php echo $pageUrl; ?>';clickHeatServer = 'http://example.com/phpmyvisites/plugins/clickheat/libs/clickpmv.php';initClickHeat(); //--> 

The first section of code determines whether to trust the 'url' parameter, or build the address from controller,action,id . The phpmyvisites and clickheat scripts both make a php call to the completed $pageURL variable.
