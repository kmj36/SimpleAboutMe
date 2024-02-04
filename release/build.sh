echo "[Create build folder...]"
mkdir ../build
mkdir ../build/App
mkdir ../build/API
cp Docker/docker-compose.yml ../build/
cp Docker/Dockerfile ../build/API/
cp ./Environments/.env ../build/
cat ./Environments/App/.env >> ../build/.env
cp ./nginx.conf ../build/
cp ./start.sh ../build/

echo "[App build...]"
cat ./Environments/App/.env > ../nginx_webapp/intropage-app/.env
cd ../nginx_webapp/intropage-app
sudo npm install --legacy-peer-deps
sudo npm run build --omit=dev
cp -r ./build/* ../../build/App/
echo "[App build done.]"

echo "[API build...]"
cd ../..
cp -r ./django_app/API ./build/API
cp -r ./django_app/django_app ./build/API
cp -r ./django_app/manage.py ./build/API
cp ./django_app/requirements.txt ./build/API
mkdir ./build/API/media
mkdir ./build/API/static
cd ./build/API/
echo "[API build done...]"