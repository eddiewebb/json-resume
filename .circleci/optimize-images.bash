#! /bin/bash

#
# webp all the images!
#
DIR=${1:-"src/static/img"}
CDIR=${2:-"src/content"}
for file in ${DIR}/*; do
 newname="${file%.*}.webp"
 cwebp -q 50 "${file}" -o "${newname}"; 
 cwebp -q 50 "${file}" -resize 300 0 -o "${file%.*}-thumb.webp"; 
 find ${CDIR} -type f -name '*.md' | xargs sed -i '' 's#'${file#"src/static/img"}'#'${newname#"src/static/img"}'#g'
done