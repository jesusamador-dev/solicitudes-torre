#!/bin/bash
echo "                         █        █                           █           █     "
echo "            ▓███▒        █                      █    █               █    █     "
echo "           █▓  ░█        █                      █    █               █    █     "
echo "           █      █▓██   █▒██▒  ███    █▒██▒  █████  █      ███    █████  █▒██▒ "
echo "           █▓░    █▓ ▓█  █▓ ▒█    █    █▓ ▒█    █    █        █      █    █▓ ▒█ "
echo "            ▓██▓  █   █  █   █    █    █   █    █    █        █      █    █   █ "
echo "               ▓█ █   █  █   █    █    █   █    █    █        █      █    █   █ "
echo "                █ █   █  █   █    █    █   █    █    █        █      █    █   █ "
echo "           █░  ▓█ █▓ ▓█  █   █    █    █   █    █░   █        █      █░   █   █ "
echo "           ▒████░ █▓██   █   █  █████  █   █    ▒██  ██████ █████    ▒██  █   █ "
echo "                  █                                                             "
echo "                  █                                                             "
echo "                  █ "
echo " - - - - -     Copying webpack.config.js"
cp ../webpack.config.js webpack.config.resp
echo " - - - - -     Replacement on webpack.config.js -> node replacement.js $1"
node replacement.js $1
sleep 2
echo ' - - - - -     Build project -> npm run build'
npm run build
echo " - - - - -     Restoring webpack.config.js -> mv webpack.config.js ../"
cp webpack.config.resp ../webpack.config.js
