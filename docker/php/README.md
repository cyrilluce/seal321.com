打包并推送到私有源
`docker buildx build --platform=linux/amd64 -t hkccr.ccs.tencentyun.com/cyrilluce/seal321-php --push .`

本地打包调试
`docker build -t hkccr.ccs.tencentyun.com/cyrilluce/seal321-php .`