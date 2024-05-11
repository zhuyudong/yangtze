#!/bin/bash

# FIXME
# NOTE: 遍历指定目录下的文件，生成文件名映射关系
file_map=""
for file in '$(pwd)/src/components/*'; do
  if [ -f "$file" ]; then
    old_filename=$(basename "$file")
    new_filename=$(echo "$old_filename" | tr '[:upper:]' '[:lower:]')
    file_map="$file_map$old_filename:$new_filename\n"
  fi
done

# NOTE: 将文件名映射关系写入临时文件
echo -e "$file_map" >file_map.txt

# NOTE: 读取临时文件中的映射关系，并执行 git mv 命令
# while IFS=: read -r old_filename new_filename || [[ -n "$old_filename" ]]; do
#   git mv "$old_filename" "$new_filename"
# done <file_map.txt

# NOTE: 删除临时文件
# rm file_map.txt
