#!/bin/bash

# Configuracion modo ad-hoc
# sudo systemctl daemon-reload
# sudo systemctl stop dhcpcd
sudo iwconfig wlan1 rate 54M
sudo ip link set wlan1 down
sudo ifconfig wlan1 mtu 1500
sudo iwconfig wlan1 mode ad-hoc
sudo iwconfig wlan1 essid "olsr_network"
sudo iwconfig wlan1 ap any
sudo iwconfig wlan1 channel 2
sudo ip link set wlan1 up
sudo iwconfig wlan1 txpower 20dBm

sudo ifconfig wlan1 10.0.0.12/24

# OLSRd
sudo olsrd -i wlan1
