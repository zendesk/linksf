import camelize from 'camelize'
import firebase from 'firebase'

import globalConfig from '../config'
import { redirectTo } from './navigation'

export const CURRENT_USER = 'linksf::currentUser'


export const authenticate = () => {
  const user = currentUser()

  if (!user) {
    redirectTo('/login')
    return false
  }

  return user
}

export const currentUser = () => {
  const sessionData = sessionStorage[CURRENT_USER]

  let user = null

  try {
    user = sessionData && JSON.parse(sessionData)
  } catch (e) {
    console.warn('Failed to load current user', e)
  }

  return user
}

export const setCurrentUser = (user) => {
  try {
    sessionStorage[CURRENT_USER] = JSON.stringify(user)
  } catch (e) {
    console.warn('Failed to set current user', e)
    return false
  }
}

export const destroySession = () => {
  delete sessionStorage[CURRENT_USER]
}

export const login = (email, password, loginSuccessCallback, loginFailureCallback) => {
  const firebase = firebaseClient()

  firebase
    .auth()
    .onAuthStateChanged((user) => {
      if (user) {
        const userData = camelize({
          name: user.displayName,
          email: user.email,
          photo: user.photoUrl,
        })
        user.getToken().then((token) => {
          userData.token = token
          setCurrentUser(userData)
        })
      }
    })

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(loginSuccessCallback)
    .catch((error) => {
      loginFailureCallback(error.message)
    })
}

function firebaseClient() {
  if (firebase.apps.length == 1) {
    return firebase // Don't initialize more than one client
  }

  const config = {
    apiKey: globalConfig.firebaseApiKey,
    authDomain: globalConfig.firebaseAuthDomain,
  }

  firebase.initializeApp(config)

  return firebase
}
