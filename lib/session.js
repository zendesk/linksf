import camelize from 'camelize'

import { firebaseClient } from '../core/firebaseApi'

export const OAUTH_TOKEN  = 'linksf::oauthToken'
export const CURRENT_USER = 'linksf::currentUser'

export const authenticate = () => {
  const user = currentUser()

  if (!user) {
    window.location.replace('/login')
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
  delete sessionStorage[OAUTH_TOKEN]
}

export const login = (email, password, loginCallback) => {
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

        setCurrentUser(userData)
      }
    })

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(loginCallback)
    .catch((error) => {
      var errorCode = error.code
      var errorMessage = error.message
    })
}
