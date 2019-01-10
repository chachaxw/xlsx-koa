export function createProduct(ctx, data) {
    return ctx.axios(ctx, {
        url: 'http://pdm.hqygou.com/interface/product-create/index', 
        method: 'post',
        data: {...data},
    });
}
