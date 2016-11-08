var path = require('path');
var fs = require('fs');

var toolConsole = require('../../source/js/console/tool');

var data = [{
    name: '实况监测',
    sub: [{
        name: '卫星云图'
    }, {
        name: '雷达图'
    }, {
        name: '风场+台风'
    }, {
        name: '风场'
    }, {
        name: '台风'
    }, {
        name: '空气质量'
    }, {
        name: '天气统计'
    }, {
        name: '实景天气'
    }, {
        name: '降水'
    }, {
        name: '气压'
    }, {
        name: '温度'
    }, {
        name: '相对湿度'
    }, {
        name: '能见度'
    }, {
        name: '风速'
    }]
}, {
    name: '天气预报',
    sub: [{
        name: '未来三天降水量预报'
    }, {
        name: '全国雾区预报'
    }, {
        name: '全国霾区预报'
    }, {
        name: '空气污染扩散气象条件'
    }]
}, {
    name: '灾害预警',
    sub: [{
        name: '气象灾害预警'
    }]
}, {
    name: '形势分析',
    sub: [{
        name: '亚欧地面场分析'
    }]
}, {
    name: '外来产品',
    sub: [{
        name: '3d效果展示'
    }]
}];

var pathData = path.join(__dirname, '../../source/data/menu.conf');
fs.writeFileSync(pathData, toolConsole.encode(JSON.stringify(data)));

console.log('写入数据完成');