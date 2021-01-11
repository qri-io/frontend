#!/bin/bash -u

echo "publish to GCR: $1:$2, $1:latest"

echo "Copy google auth file"
echo $GOOGLE_AUTH > $HOME/gcp-key.json

echo "Setup gcloud authentication"
gcloud auth activate-service-account --key-file $HOME/gcp-key.json
echo "Y\n" | gcloud auth configure-docker

echo "Set gcloud project"
gcloud --quiet config set project qri-io

echo "Push image to google container registry"
docker push $1:$2

echo "Add 'latest' tag"
gcloud container images add-tag $1:$2 $1:latest