#!/usr/bin/env bash
source ~/.bash_profile
scp -r ./dist/* admin@89.117.50.164:/srv/www/elementium
scp -r ./dist/.env admin@89.117.50.164:/srv/www/elementium
ssh admin@89.117.50.164 'source ~/.bash_profile && nvm use 16.13 && cd /srv/www/elementium/ && pm2 start /srv/www/elementium/env.config.js'
