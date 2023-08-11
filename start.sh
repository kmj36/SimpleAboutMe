DOWNLOAD_DOCKERCOMPOSEVERSION=v2.20.2
CURRENT_DOCKERCOMPOSEVERSION=$(sudo docker-compose -v | awk '{print $4}')

echo "[Update docker...]"
sudo apt-get update -y
sudo apt-get install -y docker

echo "[Update docker-compose...]"
if [ "$DOWNLOAD_DOCKERCOMPOSEVERSION" != "$CURRENT_DOCKERCOMPOSEVERSION" ]
then
    sudo curl -L https://github.com/docker/compose/releases/download/$DOCKERVERSION/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "[docker-compose is up to date]"
fi

echo "[Build docker-compose...]"
sudo docker-compose up -d
echo "[nginx permission change...]"
sudo chown -R 1000:1000 nginx_webapp/webfolder/

echo "[Restart Intropage Service Done.]"