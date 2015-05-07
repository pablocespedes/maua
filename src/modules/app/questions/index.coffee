'use strict'
module.exports = angular.module('grockitApp.questions', [])

.factory 'entriesService', require('./services/entries.services')
.factory 'questionTypeService', require('./services/question.services')
.directive 'oneChoice', require('./directives/one-choice/one-choice')

.directive 'multipleChoice',
require('./directives/multiple-choice/multiple-choice')

.directive 'multipleMatrix2x3',
require('./directives/multiple-matrix2x3/multiple-matrix2x3')

.directive 'multipleMatrix3x3',
require('./directives/multiple-matrix3x3/multiple-matrix3x3')

.directive 'twoChoice', require('./directives/two-choice/two-choice')
.directive 'provisionalSat',
require('./directives/provisional-sat/provisional-sat')

.directive 'numericEntry', require('./directives/numeric-entry/numeric-entry')
.directive 'fractionEntry',
require('./directives/fraction-entry/fraction-entry')

