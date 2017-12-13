// conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['todo-spec.js'],
  jasmineNodeOpts: {
defaultTimeoutInterval: 2500000
},
getPageTimeout: 20000
};