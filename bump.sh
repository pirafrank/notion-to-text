#!/bin/bash

VERSION="$2"
# if unset, default to 'patch'
if [ -z "${VERSION}" ]; then
  VERSION='patch'
fi

case "$1" in
  standalone)
    echo "bumping standalone version"
    cd standalone
    npm version ${VERSION}
    npm i --package-lock-only
    ;;
  lambda)
    echo "bumping lambda version"
    cd lambda
    npm version ${VERSION}
    npm i --package-lock-only
    ;;
  core)
    echo "bumping core version"
    cd core
    npm version ${VERSION}
    npm i --package-lock-only
    ;;
  *)
    echo "unknown option"
  ;;
esac
