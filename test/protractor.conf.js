exports.config = {
  // allScriptsTimeout: 10000,
  capabilities: {
    'browserName': 'chrome'
  },
  chromeOnly: true,
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e/*.js', 'e2e/*.coffee'],
}
