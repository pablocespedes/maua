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
    })

    .factory('GaUtility', function(){

        function load_ga_script(userData){
            $()
        }
        google_account = "UA-44112604-1";
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', google_account]);
        _gaq.push(['_setDomainName', '.grockit.com']);
        if(Auth.isLoggedIn)
        {
            _gaq.push(['_setCustomVar', 1, 'Studying_For', userData.currentGroup, 1]);
            _gaq.push(['_setCustomVar', 2, 'User_Type', userData.role, 2]);
            _gaq.push(['_setCustomVar', 3, 'Last_Lobby', userData.currentGroup, 3]);
            _gaq.push(['_setCustomVar', 4, 'User_ID', userData.userId, 4]);
            _gaq.push(['_trackPageview']);
            _gaq.push(['_trackPageLoadTime']);
            function(){
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga,s);
            }();
        }


    });