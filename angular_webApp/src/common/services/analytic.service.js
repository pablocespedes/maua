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

    .factory('GaUtility', function() {
    GA_classic_id = "UA-44112604-1";
    GA_UA_id = "UA-44112604-4";

    return {
      classic: function () {
        $('<script>' +
          'var _gaq = _gaq || [];' +
          '_gaq.push(["_setAccount", "UA-44112604-1"]);' +
          '_gaq.push(["_setDomainName", ".grockit.com"]);' +
          '_gaq.push(["_trackPageview"]);' +
          '_gaq.push(["_trackPageLoadTime"]);' +
          '</script>').appendTo(document.body)

        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);

      },
      UA: function () {
        (function (i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r;
          i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
          }, i[r].l = 1 * new Date();
          a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
          a.async = 1;
          a.src = g;
          m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', GA_UA_id, 'grockit.com');
        ga('require', 'displayfeatures');
        ga('send', 'pageview');

      }
    }

  });