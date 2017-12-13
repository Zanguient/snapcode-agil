// conf.js
exports.config = {
	
	capabilities: {
        'browserName': 'chrome'
    },
	
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['example.js'],
  jasmineNodeOpts: {
defaultTimeoutInterval: 2500000
},
getPageTimeout: 20000
};