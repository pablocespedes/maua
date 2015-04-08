'use strict'
Menu = require('./services/menu')
Levels = require('./services/level.services')
formatSeconds = require('./filters/formatSeconds')
truncate = require('./filters/truncate')
date = require('./filters/date')
time = require('./filters/time')
htmlToPlaintext = require('./filters/htmlToPlaintext')
level = require('./filters/level')
capitalize = require ('./filters/capitalize')
Resource = require('./services/_api.base')
DateUtils = require('./services/date.utils')
Utilities =require('./services/utilities')
Authorization = require('./services/authorization')
AuthInterceptor=require('./services/authInterceptor')
Logger=require('./services/logger')
Alert=require('./services/alert')
Collection =require('./services/collection')
Observer = require('./services/observer')
Product = require('./services/product')
AppController = require('./app.controller')
User = require('./services/user')
Groups = require('./services/groups')
UserPreflight = require('./services/userPreflight')
Membership = require('./services/membership')
Timer = require('./services/timer')
Youtube = require('./services/youtube')

module.exports = angular.module('grockitApp.app', [])
.factory 'menuService', Menu
.factory 'levels', Levels
.filter 'formatSeconds', formatSeconds
.filter 'truncate', truncate
.filter 'date', date
.filter 'time', time
.filter 'htmlToPlaintext', htmlToPlaintext
.filter 'level', level
.filter 'capitalize', capitalize
.factory 'youtube', Youtube
.factory 'dateUtils', DateUtils
.factory 'userPreflight', UserPreflight
.factory 'resource', Resource
.factory 'utilities', Utilities
.factory 'timer', Timer
.factory 'authorization', Authorization
.factory 'authInterceptor', AuthInterceptor
.service 'logger', Logger
.factory 'alert', Alert
.factory 'collection', Collection
.factory 'Observer', Observer
.factory 'product', Product
.factory 'user', User
.factory 'groups', Groups
.factory 'membership', Membership
.controller 'AppController', AppController
