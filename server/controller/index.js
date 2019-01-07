import XLSX from 'xlsx';
import path from 'path';
import { fork } from 'child_process';
import _ from 'lodash';
import { createProduct } from '../api/index';
import { strToUnderscored, objFormat } from '../lib/utils/uitls';

const testCsv = path.resolve(__dirname, '../template/template.csv');

const readCSV = (csv) => {
    const wb = XLSX.readFile(csv);

    wb.SheetNames.forEach((name) => {
        const worksheet = wb.Sheets[name];
        const ref = worksheet['!ref'] ;
        const range= XLSX.utils.decode_range(ref);
        let row_start = range.s.r, row_end = range.e.r, rows = [], 
            col_start = range.s.c, col_end = range.e.c, first_row = [];

        for(; row_start <= row_end; row_start++) {
            let obj = {};

            for(let i = col_start; i<= col_end; i++) {
                const addr = XLSX.utils.encode_col(i) + XLSX.utils.encode_row(row_start);
                const cell = worksheet[addr];
                const val = cell ? cell.v : undefined;

                if (row_start === 0 && cell) {
                    const str = strToUnderscored(cell.v);
                    first_row.push(str);
                } else {
                    obj[first_row[i]] = val;
                }
            }

            if (row_start !== 0) {
                rows.push(obj);
            }
        }

        rows = _.map(rows, (item) => {
            return objFormat(item);
        });

        const data = _.chain(rows).groupBy('handle').toPairs().map(o => {
            return _.zipObject(_.zip(['handle', 'specs']), o);
        }).map(item => {
            const obj = item.specs[0];
            return {
                declare_name_cn: _.get(obj, 'title'),
                declare_name_en: _.get(obj, 'product_name_en'),
                feature: _.get(obj, 'feature'),
                character_ids: _.get(obj, 'character_ids'),
                special_remarks: _.get(obj, 'special_remarks', ''),
                buy_url: _.get(obj, 'buy_url'),
                category_id: _.get(obj, 'category_id'),
                image_path: _.get(obj, 'variant_image'),
                specs: item.specs,
                has_chinese: _.get(obj, 'has_chinese', 0),
                from_platform: _.get(obj, 'from_platform', ''),
                method: _.get(obj, 'method', ''),
                charger_spec: _.get(obj, 'charger_spec', 1),
                product_source: _.get(obj, 'product_source', 0),
                product_label: _.get(obj, 'product_label', ''),
                recommend_level: _.get(obj, 'recommend_level', 'o'),
                supplier_sn: _.get(obj, 'supplier_sn', ''),
            };
        }).value();

        console.log('--- Excel Data ---', data);
        return data;
    });
};

const pageHome = async (ctx) => {
    const locals = {
        title: 'Home Page'
    };

    // appName 开发模式下不会加载生产后的 css,只有在路由对应的控制器设置
    ctx.state.appName = 'app';
    await ctx.render('pages/home', locals);
};

const uploadFile = async (ctx, file) => {
    await new Promise((resolve, reject) => {
        const cb = (data) => {
            ctx.response.body = Buffer(data);
            resolve();
        };
    });
};

module.exports.default = module.exports = {
    pageHome,
    uploadFile,
};
