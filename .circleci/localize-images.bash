#! /bin/bash


DIR=${1:-"src/content/blog"}
CDIR=${2:-"/tmp/blog.edwardawebb.com/wp-content/uploads/"}
for file in ${DIR}/*.md; do	
	ign="${file##*/}"
	newdir="${DIR}/${fil%.md}"
	 mkdir -p "${newdir}"

	 images=$(grep -oh "\(https://blog.edwardawebb.com/wp-content/uploads/[A-Za-z0-9/_-]*\.png\)" $file)
	 for image in $images;do
	 	target="${image##*/}"
	 	echo -e "\t>${target}"
	 	cp ${CDIR}/${image#"https://blog.edwardawebb.com/wp-content/uploads/"} "${newdir}/${target}"

	 	sed -i '' "s#${image}#${target}#" $file
	 	mv "$file" "${newdir}/index.md"
	 done

done


#grep -oh "\(https://blog.edwardawebb.com/wp-content/uploads/[A-Za-z0-9/_-]*\.png\)" src/content/blog/keys-putty-cygwin-passwordless-login-ssh-scp.md 
