#!/bin/bash

main(){
  local uri="$1"
  local input_path="$2"
  local output_path="$3"

  local files=( $(find $input_path -type f -name *.html) )

  for file_path in "${files[@]}"; do
    local file_rel_path="${file_path/$input_path\//}"
    mkdir -p "$(dirname "$output_path/$file_rel_path")"
    sed -e "s%=\"/assets%=\"$uri%" "$input_path/$file_rel_path" > "$output_path/$file_rel_path" 
  done
}

main "$@"
