# 相关下载

- pubdate: 2016-11-15
- tags: 蓝PI,蓝PI蚂蚁,触屏,gis,
- navOne: 整体介绍
- navTwo: 相关下载

------
## 系统要求
**目前本软件只支持`window7及以上操作系统`**，暂时不提供`windows xp`系统支持

<style>
.download_link{
	border: 1px solid #ccc;
	padding: 10px 20px;
}
a.download_on,
.download_link:hover{
	background-color: #026e00;
	color: white;
}
.info_alert {
	color: #a94442;
    background-color: #f2dede;
    border-color: #ebccd1;
    display: none;
    padding: 10px;
    font-size: 20px;
}
</style>
<div class="info_alert">您当前系统不支持此安装包，请确保您的系统为window7及以上系统。</div>
## 蓝PI制图最新安装包下载(<span id="version"></span>)
<a id="download_32" class="download download_link">32位</a>
<a id="download_64" class="download download_link">64位</a>

## 软件权限申请
> 软件做了权限限制，要使用序列号激活才可使用，请联系下方业务人员索要序列号。

## 联系方式
<table>
    <tr>
        <td>市场合作</td>
        <td>李先生</td>
    </tr>
    <tr>
        <td>电话</td>
        <td>010-58991980</td>
    </tr>
    <tr>
        <td>手机</td>
        <td>13811371082</td>
    </tr>
    <tr>
        <td>邮箱</td>
        <td>liyinkai@tianqi.cn</td>
    </tr>
</table>

<script>
$(function(){
	var ua = navigator.userAgent;
	var m = /Windows NT ([\d\.]+)/.exec(ua);
	if (m && parseFloat(m[1]) < 6) {
		$('.info_alert').fadeIn();
		$('.download').click(function(e) {
			if (!confirm('您当前系统不支持此安装包是否继续下载？')) {
				e.preventDefault();
			}
		});
	}
	var conf = {
		soft: {
			version: 'v0.8.0',
			32: 'http://download.tianqi.cn/BPA/TOUCH/BPA-TOUCH-v0.8.0-win32-ia32.exe',
			64: 'http://download.tianqi.cn/BPA/TOUCH/BPA-TOUCH-v0.8.0-win32-x64.exe'
		}
	};
	var is64 = false;
	var agent = ua.toLowerCase();
	if(agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0){
		is64 = true;
	}
	$('#download_'+(is64? 64: 32)).addClass('download_on');
	$('#download_32').attr('href', conf.soft['32']);
	$('#download_64').attr('href', conf.soft['64']);
	$('#version').text(conf.soft.version);
	$('.download').attr('target', '_blank');
})
</script>
