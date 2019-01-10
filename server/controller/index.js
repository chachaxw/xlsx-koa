import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import readFile from './common/readFile';
import { createProduct } from '../api/index';

const pageHome = async (ctx) => {
    const locals = {
        title: 'Home Page'
    };

    // appName 开发模式下不会加载生产后的 css,只有在路由对应的控制器设置
    ctx.state.appName = 'app';
    await ctx.render('pages/home', locals);
};

const uploadFile = async (ctx) => {
    let files = [];
    const form = new IncomingForm({
        multiples: true,
        keepExtensions: true,
        maxFileSize: 100 * 1024 * 1024,
        uploadDir: path.resolve(__dirname, '../../public/temp'),
    });

    form.on('file', (file) => {
        files.push[file];
    });

    form.parse(ctx.req, (err, fields, files) => {
        console.log('Files', fields, files.file.path);
        if (err) {
            ctx.throw(400, err);
        }
        const data = readFile(files.file.path);
        console.log('Excel data', data);
        createProduct(ctx);
    });

    ctx.status = 200;
    ctx.body = {
        status: 200,
        errMsg: 'File Uploaded!',
    };
};

module.exports.default = module.exports = {
    pageHome,
    uploadFile,
};
