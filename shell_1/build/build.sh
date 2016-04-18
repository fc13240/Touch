SHELLPATH=$(cd `dirname $0`; pwd)
TARGET_PATH=$SHELLPATH/target
TARGET_32_DIR=$SHELLPATH/ia32
TARGET_64_DIR=$SHELLPATH/x64
SOURCE_PATH=$(cd $SHELLPATH; cd ../../source_1; pwd)

# rm -rf $TARGET_PATH/*
rm -rf $TARGET_64_DIR
rm -rf $TARGET_32_DIR
#1. compress files
node /f/source/node_projects/compresser/ $SOURCE_PATH $TARGET_PATH/

#3. change.js
node $SHELLPATH/change.js $TARGET_PATH

echo '{"main": "index.js"}' > $TARGET_PATH/package.json

mkdir -p $TARGET_64_DIR/
mkdir -p $TARGET_32_DIR/

cp -R h:/soft/electron/0.35.1-32/* $TARGET_32_DIR/
rm -rf $TARGET_32_DIR/resources/default_app
rm -rf $TARGET_32_DIR/resources/app
mkdir $TARGET_32_DIR/resources/app
cp -R $TARGET_PATH/* $TARGET_32_DIR/resources/app


cp -R h:/soft/electron/BPA-0.35.0-x64/* $TARGET_64_DIR/
rm -rf $TARGET_64_DIR/resources/default_app
rm -rf $TARGET_64_DIR/resources/app
mkdir $TARGET_64_DIR/resources/app
cp -R $TARGET_PATH/* $TARGET_64_DIR/resources/app