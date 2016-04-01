SHELLPATH=$(cd `dirname $0`; pwd)
TARGET_PATH=$SHELLPATH/target
SOURCE_PATH=$(cd $SHELLPATH; cd ../../source_1; pwd)

rm -rf $TARGET_PATH/*
#1. compress files
node /f/source/node_projects/compresser/ $SOURCE_PATH $TARGET_PATH/

#3. change.js
node $SHELLPATH/change.js $TARGET_PATH