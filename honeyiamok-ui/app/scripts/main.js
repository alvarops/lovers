require.config({
    paths: {
        jquery: 'libs/jquery',
        jqueryMobile: 'libs/jquery.mobile-1.4.4'
    },
    shim: {
        "libs/jquery.mobile-1.4.4'": {
            deps: ["jquery"],
            exports: 'jquery'
        },
    }
});

require([
	"jquery",
    "jqueryMobile",
    'app',
], function($, App) {
    console.log('jQuery version ' + $().jquery + ' installed');
    App.initialize();
});
