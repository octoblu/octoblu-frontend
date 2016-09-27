#!/bin/bash

script_path="foo"
kronkless="$(sed -e 's/\/kronk//' <<< "${script_path}")"

echo ${kronkless}
