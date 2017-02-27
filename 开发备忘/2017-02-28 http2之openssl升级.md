# 前因
升级了nginx后，http2还是无法启用，后来发现是openssl版本过低，需升级1.0.2

# 升级步骤 目录 /data/tmp
cd /data/tmp
wget https://www.openssl.org/source/openssl-1.0.2k.tar.gz
tar -xzvf openssl-1.0.2k.tar.gz
cd openssl-1.0.2k
./config
make install 
ln -sf /usr/local/ssl/bin/openssl `which openssl`
openssl version -v

# 升级后nginx未使用我们编译的openssl，考虑自己编译nginx
## 先装PCRE
cd /data/tmp
wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.40.tar.gz
tar -zxf pcre-8.40.tar.gz
cd pcre-8.40
./configure
make
make install

## 再装zlib
cd /data/tmp
wget http://zlib.net/zlib-1.2.11.tar.gz
tar -zxf zlib-1.2.11.tar.gz
cd zlib-1.2.11
./configure
make
sudo make install

## 再装nginx
cd /data/tmp
wget http://nginx.org/download/nginx-1.10.3.tar.gz
tar xf nginx-1.10.3.tar.gz
cd nginx-1.10.3
./configure --prefix=/usr/local/nginx \
  --with-pcre=../pcre-8.40\
  --with-zlib=../zlib-1.2.11\
  --with-http_ssl_module\
  --with-openssl=../openssl-1.0.2k/ \
  --with-http_realip_module\
  --with-http_addition_module\
  --with-http_sub_module\
  --with-http_dav_module\
  --with-http_flv_module\
  --with-http_mp4_module\
  --with-http_gunzip_module\
  --with-http_gzip_static_module\
  --with-http_random_index_module\
  --with-http_secure_link_module\
  --with-http_stub_status_module\
  --with-http_auth_request_module\
  --with-threads\
  --with-stream\
  --with-stream_ssl_module\
  --with-http_slice_module\
  --with-mail\
  --with-mail_ssl_module\
  --with-file-aio\
  --with-http_v2_module\
  --with-ipv6
make
make install
### 安装到了/usr/local/nginx/sbin/nginx上，原带的nginx为/usr/sbin/nginx
ln -sf /usr/local/nginx/sbin/nginx `which nginx`

## 测试配置
service nginx configtest
## 重启
service nginx restart