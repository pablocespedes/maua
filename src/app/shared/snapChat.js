(function() {
    var se = document.createElement('script');
    se.type = 'text/javascript';
    se.async = true;
    se.src = '//storage.googleapis.com/code.snapengage.com/js/6c178ece-6137-40a1-a6e0-df07b645725a.js';
    var done = false;
    se.onload = se.onreadystatechange = function() {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
            done = true;
            /* Place your SnapEngage JS API code below */
            /* SnapEngage.allowChatSound(true); Example JS API: Enable sounds for Visitors. */
        }
    };
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(se, s);
})();
