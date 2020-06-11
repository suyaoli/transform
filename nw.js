let Service = require('node-windows').Service;
var path = require('path');

let svc = new Service({
    name: 'transformService',    //服务名称
    description: 'transformService', //描述
    script: path.resolve('') + '/index.js' //nodejs项目要启动的文件路径
});

svc.on('install', () => {
    svc.start();
});

svc.install();