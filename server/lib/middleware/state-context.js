/**
 * 状态上下文(动态)
 * 一般情况应该根据业务自定义
 */
module.exports.default = module.exports = async (app) => {
    app.use(async (ctx, next) => {
        if (!ctx.session.user) {
            ctx.session.user = {}
        }
        if (!ctx.state.locale) {
            ctx.state.locale = 'zh';
            ctx.state.publicServer = ctx.publicServer || '';
            ctx.state.isMockAPI = ctx.isMockAPI || false;
        }
        if (ctx.env === 'production') {
            ctx.state.isMockAPI = false;
        }
        await next();
    });
    app.context.logger.info('state-context initialized');
};
