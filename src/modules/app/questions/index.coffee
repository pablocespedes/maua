'use strict'

FractionEntry = require('./directives/fraction-entry/fraction-entry')
MultiplChoice = require('./directives/multiple-choice/multiple-choice')
Matrix2x3 = require('./directives/multiple-matrix2x3/multiple-matrix2x3')
Matrix2x3 = require('./directives/multiple-matrix3x3/multiple-matrix3x3')
NumericEntry = require('./directives/numeric-entry/numeric-entry')
OneChoice = require('./directives/one-choice/one-choice')
Sat = require('./directives/sat/sat')
TwoChoice = require('./directives/two-choice/two-choice')

module.exports = angular.module('grockitApp.questions', [])
.directive 'fraction', -> new FractionEntry()
.directive 'trackList', -> new MultiplChoice()
.directive 'trackList', -> new Matrix2x3()
.directive 'trackList', -> new Matrix2x3()
.directive 'trackList', -> new NumericEntry()
.directive 'trackList', -> new Sat()
.directive 'trackList', -> new TwoChoice()
