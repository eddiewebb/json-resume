---
title: 'Renaming CakePHP template file extensions for 1.2'
date: Tue, 22 Jul 2008 12:16:39 +0000
draft: false
tags: [CakePHP, CakePHP, linux, linux, upgrading]
---

A good many people have hit the CakePHP group asking what needs to be done to upgrade from 1.1. to 1.2. I imagine the most painful changes are the loss of $html helper calls in the views, and $this->generateList calls in controllers. $form helper will handle all the deprecated html calls, and $this->Model->find('list'); will handle select boxes. Of course most people notice immediately that templates and layouts no longer use .thtml extensions. **If your running Linux, changing all the template extensions from thtml to ctp is a breeze.** Just use the bash file below in your views directory. It is worth noting this script **will rename any extension to any new extension on all matching files in a directory**. It is not limited to CakePHP, that is merely the need that begat its creation. If no files match in a particular directory a message is printed; otherwise files are listed and renamed. _renameExt_

#!/bin/bash
#script by edward a webb
\# https://blog.edwardawebb.com
 
#renames files recursively based on old and new extensions passed into the script.
#lists files that match or prints no match message for each sub-directory

if \[ $# -ne 3 \]
then
	echo "Usage: $0 dir\_name old\_ext new_ext "
	exit 1
fi
OEXT=$2
NEXT=$3
TOPD=$1 
DIRS=\`ls $TOPD\`
pushd $TOPD >/dev/null
for DIR in $DIRS
do
	if \[ -d $DIR \]
	then
		pushd $DIR >/dev/null 2&>1
		echo NOW IN: $DIR;echo " "
		FILES=""
		FILES=\`ls *.$OEXT 2>/dev/null\`
		dummy=\`echo $FILES | cut -d" " -f1\`
		if \[ $dummy \]
		then
			echo "	Files to rename";echo " "
		else
			echo "	No files with extension .$OEXT"
		fi
		for FILE in $FILES
		do	
			if \[ -f $FILE -a -w $FILE \]
			then 
				NAME=${FILE%.*}
				echo "		$NAME"
				mv $FILE $NAME.$NEXT
			fi
		done
		echo " "
		popd >/dev/null 2>&1
	fi
done

The script can be saved anywhere, and requires 3 parameters, the directory, the old extension, and the new one. Example

\# ./renameExt /srv/www/cake/app/views thtml ctp

Leave out the hash(#) that represents your 'nix command prompt..duh. And as Peter points out, don't use periods '.' in the extensions, just the letters.