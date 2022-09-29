#!/bin/sh

yarn build

# deploy demo portal
gcloud app deploy --project braincelldata
