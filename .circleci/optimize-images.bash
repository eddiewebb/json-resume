#! /bin/bash

#
# webp all the images!
#


for file in src/static/img/*; do
 newname="${file%.*}.webp"
 cwebp -q 50 "${file}" -o "${newname}"; 
 cwebp -q 50 "${file}" -resize 300 0 -o "${file%.*}-thumb.webp"; 
 find . -type f -name '*.md' | xargs sed -i '' 's#'${file#"src/static/img"}'#'${newname#"src/static/img"}'#g'
done