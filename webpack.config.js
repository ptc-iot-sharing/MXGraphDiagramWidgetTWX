var path = require("path");
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        // htmlDemo: "./src/index.ts",
        mxdiagram_runtime: './src/mxdiagram.runtime.ts',
        mxdiagram_ide: './src/mxdiagram.ide.ts',
        vendor: ['mxgraph']
    },
    output: {
        path: path.join(__dirname, "ui", "mxdiagram"),
        filename: "[name].bundle.js",
        chunkFilename: "[id].chunk.js",
        publicPath: "../Common/extensions/mxdiagram_ExtensionPackage/ui/mxdiagram/"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "mxdiagram_runtime",
            minChunks: Infinity,
            filename: "mxdiagram_runtime.bundle.js",
            chunks: ['vendor']
        }),
        new CopyWebpackPlugin([
            { from: 'src/mxgraph', to: 'mxgraph' }
        ]),
    ],

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                include: path.join(__dirname, 'src/images'),
                test: /\.(png|jp(e*)g|svg|xml)$/,
                loader: 'url-loader?limit=30000&name=images/[name].[ext]'
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]               
            },

        ]
    },
};