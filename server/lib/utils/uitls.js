/**
 * 判断`array`是否是空数组
 * @param  {Object} array
 * @return {Boolean}
 */
export function isEmptyArray(array) {
    return !array || (Object.prototype.toString.call(array) === '[object Array]' && array.length === 0);
}

/**
 * 字符串转换为下划线连接
 * @param {String} str
 * @param {String}
 */
export function strToUnderscored(str) {
    const reg = /[(|)]|\//g;
    const underscored = /[\s\-]+/g;

    return String.trim(str).replace(reg, '').replace(underscored, '_').toLowerCase();
}