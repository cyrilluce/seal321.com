pnpm install
npx tsc
# 本地打包
# docker build -t hkccr.ccs.tencentyun.com/cyrilluce/seal321-server .
# 登录
# docker login hkccr.ccs.tencentyun.com --username=50344530
docker buildx build --platform=linux/amd64 -t hkccr.ccs.tencentyun.com/cyrilluce/seal321-server:latest --push .            