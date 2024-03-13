echo "[Create build folder...]"
mkdir ../build
mkdir ../build/App
mkdir ../build/App/Web
mkdir ../build/App/Admin
mkdir ../build/API
cp Docker/docker-compose.yml ../build/
cp Docker/Dockerfile ../build/API/
cp ./Environments/.env ../build/
cat ./Environments/App/.env >> ../build/.env
cp ./nginx.conf ../build/
cp ./start.sh ../build/

echo "[App build...]"
cd ../nginx_webapp/intropage-app
sudo yarn install
sudo yarn build
cp -r ./build/* ../../build/App/Web
echo "[App build done.]"

echo "[Admin Page build...]"
cd ../cms
sudo yarn install
sudo yarn build
cp -r ./build/* ../../build/App/Admin
echo "[Admin Page build done.]"


echo "[API build...]"
cd ../..
cp -r ./django_app/API ./build/API
cp -r ./django_app/django_app ./build/API
cp -r ./django_app/manage.py ./build/API
cp ./django_app/requirements.txt ./build/API
touch ./build/API/db.sqlite3
mkdir ./build/API/media
mkdir ./build/API/static
cd ./build/API/
echo "[API build done...]"