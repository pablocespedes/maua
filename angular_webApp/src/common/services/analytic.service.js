angular.module('grockitApp.analyticService', [])
    .factory('ListenloopUtility', function(){

        function load_script(userData){
            $('<script>'+ 
                    'function fkVisitorData(){'+
                        'return {'+
                            '"email":"'+userData.emailAddress+'",'+
                            '"segment":"'+userData.role+'",'+
                            '"custom_properties":{'+
                                '"full_name":"'+userData.fullName+'",'+
                                '"user_id":"'+userData.userId+'",'+
                                '"group":"'+userData.currentGroup+'",'+
                                '"env":"Grockit 2.0"'+
                            '}'+
                        '}'+
                    '}'+
                '</script>').appendTo(document.body)
        }

        return {
            base: function(userData){
                load_script(userData);
                var fks = document.createElement('script');
                    fks.type = 'text/javascript';
                    fks.async = true;
                    fks.setAttribute("fk-userid", "136");
                    fks.setAttribute("fk-server", "fkapp.herokuapp.com");
                    fks.src = ('https:' == document.location.protocol ? 'https://':'http://') + 'd1g3gvqfdsvkse.cloudfront.net/assets/featurekicker.js';
                var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(fks, s);
            }
        }
    });