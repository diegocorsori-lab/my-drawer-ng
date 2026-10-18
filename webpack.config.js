const webpack = require("@nativescript/webpack");
const { BannerPlugin } = require("webpack");

module.exports = (env) => {
    webpack.init(env);

    if (env.unitTesting) {
        webpack.chainWebpack((config) => {
            // Inyecta la variable global en la línea 1 del código compilado
            config.plugin("exports-polyfill").use(BannerPlugin, [{
                raw: true,
                banner: "global.exports = global.exports || {};",
            }]);
        });
    }

    return webpack.resolveConfig();
};