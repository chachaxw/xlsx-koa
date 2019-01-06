module.exports.default = module.exports  = {
    getList(ctx) {
        return ctx.axios(ctx, {
            url: '/interface/product-create/index', 
            method: 'post'
        });
    }
};
