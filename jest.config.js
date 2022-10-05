module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: ['node_modules'],
  coveragePathIgnorePatterns: ['node_modules'],
  modulePathIgnorePatterns: ['node_modules'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-vector-icons)/)',
  ],
};
