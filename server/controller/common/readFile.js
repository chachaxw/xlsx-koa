import XLSX from 'xlsx';
import _ from 'lodash';
import { strToUnderscored, objFormat, specFormat } from '../../lib/utils/utils';

/**
 * 读取 Excel 文件
 * @param {File} file
 * @return {Array}
 */
export default function readFile(file) {
    let data = [];
    const wb = XLSX.readFile(file);

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

        data = _.chain(rows).groupBy('handle').toPairs().map(o => {
            return _.zipObject(_.zip(['handle', 'specs']), o);
        }).map(item => {
            const obj = item.specs[0];

            if (Array.isArray(item.specs) && item.specs.length > 0) {
                item.specs = item.specs.map(item => specFormat(item));
            }

            return {
                declare_name_cn: _.get(obj, 'declare_name_cn'),
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

    });

    return data;
}
