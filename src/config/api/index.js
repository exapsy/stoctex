if(process.env.NODE_ENV === 'production') {
  module.exports = require('./prod.json');
} else if(process.env.NODE_ENV === 'staging') {
  module.exports = require('./staging.json');
} else {
  module.exports = require('./dev.json');
}