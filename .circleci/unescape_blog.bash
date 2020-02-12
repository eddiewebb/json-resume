#! /bin/bash


DIR=${1:-"src/content/blog"}
for file in ${DIR}/*/index.md; do	
	path=${file%/*}
	echo $path
	mv "$file" "${path}/unescaped.md"
	while IFS= read line;do 
		echo "$line"
	done < "${path}/unescaped.md" > "$file"
	rm "${path}/unescaped.md"
done


#grep -oh "\(https://blog.edwardawebb.com/wp-content/uploads/[A-Za-z0-9/_-]*\.png\)" src/content/blog/keys-putty-cygwin-passwordless-login-ssh-scp.md 
