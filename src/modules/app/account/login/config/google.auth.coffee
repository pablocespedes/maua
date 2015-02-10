module.exports =
  (apiUrl)->
    url: apiUrl+"auth/google"
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth"
    redirectUri: window.location.origin or
      window.location.protocol + "//" + window.location.host
    scope: [
      "profile"
      "email"
    ]
    clientId:"1034438962109-58nv5vn1e993a6tjh2sfqeu06t04sup4"+
    ".apps.googleusercontent.com"
    scopePrefix: "openid"
    scopeDelimiter: " "
    requiredUrlParams: ["scope"]
    optionalUrlParams: ["display"]
    display: "popup"
    type: "2.0"
    popupOptions:
      width: 580
      height: 400
