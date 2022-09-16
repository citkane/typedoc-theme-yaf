#! /bin/bash

./node_modules/.bin/tsc --build;
npm run build:css;
rsync -a ./src/assets/ ./dist/src/assets/ --exclude 'scss' --exclude 'ts' --exclude '*.md';
mkdir ./dist/src/webComponents/templates
cp ./src/webComponents/templates/*.css ./dist/src/webComponents/templates/;
cp ./src/webComponents/templates/*.html ./dist/src/webComponents/templates/;
cp ./LICENSE ./dist/LICENSE;
cp ./package.json ./dist/package.json;
cp ./.npmignore ./dist/.npmignore;
cp ./README.md ./dist/README.md;
