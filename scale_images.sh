#!/bin/bash

do_folder() {
    folder=$1
    if [ -d $folder ];then
        echo "Jumping into $folder"
        cd $folder
        
            for f in *.JPG; do $(mv $f old-${f} && ffmpeg -hide_banner -loglevel error -i old-${f} -vf scale=600:-1 $f && rm old-${f}); done
            for f in *.jpeg; do $(mv $f old-${f} && ffmpeg -hide_banner -loglevel error -i old-${f} -vf scale=600:-1 $f && rm old-${f}); done
            for f in *.jpg; do $(mv $f old-${f} && ffmpeg -hide_banner -loglevel error -i old-${f} -vf scale=600:-1 $f && rm old-${f}); done
            for f in *.png; do $(mv $f old-${f} && ffmpeg -hide_banner -loglevel error -i old-${f} -vf scale=600:-1 $f && rm old-${f}); done

        cd -
    fi
}

for folder in src/content/blog/adv/*; do
    do_folder $folder
    do_folder $folder/assets
done