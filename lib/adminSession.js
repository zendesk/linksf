import { googleCredentials, oauth2URI } from '../config/keys'
import camelize from 'camelize'
import 'whatwg-fetch'

export const OAUTH_TOKEN  = 'linksf::oauthToken'
export const CURRENT_USER = 'linksf::currentUser'

export const authenticate = () => {
  const user = currentUser()

  if (!user) {
    window.location = '/login'
    return false
  }

  const tokenExpiresAt = new Date(user.tokenExpiresAt*1000)
  const now = new Date()

  if (tokenExpiresAt < now) {
    // need to verify token with google
    const token = sessionStorage[OAUTH_TOKEN]
    validateGoogleOauthToken(token)
  } else {
    // still have a valid token
    return true
  }
}

export const currentUser = () => {
  try {
    const user = JSON.parse(sessionStorage[CURRENT_USER])

    if (typeof user == 'object') {
      return user
    }
  } catch (e) {}
}

export const setCurrentUser = (user) => {
  sessionStorage[CURRENT_USER] = JSON.stringify(user)
}

export const destroySession = () => {
  delete sessionStorage[CURRENT_USER]
  delete sessionStorage[OAUTH_TOKEN]
}

export const buildLoginURL = () => {
  return `https://accounts.google.com/o/oauth2/v2/auth?
    scope=email%20profile&
    redirect_uri=${oauth2URI}&
    response_type=token&
    client_id=${googleCredentials.clientID}`.replace(/\s/g, '')
}

export const parseGoogleOauthResponse = () => {
  const queryString = location.hash.substring(1),
        regex       = /([^&=]+)=([^&]*)/g,
        params      = {}

  let m = null

  while (m = regex.exec(queryString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }

  const oauthParams = camelize(params)

  sessionStorage[OAUTH_TOKEN] = oauthParams.accessToken

  validateGoogleOauthToken(oauthParams.accessToken)
}

export const validateGoogleOauthToken = (token) => (
  fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`)
    .then(response => response.json())
    .then(json => {
      const data = camelize(json)

      if (data.aud !== googleCredentials.clientID) {
        console.warn("Oauth response does not match client ID. Login failed!")
        window.location = '/'
      }

      const user = {
        email: data.email,
        verified: data.emailVerified,
        tokenExpiresAt: data.exp
      }

      setCurrentUser(user)
      window.location = '/admin'
    })
)
