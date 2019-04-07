#!/bin/bash

if [ $1 == 'ios' ] ; then
  appcenter codepush release-react --app t.voslar/tipapp -d Production
fi

if [ $1 == 'android' ]; then
  appcenter codepush release-react --app t.voslar/tiapp -d Production
fi
