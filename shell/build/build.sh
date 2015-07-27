SHELLPATH=$(cd `dirname $0`; pwd)
TARGET_PATH=$SHELLPATH/target
SOURCE_PATH=$(cd $SHELLPATH; cd ../../source; pwd)

rm -rf $TARGET_PATH/*
#1. compress files
node /e/source/compresser/ $SOURCE_PATH $TARGET_PATH/

#3. change.js
node $SHELLPATH/change.js $TARGET_PATH