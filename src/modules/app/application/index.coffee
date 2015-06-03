'use strict'
module.exports = angular.module('grockitApp.app', [])
.factory 'storage', require('./services/_storage')
.service 'errorHandler', require('./services/errors')
.factory 'userNotify', require('./services/user.notify')
.factory 'menuService', require('./services/menu')
.factory 'levels', require('./services/level.services')
.factory 'questionTiming', require('./services/question.timing')
.factory 'youtube', require('./services/youtube')
.factory 'dateUtils', require('./services/date.utils')
.factory 'dateFormatter', require('./services/date.formatter')
.factory 'userPreflight', require('./services/userPreflight')
.factory 'resource', require('./services/_api.base')
.factory 'utilities', require('./services/utilities')
.factory 'timer', require('./services/timer')
.factory 'authorization', require('./services/authorization')
.factory 'authInterceptor', require('./services/authInterceptor')
.factory 'alert', require('./services/alert')
.factory 'collection', require('./services/collection')
.factory 'Observer', require('./services/observer')
.factory 'product', require('./services/product')
.factory 'user', require('./services/user')
.factory 'groups', require('./services/groups')
.factory 'membership', require('./services/membership')
.factory 'payBanner', require('./services/banner.payments')
.factory 'scoreNotifier', require('./services/score.notifier')
.filter 'formatSeconds', require('./filters/formatSeconds')
.filter 'truncate', require('./filters/truncate')
.filter 'date', require('./filters/date')
.filter 'time', require('./filters/time')
.filter 'htmlToPlaintext', require('./filters/htmlToPlaintext')
.filter 'level', require('./filters/level')
.filter 'capitalize', require ('./filters/capitalize')
.controller 'AppController', require('./app.controller')
.directive 'questionTags', require('./directives/question-tags/question-tags')
.directive 'questionTiming', require('./directives/quest-timing/quest-timing')
.directive 'userSettings', require('./directives/user-settings/user-settings')
.directive 'scorePrediction', require('./directives/score/score')
.directive 'prFirstPanel',
require('./directives/pr-first-panel/pr-first-panel')
.directive 'prSecPanel',
require('./directives/pr-sec-panel/pr-sec-panel')

