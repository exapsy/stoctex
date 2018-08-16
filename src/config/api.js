let base = '';

// Set the base URL to the appropriate one, depending on the current Node Environment
if(process.env.NODE_ENV === 'production') {
  base = 'https://gphub.gpsupplies.com'
} else if(process.env.NODE_ENV === 'staging') {
  base = 'https://staging.gphub.gpsupplies.com';
} else {
  base = 'https://localhost';
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