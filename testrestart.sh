sudo docker-compose down
sudo docker rmi p_intropage_v1-api p_intropage_v1_api -f
sudo apt-get update -y
sudo apt-get install -y docker

sudo curl -L https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

sudo docker-compose up -d
sudo chown -R 1000:1000 nginx_webapp/webfolder/