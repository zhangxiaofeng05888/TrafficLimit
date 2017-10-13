/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class OutPutController
 */
fastmap.uikit.OutPutController = (function () {
    var instantiated;

    function init(options) {
        var Controller = L.Class.extend({
            options: {},
            initialize: function (option) {
                L.setOptions(this, option);
                this.outPuts = [];
                this.updateOutPuts = '';
            },
            /** *
             * 添加output
             * @param {Object}output
             */
            pushOutput: function (output) {
                this.outPuts.push(output);
            },
            /** *
             * 顶端移除一个ouput
             * @param {Object}output
             */
            popOutput: function (output) {
                this.outPuts.pop(output);
            },
            /** *
             * 内容排序
             * @param sortfun
             */
            sort: function (sortfun) {},
            /** *
             * 清空
             */
            clear: function () {
                this.outPuts = [];
            }
        });
        return new Controller(options);
    }
    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    };
}());
