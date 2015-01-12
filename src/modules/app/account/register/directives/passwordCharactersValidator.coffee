passwordCharactersValidator = ->
  PASSWORD_FORMATS = [
    /[^\w\s]+/ #special characters
    /[A-Z]+/ #uppercase letters
    /\w+/ #other letters
    /\d+/ #numbers
  ]
  require: "ngModel"
  link: (scope, element, attrs, ngModel) ->
    ngModel.$parsers.push (value) ->
      status = true
      angular.forEach PASSWORD_FORMATS, (regex) ->
        status = status and regex.test(value)
        return

      ngModel.$setValidity "password-characters", status
      value

module.exports = passwordCharactersValidator