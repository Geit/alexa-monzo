const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        node: '8',
      },
      useBuiltIns: 'usage',
    },
  ],
];

module.exports = {
  presets,
};
