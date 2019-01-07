export function createProduct(ctx) {
    return ctx.axios(ctx, {
        url: '/interface/product-create/index', 
        method: 'post'
    });
};

