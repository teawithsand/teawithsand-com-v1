const webpack = require("webpack")
const Encore = require('@symfony/webpack-encore');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const CopyWebpackPlugin = require('copy-webpack-plugin');

const minifier = new ImageMinimizerPlugin({
    minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
                ["gifsicle", { interlaced: true }],
                ["jpegtran", { progressive: true }],
                ["optipng", { optimizationLevel: 5 }],
                // Svgo configuration here https://github.com/svg/svgo#configuration
                [
                    "svgo",
                    /*
                    {
                        plugins: extendDefaultPlugins([
                            {
                                name: "removeViewBox",
                                active: false,
                            },
                            {
                                name: "addAttributesToSVGElement",
                                params: {
                                    attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                                },
                            },
                        ]),
                    }
                    */,
                ],
            ],
        },
    },
})


// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}


Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './assets/entry/app.tsx')
    .addEntry('admin', './assets/entry/admin.jsx')
    .addEntry('externalLogin', './assets/entry/externalLogin.tsx')
    // .addEntry('service-worker', "./assets/entry/serviceWorker.ts")

    // enables the Symfony UX Stimulus bridge (used in assets/bootstrap.js)
    // .enableStimulusBridge('./assets/controllers.json')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    // .enableSingleRuntimeChunk()
    // Call this instead
    .disableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    .configureBabel((config) => {
        config.plugins.push('@babel/plugin-proposal-class-properties');
        /*
        config.plugins.push([
            "formatjs",
            {
                "idInterpolationPattern": "[sha512:contenthash:base64:6]",
                "ast": true
            }
        ])
        */
    })

    // enables @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })

    // enables Sass/SCSS support
    .enableSassLoader()
    .enablePostCssLoader()

    // uncomment if you use TypeScript
    .enableTypeScriptLoader()

    // uncomment if you use React
    .enableReactPreset()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    .enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    // .autoProvidejQuery()

    .addPlugin(new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        cacheId: "finaltwsapi",
    }))
    .addPlugin(new CopyWebpackPlugin({
        patterns: [
            {
                from: "assets/images/favicon/favicon.png",
                to: "[name]_1[ext]",
                toType: "template",
            }
        ]
    }))
    .addPlugin(new CompressionPlugin({
        test: /\.(js|css|svg|json).*$/i,
    }))

    // images are configured manually now
    .configureImageRule({ enabled: false })
    .addRule({
        test: /.svg$/i,
        type: "asset",
    })
    .addRule({
        // TODO(teawithsand): set format to webp, 
        test: /\.(jpe?g|png|webp)$/i,
        use: {
            // https://github.com/dazuaz/responsive-loader
            loader: 'responsive-loader',
            options: {
                esModule: true,
                sizes: [60, 480, 960, 1920, 1920000],
                adapter: require('responsive-loader/sharp')
                // placeholder: true,
                // placeholderSize: 30,
            }
        }
    })
    .addRule({
        test: /.apk$/i,
        type: "asset/resource",
    })
    .addPlugin(new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    }))
    // TODO(teawithsand): add uglifyjs plugin before compression plugin(unless webpack does that in prod mode automatically)
    ;

let config = Encore.getWebpackConfig();
config.resolve.plugins = [new TSConfigPathsPlugin];


if (config.optimization.minimizer) {
    config.optimization.minimizer.push(minifier)
} else {
    config.optimization.minimizer = [minifier]
}

config.resolve.fallback = {
    buffer: require.resolve('buffer/'),
}

module.exports = config;
