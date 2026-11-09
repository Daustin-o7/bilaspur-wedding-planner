const fs = require('node:fs');
const vm = require('node:vm');
const Hub = require('../site/core.js');
function plan() {
  const ctx = vm.createContext({ Hub, window: { addEventListener() {} } });
  vm.runInContext(fs.readFileSync('site/app.js', 'utf8') + '\n' + fs.readFileSync('site/planner.js', 'utf8') + '\naddPlannerSeed(state); normalizePlanner(state);', ctx);
  return JSON.parse(vm.runInContext('JSON.stringify(state)', ctx));
}
module.exports = { plan };
