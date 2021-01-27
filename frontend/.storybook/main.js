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
      }
    ],
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
}
