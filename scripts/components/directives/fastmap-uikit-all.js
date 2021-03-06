/**
 * Created by liwanchong on 2016/04/18.
 */
(function () {
    var jsFiles = [
        'components/directives/fastmap-uikit.js',
        'components/directives/loginForm/loginForm.js',
        'components/directives/showBox/showBox.js',
        'components/directives/fmTable/fmTable.js',
        'components/directives/collapse/collapse.js',
        'components/directives/collapseTool/collapse-tool.js',
        'components/directives/metaCollapse/collapse.js',
        'components/directives/fmEditView/fmEditView.js',
        'components/filter/langCodeFilter.js'

    ]; // etc.

    // use "parser-inserted scripts" for guaranteed execution order
    // http://hsivonen.iki.fi/script-execution/
    var scriptTags = new Array(jsFiles.length);
    var host = '../../scripts/';
    for (var i = 0, len = jsFiles.length; i < len; i++) {
        scriptTags[i] = "<script src='" + host + jsFiles[i] +
            "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(''));
    }
}());
