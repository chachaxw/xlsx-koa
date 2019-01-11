import fs from 'fs';
import path from 'path';
import md5 from 'md5';
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
    const uploadDir = path.resolve(__dirname, '../../public/temp');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(path.resolve(__dirname, '../../public/temp'), (err) => {
            if (err) throw err;
        });
    }

    const form = new IncomingForm({
        multiples: true,
        keepExtensions: true,
        maxFileSize: 100 * 1024 * 1024,
        uploadDir,
    });

    form.on('file', (file) => {
        files.push[file];
    });

    form.parse(ctx.req, (err, fields, files) => {

        if (err) {
            ctx.throw(400, err);
        }

        const data = readFile(files.file.path);

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(item => {
                const key = 'fe74b137e9e0ee3a00ddea36c89c59df';
                const md5Data = md5(key + JSON.stringify(item));
                const md5Key = md5(item.from_platform + md5Data);

                console.log('MD5 Key', md5Key);
                createProduct(ctx, {
                    key: md5Key,
                    data: item
                });
            });
        }
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
