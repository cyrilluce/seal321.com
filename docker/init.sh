rm -rf temp
git clone --depth 1 --branch=main https://github.com/cyrilluce/legacy.seal321.com.git temp
rm -rf temp/.git
rm -r nginx/www
mv temp/www nginx/www

rm -rf mysql/data/*
rm -f ./mysql/docker-entrypoint-initdb.d/dump.sql
mkdir -p ./mysql/docker-entrypoint-initdb.d
tar -zxf ./temp/mysql/dump.tar.gz -C ./mysql/docker-entrypoint-initdb.d