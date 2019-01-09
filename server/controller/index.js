import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import _ from 'lodash';
import { createProduct } from '../api/index';
import { readFile } from './common/readFile';

const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
    uploadDir: path.resolve(__dirname, '../template'),
});

const pageHome = async (ctx) => {
    const locals = {
        title: 'Home Page'
    };

    // appName 开发模式下不会加载生产后的 css,只有在路由对应的控制器设置
    ctx.state.appName = 'app';
    await ctx.render('pages/home', locals);
};

const uploadFile = async (ctx) => {
    form.parse(ctx.req, (err, fields, files) => {
        console.log('Files', files);

        if (err) {
            ctx.treow(400, err);
        } else {
            ctx.status = 200;
            ctx.body = {
                status: 200,
                errMsg: 'File Uploaded!',
            };
        }
    });
};

module.exports.default = module.exports = {
    pageHome,
    uploadFile,
};
