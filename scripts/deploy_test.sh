#!/bin/sh

yarn build

# deploy main portal
gsutil -m rsync -r ./build/ gs://test.braincelldata.org/
