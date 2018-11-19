/**
 * Store user profile and session data
 * Logins and creates new user session
 * And contains all the necessary authentication & user functions
 * 
 */

// Dependencies
import {
  computed,
  action,
  observable
} from 'mobx';
import axios from 'axios';
import api from '../config/api';

/**
 * User storage
 */
export default class UserStore {
  constructor() {

    this.fetchLoggedInState();
  }

  /**
   * User profile
   * 
   * Contains: 
   * 
   *    username(string), displayName(string), email(string), admin(boolean) 
   *
   * @memberof UserStore
   */
  @observable profile = {username: '', displayName: '', email: '', admin: false};

  /**
   * Contains the user's id
   * 
   * Useful for performing unique actions identifiable to all the connected clients as an individuals emitted event and not the server's
   *
   * @memberof UserStore
   */
  @observable userId = '';

  /**
   * Contains the date timestamp that was stored when the user logged in 
   *
   * @memberof UserStore
   */
  @observable connectedTimestamp = '';

  /**
   *
   *
   * @memberof UserStore
   */
  @observable isLoggedIn = undefined;  

  /**
   * Attempts to login with the specified credentials
   *
   * @param {*} username The username of the user
   * @param {*} password The password crendentials of the user
   * @memberof UserStore
   */
  @action.bound
  login(username, password) {
    return new Promise((resolve, reject) => {
      axios.post(
        api.v1.http.auth.login,
        {username, password},
        { 
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin":      '*',
            "Access-Control-Allow-Credentials": true
          }
        }
      )
      .then(({data: profile}) => {
        const {username, displayName, email, admin, _id} = profile;
        if(username && displayName && email && _id) {
          // Initiating user data in class
          this.profile = {username, displayName, email, admin};
          this.userId = _id;
          this.connectedTimestamp = Date.now();
          this.isLoggedIn = true;

          resolve(true);
        }
        else {
          resolve(false);
        }
        
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Logout from the current session, actions are done by the server remotely
   *
   * @memberof UserStore
   */
  @action.bound
  logout() {
    return new Promise((resolve, reject) => {
      axios.get(
        api.v1.http.auth.logout,
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin":      '*',
            "Access-Control-Allow-Credentials": true
          }
        }
      )
        .then(value => {
          window.location.reload();

          // Resetting values
          this.profile = {username: '', displayName: '', email: '', admin: false};
          this.id = '';
          this.connectedTimestamp = '';
          this.isLoggedIn = false;

          resolve(true);
        })
        .catch(err => {
          this.triggerError(`Could not logout : ${err}`)
          reject(err);
        });
    });
  }

  /**
   * Checks if a user is logged in in the current session or not
   *
   * @memberof UserStore
   */
  @action.bound
  fetchLoggedInState() {
    axios.get(
      api.v1.http.auth.isLoggedIn,
      {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin":      '*',
          "Access-Control-Allow-Credentials": true
        } 
      })
      .then(({data: loggedIn}) => {
        this.isLoggedIn = loggedIn;

        // If logged in get profile data
        if(loggedIn) {
          axios.get(
            api.v1.http.auth.profile,
            {
              withCredentials: true
            }
          ).then(({data: profile}) => {
              const {username, displayName, email, admin, _id} = profile;
              this.profile = {username, displayName, email, admin};
              this.userId = _id;
              this.connectedTimestamp = Date.now();
            })
        }
      })
      .catch(err => {
        throw new Error(err);
      });

    return this.isLoggedIn;
  }

  /**
   * Returns all the currently online users
   *
   * @readonly
   * @memberof UserStore
   */
  @computed
  get onlineUsers() {
    return {};
  }
}