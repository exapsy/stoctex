/**
 * Provides the appropriate API URLs to the application
 * Depending on the NODE ENVIRONMENT, it may give different urls
 * Current Services are `http` for http requests and `socket` for socketio live api requests
 * 
 */

let base = '';
console.log('process.env.REACT_APP_API = ', process.env.REACT_APP_API);
// Set the base URL to the appropriate one, depending on the current Node Environment
if(process.env.REACT_APP_API === 'production') {
  base = 'https://api.gphub.melaniatoners.gr'
} else if(process.env.REACT_APP_API === 'staging') {
  base = 'https://staging.api.gphub.melaniatoners.gr';
} else {
  base = 'http://localhost:8001';
}

export default {
  'v1': {
    'http': {
      'customers' : base + '/v1/customers',
      'products'  : base + '/v1/products',
      'couriers'  : base + '/v1/couriers',
      'users'     : base + '/v1/users',
      'auth' : 
      {
        'isLoggedIn' : base + '/v1/isLoggedIn',
        'login'      : base + '/v1/login',
        'logout'     : base + '/v1/logout',
        'profile'    : base + '/v1/profile'
      }
    },
    'socket': {
      'users' : {
        'url'    : base + '/v1/stoctex/users',
        'events' : {
          'userJoined' : 'userJoined',
          'userLeft'   : 'userLeft'
        }
      },
      'table' : {
        'url'    : base + '/v1/stoctex/table',
        'events' : {
          'tableFieldChanged' : 'tableFieldChanged',
          'tableItemAdded'    : 'tableItemAdded',
          'tableItemRemoved'  : 'tableItemRemoved'
        }
      }
    }
  }
}