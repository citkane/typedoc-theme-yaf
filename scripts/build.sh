#! /bin/bash

./node_modules/.bin/tsc --build;
npm run build:css;
rsync -a ./src/assets/ ./dist/src/assets/ --exclude 'scss' --exclude 'ts' --exclude '*.md';
cp ./src/webComponents/components/*.css ./dist/src/webComponents/components/;
cp ./src/webComponents/components/*.html ./dist/src/webComponents/components/;
cp ./LICENSE ./dist/LICENSE;
cp ./package.json ./dist/package.json;
cp ./.npmignore ./dist/.npmignore;
cp ./README.md ./dist/README.md;
