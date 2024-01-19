# docker 化后的发布流程

- 打包镜像并推送

```sh
sh build.sh
```

- 服务器上更新镜像
```sh
ssh ubuntu@seal321.com
cd /data/seal321/seal321.com/docker
sudo docker pull hkccr.ccs.tencentyun.com/cyrilluce/seal321-server:latest
sudo docker compose up -d
```