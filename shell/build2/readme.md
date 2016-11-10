1. `init.sh` 初始化工作空间
1. `gulp 任务名` 进行打包处理
    * `gulp` 整个打包处理
    * `gulp mini-code` 压缩代码，会生成`dest`目录
    * `gulp package` 打包成可运行的electron程序
    * `gulp setup` 打包成安装包

# `gulp` 子任务说明
* `mini-js` 压缩JS   
* `mini-css` 压缩CSS
* `copy-files` 拷贝html图片等静态文件
* `package-32` 打包32位可运行程序文件夹
* `package-64` 打包64位可运行程序文件夹
* `setup-32`  打32位安装包
* `setup-64`  打64位安装包
* `clean` 删除`dest`目录
* `clean-package-32` 删除`dest32`目录
* `clean-package-64` 删除`dest64`目录