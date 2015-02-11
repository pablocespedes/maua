'use strict'
Utilities =require('./services/utilities')
Authorization = require('./services/authorization')
AuthInterceptor=require('./services/authInterceptor')
Logger=require('./services/logger')
Alert=require('./services/alert')
Collection =require('./services/collection')
Observer = require('./services/observer')
Product = require('./services/product')
AppController= require('./app.controller')

module.exports = angular.module('grockitApp.app', [])
.factory 'utilities', Utilities
.factory 'authorization', Authorization
.factory 'authInterceptor', AuthInterceptor
.service 'logger', Logger
.factory 'alert', Alert
.factory 'collection', Collection
.factory 'Observer', Observer
.factory 'product', Product
.controller 'AppController', AppController
