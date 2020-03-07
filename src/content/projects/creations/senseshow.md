{
    "title":"LED Energy Show",
    "link":"https://github.com/eddiewebb/sense-show",
    "image":"/img/senseshow-thumb.webp",
    "description":"Using python on a Raspberry Pi Zero to visualize energy flow of solar panels to grid.",
    "tags":[
          "Python",
          "Raspberry Pi",
          "Making"
        ],
    "fact":"LED Panel is actually a linear array using fun math to create coordinates and collision detection.",
    "weight":"210",
    "sitemap": {"priority" : "0.8"},
    "featured": true
}



This was a fun project that allowed me to explore GPiO, threading, service management and more.  The python script runs a system service. Inside the script a loop is reading real-time data from Sense Energy Monitoring and pushing that onto a FIFO queue read by a threaded process to present information on the LED panel and monoschrome display.

{{< youtube Jnkek4CRb7w >}}

