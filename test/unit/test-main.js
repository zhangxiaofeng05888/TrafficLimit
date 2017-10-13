/**
 * Created by xujie on 2016/5/4 0004.
 */
var TEST_REGEXP = /(spec|test)\.js$/i;
var allTestFiles = [];

// Get a list of all the test files to include
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (TEST_REGEXP.test(file)) {
            allTestFiles.push(file);
        }
    }
}
require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base',

    /* example of using a couple path translations (paths), to allow us
       to refer to different library dependencies, without using relative paths
     */
    paths: {
        jquery: 'scripts/libs/jquery/2.1.1/jquery-2.1.1',
        sweatAlert: 'scripts/libs/sweet-alert/js/sweet-alert.min',
        angular: 'scripts/libs/angularjs/1.4.4/angular',
        angularMocks: 'scripts/libs/angularjs/1.4.4/angular-mocks',
        ocLazyLoad: 'scripts/libs/ocLazyLoad/ocLazyLoad.require',
        uiLayout: 'scripts/libs/ui-layout/ui-layout',
        leaflet: 'scripts/libs/leaflet-0.7.3/leaflet-src',
        fastmap: 'scripts/mapApi/fastmap',
        Application: 'apps/roadnet/Application',
        appfunctions: 'scripts/uikits/road/appfunctions',
        mainApp: 'apps/roadnet/appOfEditor',
        rdCrossCtrl: 'scripts/components/road/ctrls/attr_cross_ctrl/rdCrossCtrl',
        'symbol.Matrix': 'scripts/mapApi/symbol/Matrix',
        'symbol.Vector': 'scripts/mapApi/symbol/Vector',
        'symbol.Point': 'scripts/mapApi/symbol/Point',
        'symbol.LineSegment': 'scripts/mapApi/symbol/LineSegment',
        'symbol.LineString': 'scripts/mapApi/symbol/LineString',
        'symbol.Template': 'scripts/mapApi/symbol/Template',
        'symbol.CircleMarkerSymbol': 'scripts/mapApi/symbol/CircleMarkerSymbol',
        'symbol.SquareMarkerSymbol': 'scripts/mapApi/symbol/SquareMarkerSymbol',
        'symbol.CrossMarkerSymbol': 'scripts/mapApi/symbol/CrossMarkerSymbol',
        'symbol.TiltedCrossMarkerSymbol': 'scripts/mapApi/symbol/TiltedCrossMarkerSymbol',
        'symbol.ImageMarkerSymbol': 'scripts/mapApi/symbol/ImageMarkerSymbol',
        'symbol.CompositeMarkerSymbol': 'scripts/mapApi/symbol/CompositeMarkerSymbol',
        'symbol.SimpleLineSymbol': 'scripts/mapApi/symbol/SimpleLineSymbol',
        'symbol.CartoLineSymbol': 'scripts/mapApi/symbol/CartoLineSymbol',
        'symbol.MarkerLineSymbol': 'scripts/mapApi/symbol/MarkerLineSymbol',
        'symbol.HashLineSymbol': 'scripts/mapApi/symbol/HashLineSymbol',
        'symbol.CompositeLineSymbol': 'scripts/mapApi/symbol/CompositeLineSymbol',
        'symbol.SymbolsFile': 'scripts/mapApi/symbol/SymbolsFile',
        'symbol.SymbolFactory': 'scripts/mapApi/symbol/SymbolFactory',
        'mapApi.AdLink': 'scripts/dataApi/road/AdLink',
        'mapApi.GeoDataModel': 'scripts/dataApi/road/GeoDataModel',
        'mapApi.Tile': 'scripts/mapApi/Tile'
    },

    // example of using a shim, to load non AMD libraries (such as underscore)
    shim: {
        angular: { deps: ['jquery'], exports: 'angular' },
        sweatAlert: ['jquery'],
        angularMocks: { deps: ['angular'], exports: 'angular.mock' },
        ocLazyLoad: ['angular'],
        uiLayout: ['angular'],
        leaflet: { exports: 'leaflet' },
        libs: ['leaflet', 'Application'],
        fastmap: { exports: 'fastmap' },
        Application: { exports: 'Application' },
        appfunctions: { deps: ['Application', 'libs'], exports: 'appfunctions' },
        mainApp: ['angular', 'ocLazyLoad', 'uiLayout', 'libs'],
        rdCrossCtrl: ['angular', 'mainApp', 'appfunctions', 'sweatAlert'],
        'symbol.Matrix': { deps: ['fastmap', 'leaflet'] },
        'symbol.Vector': { deps: ['fastmap', 'leaflet', 'symbol.Matrix'] },
        'symbol.Point': { deps: ['fastmap', 'leaflet', 'symbol.Matrix', 'symbol.Vector'] },
        'symbol.LineSegment': { deps: ['fastmap', 'leaflet', 'symbol.Point'] },
        'symbol.LineString': { deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineSegment'] },
        'symbol.Template': { deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString', 'symbol.LineSegment'] },
        'symbol.CircleMarkerSymbol': { deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString'] },
        'symbol.SquareMarkerSymbol': { deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString'] },
        'symbol.CrossMarkerSymbol': { deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString'] },
        'symbol.TiltedCrossMarkerSymbol': { deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString'] },
        'symbol.ImageMarkerSymbol': { deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString'] },
        'symbol.CompositeMarkerSymbol': { deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString'] },
        'symbol.SimpleLineSymbol': { deps: ['fastmap', 'leaflet', 'symbol.Template'] },
        'symbol.CartoLineSymbol': { deps: ['fastmap', 'leaflet', 'symbol.Template'] },
        'symbol.MarkerLineSymbol': { deps: ['fastmap', 'leaflet', 'symbol.Template'] },
        'symbol.HashLineSymbol': { deps: ['fastmap', 'leaflet', 'symbol.Template'] },
        'symbol.CompositeLineSymbol': { deps: ['fastmap', 'leaflet', 'symbol.Template'] },
        'mapApi.Tile': { deps: ['fastmap', 'leaflet'] },
        'symbol.SymbolsFile': { deps: ['fastmap'] },
        'mapApi.AdLink': { deps: ['mapApi.GeoDataModel'] },
        'mapApi.GeoDataModel': { deps: ['fastmap', 'leaflet'] },
        'symbol.SymbolFactory': {
            deps: ['symbol.CircleMarkerSymbol',
                'symbol.SquareMarkerSymbol',
                'symbol.CrossMarkerSymbol',
                'symbol.TiltedCrossMarkerSymbol',
                'symbol.ImageMarkerSymbol',
                'symbol.CompositeMarkerSymbol',
                'symbol.SimpleLineSymbol',
                'symbol.CartoLineSymbol',
                'symbol.MarkerLineSymbol',
                'symbol.HashLineSymbol',
                'symbol.CompositeLineSymbol',
                'symbol.SymbolsFile'
            ]
        }
    },

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start,

    waitSeconds: 0
});
