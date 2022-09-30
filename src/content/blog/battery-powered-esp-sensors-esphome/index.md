---
title: "Double Battery Lifespan with ESP Projects"
date: 2022-09-30T10:31:32-04:00
draft: false
tags: []
featured: false
weight: 1
aliases: []
resources:
    - name: inside
      title: Eddie Webbinaro
      src: assets/headsot.jpg
---


### Background
I've been spending more time (and money) on ESP related projects, and recently solved the "how do I stop sensors from using battery power during deep sleep"

The impact of it may vary, but for a particular adafruit sensor module, which somereason has an led in it also, uses more energy (additional ~3ma) than I'd like.n Shutting the sensor down should save about 3.2 milliamps of draw.  For a 2500 mAh 18650 battery is 780 hours.


| Mode | Draw | Hours |
|------|------|------:|
| ESP8266 (70mA) + Sensor (3.2mA) &nbsp;&nbsp;&nbsp;| 73.2 mA | 34 hours |
| ESP8266 Sleep (20 µA) + Sensor | 3.22 mA | 776 hours |
| ESP8266 Sleep + Sensor Off | 0.02 mA | &nbsp;&nbsp;&nbsp;125,000 hours |

### Math

Now granted I wake up for 15 seconds every minute, thats 75% of the time.

| Sleep Mode | Formula | Runtime |
|---|---|---:|
| Sensor on | `2500 mAh / ( .75 (0.02mA) + .25 (73.2mA) )` | ~136 hours |
| Sensor off | `2500 mAh / ( .75 (3.22mA) + .25 (73.2mA) )` | 120 hours |


The greater the sleep to run ratio, the greater the impact. **For instance sleeping for 9:45 minutes, with 15 second runs.**


| Sleep Mode | Formula | Runtime |
|---|---|---:|
| Sensor on | `2500 mAh / ( .975 (0.02mA) + .025 (73.2mA) ) ` | ~1350 hours |
| Sensor off | `2500 mAh / ( .975 (3.22mA) + .025 (73.2mA) )` | 503 hours |

**That's 268% - almost 3X the lifespan!**


Parts:
- ESP8266
- BH1175 Lux Sensor
- MOSFET (IRF520)
- 18650 Battery



{{< floatimg "assets/headshot.jpg" "350x350" "an 18650 batter can plug directly to VIN without regulator" "right" >}}


## Wiring
The wiring:
- connects sensor's VCC directly to a ESP's power pin
- sensor's GND to the MOSFET `source`.  
- MOSFET's `drain` to GND on ESP/powersource
- MOSFET's `gate` to ESP's GPIO pin ***


*** This is where I wasted a lot of time. The ESP8266 has only 2 pins that will work (GPIO4/5).

As for power, you can literally wire an 18650 + directly to ESP's `VIN` and (-) to ESP's `GND`   I used rubber band to hold the wire on so i can swap out battery while I charge.  You can also buy lovely plastic battery holders pre-wired for like $.50.





## Code

Many thanks to [Tatham Oddie's post](https://tatham.blog/2021/02/06/esphome-batteries-deep-sleep-and-over-the-air-updates/) on using battery power deep sleep on ESP8266.  His basic approach uses a script that acts as a custom `loop` called on boot, and also calling sleep.

**The really cool thing with Tatham's approach is each loop checks with Home Assistant to see if it should stay awake for OTA's instead of sleeping.

His post opened my eyes to taking a little more control of the life cycle without any 'code' per se!  I modified his approach (which was switching a light) to focus on reading sensor data.  Rather than calling the loop on boot, I opted for more of an event driven approach.  THe only time we loop is if we're waiting for OTA.

The key aspects of ESPHome's features are `on_boot`, `on_shutdown`, and `on_value` of the sensor components.

```yaml
esphome:
  name: component-name
  on_boot:
    priority: 601 #enable power before esp enables sensor's at 600
    then:
      - output.turn_on: gpio_d1 #this pin connected to MOSFET gate
  on_shutdown:
    priority: 710 #run after sensors shutdown (600)
    then:
      - output.turn_off: gpio_d1 #disables power to sensor

... # api, etc.

# the pin connected to MOSFET gate, sensor on/off essentially
output:
  - platform: gpio
    pin: D1
    id: gpio_d1

# sensor itself, mine using i2c bus
sensor:
  - platform: bh1750
    name: "Tent Lux"
    address: 0x23
    update_interval: 300s
    on_value: # This is the part that matters. AFTER we get our single read, call the script
      then:
      - script.execute: consider_deep_sleep

deep_sleep:
  id: deep_sleep_control
  sleep_duration: 245s #plus 15s delay in script = 300s
  # NO `run_duration` we call sleep manually

# allow flag in home assistant to block sleep
binary_sensor:
  - platform: homeassistant
    id: prevent_deep_sleep # id used to check here
    name: Prevent Deep Sleep
    entity_id: input_boolean.prevent_deep_sleep #name from home assistant

script:
  - id: consider_deep_sleep
    mode: queued
    then:
      - delay: 15s
      - if:
          condition:
            binary_sensor.is_on: prevent_deep_sleep # binary_sensor above, filled with info from home assitant
          then: # we're not allowed to sleep, call script again
            - logger.log: 'Skipping sleep, per prevent_deep_sleep'
            - script.execute: consider_deep_sleep
          else: # we sent our sensor read and are allowed to sleep, goodnight!
            - logger.log: 'Powering Off'
            - deep_sleep.enter: deep_sleep_control
            # `on_shutdown` at start will shutdown sensor for us.
            # `sleep_duration` determins how long, and then will call 
            # `on_boot` starting all over!

```

