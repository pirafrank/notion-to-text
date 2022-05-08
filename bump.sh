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
    cd -
    ;;
  lambda)
    echo "bumping lambda version"
    cd lambda
    npm version ${VERSION}
    npm i --package-lock-only
    cd -
    ;;
  core)
    echo "bumping core version"
    cd core
    npm version ${VERSION}
    npm i --package-lock-only
    cd -
    ;;
  *)
    echo "unknown option"
  ;;
esac
