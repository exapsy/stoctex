/**
 * Provides the appropriate API URLs to the application
 * Depending on the NODE ENVIRONMENT, it may give different urls
 * Current Services are `http` for http requests and `socket` for socketio live api requests
 * 
 */

let base = process.env.REACT_APP_API_URI || 'http://localhost:8001';

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