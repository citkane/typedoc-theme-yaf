#! /bin/bash

./node_modules/.bin/tsc --build;
npm run build:css;
rsync -a ./src/assets/ ./dist/src/assets/ --exclude 'scss' --exclude 'ts' --exclude '*.md';
mkdir ./dist/src/frontend/templates
cp ./src/frontend/templates/*.css ./dist/src/frontend/templates/;
cp ./src/frontend/templates/*.html ./dist/src/frontend/templates/;
cp ./LICENSE ./dist/LICENSE;
cp ./package.json ./dist/package.json;
cp ./.npmignore ./dist/.npmignore;
cp ./README.md ./dist/README.md;
