#!/bin/bash

sudo systemctl stop ntp
sudo ntpdate -u NTP-server
sudo systemctl start ntp
sudo ntpq -p

exit
