let base = '';
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
      'customers' : base + '/api/v1/customers',
      'products'  : base + '/api/v1/products',
      'couriers'  : base + '/api/v1/couriers',
      'users'     : base + '/api/v1/users',
      'auth' : 
      {
        'isLoggedIn' : base + '/api/v1/isLoggedIn',
        'login'      : base + '/api/v1/login',
        'logout'     : base + '/api/v1/logout',
        'profile'    : base + '/api/v1/profile'
      }
    },
    'socket': {
      'users' : {
        'url' : base + '/api/v1/stoctex/users',
        'events' : {
          'userJoined' : 'userJoined',
          'userLeft'   : 'userLeft'
        }
      },
      'table' : {
        'url' : base + '/api/v1/stoctex/table',
        'events' : {
          'tableFieldChanged' : 'tableFieldChanged',
          'tableItemAdded'    : 'tableItemAdded',
          'tableItemRemoved'  : 'tableItemRemoved'
        }
      }
    }
  }
}