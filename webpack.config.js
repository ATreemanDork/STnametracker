import path from 'node:path';
import { fileURLToPath } from 'node:url';
import TerserPlugin from 'terser-webpack-plugin';

const __dirname = import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url));

export default (env = {}, argv = {}) => {
    // Default to no minification while debugging; enable by setting MINIFY=true
    const enableMinify = process.env.MINIFY === 'true';

    return {
        entry: path.join(__dirname, 'src/index.js'),
        output: {
            path: path.join(__dirname, './'),
            filename: 'index.js',
        },
        resolve: {
            extensions: ['.js'],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    // No babel loader needed for modern browsers
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.html$/,
                    use: { loader: 'html-loader' },
                },
            ],
        },
        optimization: {
            minimize: enableMinify,
            minimizer: enableMinify
                ? [
                      new TerserPlugin({
                          extractComments: false,
                          terserOptions: {
                              format: { comments: false },
                          },
                      }),
                  ]
                : [],
        },
        // Keep source maps on for easier debugging
        devtool: 'source-map',
        // Respect CLI-provided mode; otherwise default to development for debugging
        mode: argv.mode || 'development',
    };
};