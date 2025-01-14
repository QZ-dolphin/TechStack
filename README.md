# 个人技术栈前端展示页面
![demo](image.png)
## 初始化安装
```sh
npm set registry http://registry.npmmirror.com # 可以设置镜像源，加快依赖包下载

npm install # 安装依赖包
```
如果没有nodejs，请[下载安装](https://nodejs.org/zh-cn)
## 运行
Compile and Hot-Reload for Development
```sh
npm run dev
```
## 输入示例
[输入示例.txt](./输入示例.txt)
## 同步脚本
linux环境下运行gitpush.sh
```bash
./gitpush.sh
```

windows环境下运行git_push.bat
```shell
.\git_push.bat
```
## Compile and Minify for Production

```sh
npm run build
```

## Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Nginx配置
```bash
sudo vim /etc/nginx/sites-available/techapp
```
```nginx
server {
    listen 80;
    server_name 192.168.56.101;

    root /home/dora/techapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    error_page 404 /index.html;

    location /api/ {
        proxy_pass http://192.168.56.101:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
nginx重启
```bash
sudo ln -s /etc/nginx/sites-available/techapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo ufw allow 'Nginx Full'
```
文件权限
```bash
sudo chmod 755 /home/dora
sudo chmod 755 /home/dora/techapp
sudo chmod -R 755 /home/dora/techapp/dist
sudo chown -R www-data:www-data /home/dora/techapp/dist
```
目录结构
```arduino
/home/dora/techapp/dist/
    index.html
    assets/
```
## Docker 配置
创建Dockerfile
```dockerfile
# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 将前端打包文件复制到 Nginx 的默认静态目录
COPY dist/ /usr/share/nginx/html/

# 替换 Nginx 默认配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]
```
创建 nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://192.168.56.101:8000; # 转发 API 请求到后端服务
    }
}
```
构建镜像
```bash
docker build -t techapp-frontend .
```
运行容器
```bash
docker run -d -p 80:80 --name techapp-frontend techapp-frontend
```