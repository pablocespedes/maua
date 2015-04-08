'use strict'
EntriesServices = require('./services/entries.services')
QuestionTypeServices = require('./services/question.services')
FractionEntry = require('./directives/fraction-entry/fraction-entry')
MultiplChoice = require('./directives/multiple-choice/multiple-choice')
Matrix2x3 = require('./directives/multiple-matrix2x3/multiple-matrix2x3')
Matrix2x3 = require('./directives/multiple-matrix3x3/multiple-matrix3x3')
NumericEntry = require('./directives/numeric-entry/numeric-entry')
OneChoice = require('./directives/one-choice/one-choice')
ProvisionalSat = require('./directives/provisional-sat/provisional-sat')
TwoChoice = require('./directives/two-choice/two-choice')


module.exports = angular.module('grockitApp.questions', [])

.factory 'entriesService', EntriesServices
.factory 'questionTypeService', QuestionTypeServices
.directive 'oneChoice', OneChoice
.directive 'multipleChoice', MultiplChoice
.directive 'multipleMatrix2x3', Matrix2x3
.directive 'multipleMatrix3x3', Matrix2x3
.directive 'twoChoice', TwoChoice
.directive 'provisionalSat', ProvisionalSat
.directive 'numericEntry', NumericEntry
.directive 'fractionEntry', FractionEntry

