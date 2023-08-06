sudo apt-get update -y
sudo apt-get install -y docker docker-compose
sudo docker-compose up -d
sudo chown -R 1000:1000 nginx_webapp/webfolder/