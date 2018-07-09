console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'production') {
  module.exports = require('./prod.json');
}
else {
  module.exports = require('./prod.json');
}