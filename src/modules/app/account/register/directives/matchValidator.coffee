matchValidator = ->
  require: "ngModel"
  link: (scope, element, attrs, ngModel) ->
    ngModel.$parsers.push (value) ->
      ngModel.$setValidity "match", value is scope.$eval(attrs.matchValidator)
      value
    return
module.exports = matchValidator