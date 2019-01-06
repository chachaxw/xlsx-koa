import XLSX from 'xlsx';
import path from 'path';
import { fork } from 'child_process';
import _ from 'lodash';
import { strToUnderscored } from '../lib/utils/uitls';

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
            return {
                id: _.get(item, 'id'),
                handle: _.get(item, 'handle'),
                declare_name_cn: _.get(item, 'title'),
                declare_name_en: _.get(item, 'product_name_en'),
                feature: _.get(item, 'body_html'),
                character_ids: _.get(item, 'character_ids'),
                special_remarks: _.get(item, 'special_remarks', ''),
                buy_url: _.get(item, 'buy_url'),
                category_id: _.get(item, 'category_id'),
                image_path: _.get(item, 'variant_image'),
                product_weight: _.get(item, 'product_weight'),
                actual_weight: _.get(item, 'actual_weight'),
                sales_weight: _.get(item, 'sales_weight'),
                package_num: _.get(item, 'package_num'),
                package_length: _.get(item, 'package_length'),
                package_width: _.get(item, 'package_width'),
                package_height: _.get(item, 'package_height'),
                product_name_en: _.get(item, 'product_name_en'),
                currency_code: _.get(item, 'currency_code'),
                sale_price_base: _.get(item, 'sale_price_base'),
                price_limit: _.get(item, 'price_limit', []),
                display_alone: _.get(item, 'display_alone'),
                delivery_average_day: _.get(item, 'delivery_average_day'),
                is_edit_same_price: _.get(item, 'is_edit_same_price'),
                custom_size_data: _.get(item, 'custom_size_data', []),
                size_chart_template_id: _.get(item, 'size_chart_template_id'),
                standard_size_chart_id: _.get(item, 'standard_size_chart_id'),
            };
        });

        const data = _.chain(rows).groupBy('handle').value();

        console.log('--- Excel Data ---', data);
    });
};

readCSV(testCsv);

const pageHome = async (ctx) => {
    const locals = {
        title: 'Home Page'
    };

    // appName 开发模式下不会加载生产后的 css,只有在路由对应的控制器设置
    ctx.state.appName = 'app';
    await ctx.render('pages/home', locals);
};

const getFile = async (ctx, file) => {
    await new Promise((resolve, reject) => {
        const cb = (data) => {
            ctx.response.body = Buffer(data);
            resolve();
        };
    });
};

module.exports.default = module.exports = {
    pageHome,
    getFile
};
