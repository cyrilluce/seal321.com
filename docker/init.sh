rm -rf temp
git clone --depth 1 --branch=main https://github.com/cyrilluce/legacy.seal321.com.git temp
rm -rf temp/.git
rm -r nginx/www
mv temp/www nginx/www

rm ./mysql/docker-entrypoint-initdb.d/*.sql
mkdir -p ./mysql/docker-entrypoint-initdb.d
tar -zxf ./temp/mysql/dump.tar.gz -C ./mysql/docker-entrypoint-initdb.d