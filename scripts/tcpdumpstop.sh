# !/ bin / bash
# -* - ENCODING : UTF -8 -* -

pid=$(ps -e | pgrep tcpdump)
echo "========= PID: "$pid" ========="
sleep 1s
sudo kill -2 $pid

exit
