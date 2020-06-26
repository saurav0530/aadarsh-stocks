const path = require ('path')

module.exports ={
    entry: ['babel-polyfill','./resource/js/main.js'],
    output: {
        path : path.resolve(__dirname,'resource'),
        filename: 'build/bundle.js'
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    }
}