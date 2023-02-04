---
title: "Double Battery Lifespan with ESP Projects"
date: 2022-09-30T10:31:32-04:00
draft: false
tags: []
featured: false
weight: 1
aliases: []
---


### Background
I've been spending more time (and money) on ESP related projects, and recently solved the "how do I stop sensors from using battery power during deep sleep"

The impact of it may vary, but for a particular adafruit sensor module, which somereason has an led in it also, uses more energy (additional ~3ma) than I'd like. Shutting the sensor down should save about 3.2 milliamps of draw.  For a 2500 mAh 18650 battery, that means 780 hours.


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



{{< floatimg "assets/lux_sensor_inside.jpg" "350x350" "an 18650 batter can plug directly to VIN without regulator" "right" >}}


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

### Controlling run mode from Home Assistant

His post opened my eyes to taking a little more control of the esp's life cycle without any 'code' per se!  We can easily control wheter our esp device is running or awaiting updates, and great for remote deployments.  

I modified his approach (which was switching a light) to focus on reading sensor data.  Rather than calling the loop on boot, I opted for more of an event driven approach.  THe only time we loop is if we're waiting for OTA.  Additionally we allow a long and a slow loop depending on my needs. 


The key aspects of ESPHome's features are `on_boot`, `on_shutdown`, and `on_value` of the sensor components.

### Dynamic sleep intervals to help keep pace

Sometimes we wake up quickly, others days we tend to drag.  Seems the same for my ESP boards. This means the required `run_duration` varies widely, so we dont use it.   In addition to being event driven, the script now no longer loops or calls itself, since the above events will ensure we act as needed if something changes. 

This means we can explicitly decide excactly how long we need to sleep, if at all, and make that call ourselves. If we don't the chip just hums along happily.

### Power saving ESP consumption with MOSFET relay

This part is very simple.  Once wired to the relay/mosfet, just declare the pin and attach it to the `on_shutdown` and `on_start` events.  This ensures we'rew only feeding power to the auxilary devices onces the chip boots.  We set the priority to ensure it occurs just before ESPHome tries to load sensor code.

**I have noted the 3 tricks used in my code below**
1) Dyanamic sleep interval
2) HA Helper to control run mode (thanks Tatham!)
3) Power saver mosfet control

```yaml
esphome:
  name: the-super-saver-sensor
  on_boot:
    priority: 601 #enable power before esp enables sensor
    then:
      - output.turn_on: gpio_d1 #enable sensor (trick 3)
  on_shutdown:
    priority: 710
    then:
      - output.turn_off: gpio_d1 #sleep sensor (trick 3)


#
#  Trick #1 - dynamic sleep duration
#  
#  Since startup, wifi, sensor, and HA sync take anywhere from 2 seconds to 12.
#  So to achieve a 60s or 600s loop we dynamically adjust how long to sleep
#
globals:
  - id: delay_int
    type: int
    restore_value: no
    initial_value: '60'

# we can rely on HA time since we only use it after sensor succesfully publishes (successfully talked to HA)
time:
  - platform: homeassistant
    id: homeassistant_time 

# bus for sensor
i2c:
  sda: D5
  scl: D2
  scan: true
  id: bus_a

sensor:
  - platform: bh1750
    name: "Tent Lux"
    address: 0x23
    update_interval: 5s #10 minute is longest interval
    on_value:
      then:
      - delay: 5s #time to send to HA, i actually dont think we ned this anymore
      - script.execute: consider_deep_sleep
    
    

deep_sleep:
  id: deep_sleep_control
  sleep_duration: 45s #We override this on call

# 
#
# Trick # 2 - allow flag in home assistant to block sleep
#
# Rather than a simple binary though, I opted for a select_helper to give 3 run modes
# - no sleep - 'ota'
# - on the minute - '60s'
# - on the hour - '600s'
# just realized i missed great chance for horrible UI (ota,otm, oth, lol)
text_sensor:
  - platform: homeassistant
    name: Lux Sensor Run Mode
    entity_id: input_select.lux_run_mode
    id: run_mode_select


# Trick 3 - Control sensor power via GPIO connected to mosfet
output:
  - platform: gpio
    pin: D1
    id: gpio_d1



# 
# Main logic, not a loop.   
#
# Called from successful sensor updates to HA.
# Relies on sensor update timing to act as loop triogger for OTA mode
#
script:
  - id: consider_deep_sleep
    mode: queued
    then:
      - if:
          # path 1, we dont have connection to HA yet, so just chill for a bit
          condition:
            lambda:  return id(run_mode_select).state.empty();
          then:
            - logger.log: 'Unknown Setting, do nothing..' #will try again after next sensor read in ~5 seconds
          else:
            - if:
                # path 2 - we have value from HA, and it's OTA mode - no sleep! (also do nothing but diff log)
                condition: 
                  lambda: return strcmp("ota" , id(run_mode_select).state.c_str() ) == 0;
                then:
                  - logger.log: 'Home Assistant Helper set to OTA, do not sleep.'
                else:          
                  - if:
                      # path 3a - okay to loop, set delay to 60s
                      condition: 
                        lambda: return  strcmp( id(run_mode_select).state.c_str(), "60s") == 0;
                      then:
                        - lambda: |
                            id(delay_int) = 60;
                        - logger.log: 'Delay set to 60s'
                      else:                  
                        - if:
                            # path 3b - okauy to loop, set interval to 600s
                            condition: 
                              lambda: return  strcmp( id(run_mode_select).state.c_str(), "600s") == 0;
                            then:
                            - lambda: |
                                id(delay_int) = 600;
                            - logger.log: 'Delay set to 10 min'
                    # path 3 (a&b) - compensate for wifi/HA delays by reducing interval to next even minute/10minute
                  - lambda: |
                      auto now = id(homeassistant_time).now().timestamp;
                      auto timefuture = now + id(delay_int);
                      timefuture -= (timefuture % 60);
                      ESP_LOGI("UGH", "Next target runtime: %d", timefuture);
                      id(delay_int) = timefuture - now ;
                  - logger.log: 'Entering sleep'
                  - deep_sleep.enter: 
                      id: deep_sleep_control
                      sleep_duration: !lambda return id(delay_int) * 1000;   #lambdas should return value as ms
```

