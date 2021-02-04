const path = require('path');

module.exports = {
  "stories": [
    "../src/**/*.stories.tsx",
    "../src/features/**/*.stories.tsx"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app"
  ],
  webpackFinal: async config => {
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.css$/,
        loaders: [
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: './.storybook/',
              },
            },
          },
        ],
        include: path.resolve(__dirname, '../'),
      },
      // TODO (ramfox): remove when we convert scss to tailwind in `features/ds_components`
      // also remove 'style-loader', 'css-loader', 'sass-loader', and 'node-sass' from `package.json`
      {
        test: '/\.scss$/',
        use: ['style-loader', 'css-loader', {
          loader: 'sass-loader',
          options: {
            outFile: '../old_styles.css'
          }
        }],
        include: path.resolve(__dirname, '../')
      }
    ],
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
}
