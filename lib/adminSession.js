import { googleCredentials, oauth2URI } from '../config/keys'
import camelize from 'camelize'
import 'whatwg-fetch'

export const buildLoginURL = () => {
  return `https://accounts.google.com/o/oauth2/v2/auth?
    scope=email%20profile&
    redirect_uri=${oauth2URI}&
    response_type=token&
    client_id=${googleCredentials.clientID}`.replace(/\s/g, '')
}

export const parseGoogleOauthResponse = () => {
  const queryString = location.hash.substring(1),
        regex = /([^&=]+)=([^&]*)/g,
        params = {}

  let m = null

  while (m = regex.exec(queryString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }

  const oauthParams = camelize(params)

  return validateGoogleOauthToken(oauthParams.accessToken)
}

export const validateGoogleOauthToken = (token) => (
  fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`)
)

export const setCurrentUser = (user) => {
  sessionStorage.currentUser = JSON.stringify(user)
}

export const currentUser = () => {
  try {
    const user = JSON.parse(sessionStorage.currentUser)

    if (typeof user == 'object') {
      return user
    }
  } catch (e) {}
}

export const destroySession = () => {
  delete sessionStorage.currentUser
}
