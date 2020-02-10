#! /bin/bash


DIR=${1:-"src/content/blog"}
CDIR=${2:-"/tmp/blog.edwardawebb.com/wp-content/uploads/"}
for file in ${DIR}/*.md; do	
	ign="${file##*/}"
	newdir="${DIR}/${ign%.md}"
	echo -e "\t>${newdir}"
	mkdir "${newdir}"
	mv "$file" "${newdir}/index.md"

	 images=$(grep -oh "\(https://blog.edwardawebb.com/wp-content/uploads/[A-Za-z0-9/_-]*\.png\)" ${newdir}/index.md)
	 for image in $images;do
	 	tnp="${image##*/}"
	 	target=$"${tnp%.png}.webp"
	 	echo -e "\t>${target}"
	 	#cp ${CDIR}/${image#"https://blog.edwardawebb.com/wp-content/uploads/"} "${newdir}/${target}"

 		cwebp -q 50 "${CDIR}/${image#"https://blog.edwardawebb.com/wp-content/uploads/"}" -o "${newdir}/${target}"; 
	 	sed -i '' "s#${image}#${target}#" ${newdir}/index.md
	 done

done


#grep -oh "\(https://blog.edwardawebb.com/wp-content/uploads/[A-Za-z0-9/_-]*\.png\)" src/content/blog/keys-putty-cygwin-passwordless-login-ssh-scp.md 
