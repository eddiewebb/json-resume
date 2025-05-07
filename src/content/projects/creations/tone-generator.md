{
    "title":"Simple Little Toneout Generator",
    "link":"/tones.html",
    "image":"/img/toneout.png",
    "description":"Generate two tone toneouts commonly used by Fire/EMS. Useful for training and curiosity.",
    "tags":["javascript","jQuery","Firefighter", "toneout"],
    "featured":true,
    "weight":"150"
    
}

### Context
I was programming my Motorola Minitor V Pager and was looking at the various two-tone rules configured.  ANd while I know my [Fire toneout](https://wiki.radioreference.com/index.php/Fire_Tone_Out#:~:text=Fire%2DTone%20Out%20Operation%20allows,and%20long%20group%20tone%20paging.) by ear, I couldn't correlate to the Hz values used by the pager.  I google for a simple tone generator and found a few, but they were all single tone.  Whipped this up in an hour or so.

### Problem
Needed to hear the sound of multiple tone-out values to confirm which was Fire, EMS, and All County, but all pager had was the Hz value, and no means to play samples.

### Solution
Some javascript and use of the [tone.js](https://tonejs.github.io/) library to collect inputs for the two tones, and play them back in the right cadence.  The table allows multiple rows to be added, with optional labels.  A table can also be saved by generating a shareable URL to prefill on next visit.
- Add Rows
- Play Tones
- Generate shareable URL

#### Peru Pager Toneouts
Here's a [link to listen to the 3 toneouts that my local Fire/EMS department uses](/tones.html?1=EMS%2C601.1%2C788.2&2=Fire%2C601.1%2C510.5&3=All+County%2C1251.9%2C510.5) on our pagers as an example.

![Super Simple Toneout Generator](/img/toneout.png)