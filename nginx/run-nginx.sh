#!/bin/bash

SCRIPT_NAME='run-nginx'

assert_required_params() {
  local example_arg="$1"

  if [ -n "$example_arg" ]; then
    return 0
  fi

  usage

  if [ -z "$example_arg" ]; then
    echo "Missing example_arg argument"
  fi

  exit 1
}

debug() {
  local cyan='\033[0;36m'
  local no_color='\033[0;0m'
  local message="$@"
  matches_debug || return 0
  (>&2 echo -e "[${cyan}${SCRIPT_NAME}${no_color}]: $message")
}

err_echo() {
  echo "$@" 1>&2
}

fatal() {
  err_echo "$@"
  exit 1
}

matches_debug() {
  if [ -z "$DEBUG" ]; then
    return 1
  fi
  # shellcheck disable=2053
  if [[ $SCRIPT_NAME == $DEBUG ]]; then
    return 0
  fi
  return 1
}

script_directory(){
  local source="${BASH_SOURCE[0]}"
  local dir=""

  while [ -h "$source" ]; do # resolve $source until the file is no longer a symlink
    dir="$( cd -P "$( dirname "$source" )" && pwd )"
    source="$(readlink "$source")"
    [[ $source != /* ]] && source="$dir/$source" # if $source was a relative symlink, we need to resolve it relative to the path where the symlink file was located
  done

  dir="$( cd -P "$( dirname "$source" )" && pwd )"

  echo "$dir"
}

usage(){
  echo "USAGE: ${SCRIPT_NAME}"
  echo ''
  echo 'Description: ...'
  echo ''
  echo 'Arguments:'
  echo '  -h, --help       print this help text'
  echo '  -v, --version    print the version'
  echo '  -s, --skip-ssl   do not redirect http to https'
  echo ''
  echo 'Environment:'
  echo '  DEBUG            print debug output'
  echo ''
}

version(){
  local directory
  directory="$(script_directory)"

  if [ -f "$directory/VERSION" ]; then
    cat "$directory/VERSION"
  else
    echo "unknown-version"
  fi
}

run_server() {
  local skip_ssl

  skip_ssl="$1"

  if [ "$skip_ssl" == 'true' ]; then
    local ssl_redirect_snippet='if ($http_x_forwarded_proto = "http") { \n return 301 https://$host$request_uri; \n }'
    sed -i'' -e "s|SSL_REDIRECT_HOOK|$ssl_redirect_snippet|" /etc/nginx/nginx.conf
  fi

  cat /etc/nginx/nginx.conf
  # nginx -g 'daemon off;'
}

main() {
  # Define args up here
  local skip_ssl

  while [ "$1" != "" ]; do
    local param value
    param="$1"
    # shellcheck disable=2034
    value="$2"

    case "$param" in
      -h | --help)
        usage
        exit 0
        ;;
      -v | --version)
        version
        exit 0
        ;;
      # Arg with value
      # -x | --example)
      #   example="$value"
      #   shift
      #   ;;
      # Arg without value
      -s | --skip-ssl)
        skip_ssl='true'
        ;;
      *)
        if [ "${param::1}" == '-' ]; then
          echo "ERROR: unknown parameter \"$param\""
          usage
          exit 1
        fi
        # Set main arguments
        # if [ -z "$main_arg" ]; then
        #   main_arg="$param"
        # elif [ -z "$main_arg_2"]; then
        #   main_arg_2="$param"
        # fi
        ;;
    esac
    shift
  done

  skip_ssl=${skip_ssl:-$SKIP_SSL}
  skip_ssl=${skip_ssl:-'false'}

  # assert_required_params "$example_arg"
  run_server "$skip_ssl"
}

main "$@"
