# !/ bin / bash
# -* - ENCODING : UTF -8 -* -

sudo rm -r tcpdumpFiles
sleep 1s
sudo mkdir tcpdumpFiles

counter=1
flag=1

while [ $counter -lt 13 ]
do
    if [ $flag -eq 1 ]
    then
        start=$(date +%s)
        echo "exp "$counter" por 25 seg"
        flag=0
        sudo tcpdump -G 25 -v -tt -i wlan1 | grep -E '12345|UDP' > ./tcpdumpFiles/tcpdumpRx"$counter".txt &
        sudo tcpdump -G 25 -vvv -tt -i wlan1 -w - | pv -bert > ./tcpdumpFiles/throughputRx"$counter".pcap
    fi

    end=$(date +%s)
    #echo "final: "$end""
    elapsed=$((end-start))
    #echo "transcurrido: "$elapsed""
    
    if (( $elapsed > 25 ))
    then
        pid=$(ps -e | pgrep tcpdump)
        sleep 1s
        kill -2 $pid
        echo "exp "$counter" terminado espera 30"
        counter=`expr $counter + 1`
        flag=1
        sleep 30s
    fi
done

echo "experimentos completados"

exit
