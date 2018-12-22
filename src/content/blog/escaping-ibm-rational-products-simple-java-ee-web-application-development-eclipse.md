---
title: 'Escaping IBM Rational Products: Simple Java EE Web Application Development with Eclipse'
date: Mon, 30 Nov -0001 00:00:00 +0000
draft: false
tags: [eclipse, ibm, jetty, rad, rational, Site News, tomcat]
---

**If you work for a large enterprise you undoubtedly know the "features" of typical IBM Rational products.** And if you work at a really large enterprise you likely have little freedom for deployments environments beyond Websphere. But that's OK! **For the first post in our cross-blog series "Escaping IBM Rational Products" we look at alternatives to IBM's Rational Application Developer** \- keeping in mind that the result must be a file that can be easily deployed to a Websphere server once ready for production. But we can avoid having to deal with WAS in development (mostly). ...not that constant crashes and consistent use of several gigabytes of memory isn't desirable - no wait, that's extremely undesirable. **We can also save the recurring license costs associated with Rational development tools.**

Get Yourself an Integrated Development Environment
--------------------------------------------------

### Getting Eclipse - the base IDE

First thing is first - IBM's Rational Application Developer is built on the Eclipse Foundation's Eclipse project.. so let's start with a clean (and working) version of Eclipse for Java EE (formerly J2EE). You can d[ownload the latest version "Helios" from the foundation directly](http://www.eclipse.org/downloads/moreinfo/jee.php# "Learn more about Eclipse JEE version") \- FREE! Eclipse is a powerful but lightweight (compared to 4.7 Gigabytes, anything is lightweight..)  IDE that is easily extended for various languages and platforms. **We may suggest a folder dedicated to development applications.** For these examples we will be using our company issues machines that use windows, so we create a new directory: C:\\Apps Edit the security on the new folder and give yourself full permissions. This will allow you and eclipse to modify the files and launch servers as needed. Extract the entire Eclipse folder under your apps directory, the result should look  similar to this:

\[caption id="attachment_781" align="aligncenter" width="186" caption="Custom Development Directory"\][![](https://blog.edwardawebb.com/wp-content/uploads/2010/06/apps.png "Custom Development Directory")](https://blog.edwardawebb.com/wp-content/uploads/2010/06/apps.png)\[/caption\] (Don't worry about the folders that are crossed out.. we'll get there.) At this point you can make a shortcut of  the eclipse.exe file found in the root and move it to your desktop/start menu/quick launch/etc.

Get Yourself an Application Server
----------------------------------

### Apache Tomcat

Apacht Tomcat is a simple web application server that can handle JSPs and Servlets very well. It is also very well integrated to Eclipse by default. [Hit the apache site](http://tomcat.apache.org/ "Visit the Apache Tomcat site for downloads and details.") and download the latest version (Version 6.x as of this writing). You'll want to grab the "binary distribution" for whatever version you choose. Again you will just want to extract the entire package under your "apps" directory. (nope, no need to run or configure anything, just extract..)

### Running Eclipse

Now that we have an application server, and IDE we can hook them together. **Start by launching eclipse.exe, or the shortcut you made earlier.** When you launch it you'll see the new welcome screen in Helios: \[caption id="attachment_782" align="aligncenter" width="300" caption="Eclipse Welcome Screen"\][![Eclipse Welcome Screen](https://blog.edwardawebb.com/wp-content/uploads/2010/06/new_eclipse-300x231.jpg "Eclipse Welcome Screen")](https://blog.edwardawebb.com/wp-content/uploads/2010/06/new_eclipse.png)\[/caption\] You can explore the new features, or click "Workbench" in the upper right to get to work! (do it..)

### Connecting with Tomcat (or other Application Server)

**! You will need to do this to even code JEE applications!  A JRE alone is not sufficient !** Once on the workbench, you should see the perspectives you're familiar with from RAD.

1.  IN the bottom view make sure the servers tab is selected.
2.  right-click in the empty box and choose New..  > server \[caption id="attachment_784" align="aligncenter" width="300" caption="Add new Server "\][![Add new Server ](https://blog.edwardawebb.com/wp-content/uploads/2010/06/servers-300x240.png "servers")](https://blog.edwardawebb.com/wp-content/uploads/2010/06/servers.png)\[/caption\]
3.  From the resulting dialog expand the Apache heading and choose the Tomcat version that matches your download.[![Choosing Tomcat as the Application Server for Eclipse](https://blog.edwardawebb.com/wp-content/uploads/2010/06/newservers-220x300.jpg "Choosing Tomcat")](https://blog.edwardawebb.com/wp-content/uploads/2010/06/newservers.png)
4.  Click Next again, and Finish.

Nice! now Eclipse will use Tomcat to launch web applications locally, but we still need to import the JEE Runtimes from tomcat.

### Adding your Server's Runtime  ( The stuff that makes JEE work!)

1.  From the Windows menu option select Preferences
2.  In the dialog that appears, expand "Servers" and under than choose "Runtimes" \[caption id="attachment_786" align="aligncenter" width="300" caption="Setting Server Runtimes"\][![](https://blog.edwardawebb.com/wp-content/uploads/2010/06/server_runtimes-300x217.jpg "Setting Server Runtimes")](https://blog.edwardawebb.com/wp-content/uploads/2010/06/server_runtimes.png)\[/caption\]
3.  Click the Add button on the right, and choose your Application Server (Tomcat) \[caption id="attachment_787" align="aligncenter" width="286" caption="Choose your Application Server"\][![](https://blog.edwardawebb.com/wp-content/uploads/2010/06/chosed-286x300.jpg "Choose your Application Server")](https://blog.edwardawebb.com/wp-content/uploads/2010/06/chosed.png)\[/caption\]
4.  On the next screen, browse to the path of Tomcat (should be under your Apps folder) \[caption id="attachment_788" align="aligncenter" width="286" caption="Configure your Server Runtime Path"\][![Configure your Server Runtime Path](https://blog.edwardawebb.com/wp-content/uploads/2010/06/path-286x300.jpg "Configure your Server Runtime Path")](https://blog.edwardawebb.com/wp-content/uploads/2010/06/path.png)\[/caption\]
5.  Click Finish

Woohoo - Start Building!
------------------------

By this point you have a base environment ready for new web applications and a local deployment server to host them. You can test it out by making a dead simple web app:

1.  From the File menu choose New > Dynamic Web Project
2.  Enter a project name "basicWeb"
3.  on the same page, click "add project to EAR" and name it basicEAR \[caption id="attachment_797" align="aligncenter" width="221" caption="Notice the J2EE module. Must NOT be 3.0 to support Tomcat"\][![Creating a new Web Application](https://blog.edwardawebb.com/wp-content/uploads/2010/06/newweb1-221x300.png "Creating a new Web Application")](https://blog.edwardawebb.com/wp-content/uploads/2010/06/newweb1.png)\[/caption\]
4.  click next
5.  click next
6.  Check "generate a web.xml deployment descriptor", click Finish. \[caption id="attachment_791" align="aligncenter" width="254" caption="Generate your Descriptor!"\][![Creating Web Applications in Eclipse](https://blog.edwardawebb.com/wp-content/uploads/2010/06/generate-254x300.jpg "Generate your Descriptor!")](https://blog.edwardawebb.com/wp-content/uploads/2010/06/generate.png)\[/caption\]

Your new project exists, but doesn't do much, so we can add a simple HelloWorld servlet.

1.  Right-click on the project and choose new > Servlet \[caption id="attachment_792" align="aligncenter" width="300" caption="New Servlet"\][![New Servlet](https://blog.edwardawebb.com/wp-content/uploads/2010/06/servelt-300x240.png "New Servlet")](https://blog.edwardawebb.com/wp-content/uploads/2010/06/servelt.png)\[/caption\]
2.  in the resulting dialog enter "servlets" as the package, and HelloWorld as the class \[caption id="attachment_793" align="aligncenter" width="300" caption="Name your Servlet"\][![Name your Servlet](https://blog.edwardawebb.com/wp-content/uploads/2010/06/servelt_details-300x246.jpg "Name your Servlet")](https://blog.edwardawebb.com/wp-content/uploads/2010/06/servelt_details.png)\[/caption\]
3.  on the next screen, you may uncheck "doPost" as this servlet is basic
4.  Click Finish

Now you should have a new servlet under the src directory.  Make the code should look similar to this:

package servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/\*\*
 \* Servlet implementation class HelloWorld
 */
public class HelloWorld extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /\*\*
     \* Default constructor. 
     */
    public HelloWorld() {
        // TODO Auto-generated constructor stub
    }

	/\*\*
	 \* @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		PrintWriter out = response.getWriter();
		out.println("Hello World");
	}

}

OK, now finally, finally we can launch it... Right-Click on the new servlet and choose Run As.. > Run on Server \[caption id="attachment_794" align="aligncenter" width="300" caption="Running a Servlet"\][![Running a Servlet](https://blog.edwardawebb.com/wp-content/uploads/2010/06/runas-300x240.png "Running a Servlet")](https://blog.edwardawebb.com/wp-content/uploads/2010/06/runas.png)\[/caption\] In a few seconds you should be looking at the result:

### Disclaimer

> The Rational Application Developer name and other respective trademarks are the property of IBM. The opinions expressed in this article are not endorsed by IBM or any other vendors .. they are just opinions.