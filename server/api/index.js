export function createProduct(ctx, data) {
    return ctx.axios(ctx, {
        url: `/interface/product-create/index`, 
        method: 'post',
        data,
    });
}
