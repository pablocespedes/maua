angular.module('grockitApp.services', ['webStorageModule'])
    .factory('Utilities', function($http,webStorage,$rootScope,$location,$routeParams,$route) {
           var trackData = {
                tracks:[],
                trackTitle:''
            };

        function enviromentEvaluation(isNewGrockit){
            if(isNewGrockit){
               return location.host== '127.0.0.1:9000'  ? 'https://grockit.com' : location.origin+'/2.0';
            }
            else{
              return location.host== '127.0.0.1:9000'  ? 'https://staging.grockit.com' : location.host=='ww2.grockit.com' ? 'https://grockit.com' :location.origin
            }
            /*local enviroment*/
            /*if(isNewGrockit){

                return location.host== '127.0.0.1:9000'  ? 'http://127.0.0.1:9000/' : location.origin+'/2.0';
            }
            else{
                return location.host== '127.0.0.1:9000' ? 'https://staging.grockit.com' : location.host=='ww2.grockit.com' ? 'https://grockit.com' :location.origin
            }*/

        }
        return {
            newGrockit: function(){
                return {
                    url : enviromentEvaluation(true)
                };
            },
            originalGrockit: function(){
                return {
                    url : enviromentEvaluation(false)
                };
            },
            getActiveGroup: function() {
                $rootScope.activeGroupId = webStorage.get('currentUser').currentGroup;
                return  $rootScope.activeGroupId;
            },
            setActiveGroup: function(activeGroupId){
                $rootScope.activeGroupId = activeGroupId;
            },
            getActiveTrack: function () {
                return trackData;
            },
            setActiveTrack: function (data) {
                trackData=data;
            },
            findInArray: function (element, array, filter) {
                return  $.grep(array, function (val) {
                    return val[filter] == element;
                })[0];
            },
            getIndexArray : function (arr, key, val){
               for(var i = 0; i < arr.length; i++){
                   if(arr[i][key] == val)
                       return i;
               }
               return -1;
           },
            existsInArray: function (element, array) {
                return  ($.inArray(element, array)!==-1);
            },
            encodeRedirect: function (redirectUrl, url) {
                var fUrl = redirectUrl + encodeURIComponent(url);
                window.location.href = fUrl;
            },
            redirect: function (url) {
                var basePath = $location.host=='127.0.0.1' || 'grockit.firstfactoryinc.com' ? '' : 'v2';
                window.location.href = basePath+url;
            },
            setActiveTab: function (position) {
                this.clearActiveTab();
                var menuList = angular.element('div#main-menu-inner ul.navigation li');
                angular.element(menuList[position]).addClass('active');

            },
            clearActiveTab: function () {
                angular.element('div#main-menu-inner ul.navigation li').removeClass('active');
            },
            dialogService: function(options){
                bootbox.dialog(options);
            },
            getCurrentParam: function(key){
                return $route.current.pathParams[key];
            },
            setCurrentParam: function(key,param){
                $route.current.pathParams[key]=null;
                $route.current.pathParams[key]= param;
            }



        }
    })

    .factory('Alerts', function() {
        return {
            showAlert: function (alertMsg, type) {

                var options = {
                    type: type,
                    namespace: 'pa_page_alerts_dark',
                    classes: 'alert-dark'
                };
                PixelAdmin.plugins.alerts.add(alertMsg, options);
            },
            setErrorApiMsg: function (error) {
                return 'Uh oh! We\'re having difficulty retrieving your data.';
            }
        }

    })

    .factory('GrockitNewFeatures', function($http, Utilities) {

        return {
            showDialog: function () {
                var dialogOptions = {
                    title: "What's new in Grockit?",
                    message: ""
                    },
                url= location.host== '127.0.0.1:9000'  ? 'http://127.0.0.1:9000/' : location.origin+'/2.0';
                $http.get(url+'/common/templates/newFeatures2.0.html').success(function(data) {
                    dialogOptions.message=data;
                    Utilities.dialogService(dialogOptions);

                }).error(function (jqXHR, textStatus, errorThrown) {

               });
            }

        }

    });





