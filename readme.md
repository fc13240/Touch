## 菜单配置逻辑

### 本地配置
初次进入系统时会提示 “没有进行系统配置”然后进入配置界面，也可以通过主界面右下角的隐式按钮进入，配置完成后保存后按提示进入“主界面”。

每一项产品都可以拖拽进行排序（只可同级排序）

### 添加菜单项流程
1. 编辑 `shell/data/menu.js` 进行添加菜单项，并运行 `node shell/data/menu.js` 会自动生成 `source/data/menu.conf`
2. 编辑 `source/js/index.js` 添加菜单选项具体配置及相关操作。
3. 发布新版本


## 在线文档
1. 在程序根目录运行 `npm install` 安装依赖
2. 在程序根目录运行 `npm run doc` 在 `docs/_site` 下生成相关静态文件
    > 运行 `npm run docShow` 可在本地查看生成的静态文档
3. 把 `docs/_site` 下的文档上传至文档服务器，目前地址为 [https://www.tianqi.cn/BPA/touch/docs/](https://www.tianqi.cn/BPA/touch/docs/)    


## 应用打包
1. `shell/build2/init.sh` 初始化工作空间(只需初始化一次)
1. `npm run build` 打包应用
1. `npm run upload` 上传安装包