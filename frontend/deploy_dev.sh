DOCKERTAG=`date +"%s"`
yarn install
yarn build:modal
yarn build:dev
docker build . -t emeal/frontend-dev:$DOCKERTAG
docker push emeal/frontend-dev:$DOCKERTAG
kubectl -n emeal-dev set image deployment/frontend frontend=emeal/frontend-dev:$DOCKERTAG