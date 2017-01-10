export function koaLogger(logger) {
    return async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;

        let logLevel;
        if (ctx.status >= 500) {
            logLevel = 'error';
        }
        if (ctx.status >= 400) {
            logLevel = 'warn';
        }
        if (ctx.status >= 100) {
            logLevel = 'info';
        }

        let msg = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;

        logger[logLevel](msg);
    };
}