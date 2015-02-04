module.exports =
  clientId:'1534033043529646'
  url: apiUrl+"auth/facebook"
  authorizationEndpoint: 'https://www.facebook.com/dialog/oauth'
  redirectUri: window.location.origin ||
  window.location.protocol + '//' + window.location.host + '/'
  scope: 'email'
  scopeDelimiter: ','
  requiredUrlParams: ['display', 'scope']
  display: 'popup'
  type: '2.0',
  popupOptions:
    width: 481,
    height: 269
