## 使用

1. 将配置文件(`.yaml`、`.yml` 格式)放到 `storage/app/clash/` 目录下

2. 执行以下命令
    ```shell
    php artisan clash:conf-merge --clean=true
    ```
   运行结果：
    ```
   ➜  Helpers php artisan clash:conf-merge --clean=true
    >>> 正在清理输出配置文件...
    清理完成
    
    >>> 正在合并配置文件...
    处理文件：clash/a.yml
    处理文件：clash/b.yaml
    配置文件合并完成，输出路径：/Users/chuwen/wwwroot/Helpers/storage/clash-output/clash_2022-12-13_06:18:12.yaml
   ```
