/**
 * Created by zhongxiaoming on 2017/4/9.
 */
FM.uikit.Config = FM.uikit.Config || {};
// 单例，只读 情报矢量化编辑工具
FM.uikit.Config.PretreatmentEditTool = (function () {
    var instance;

    var Singleton = function () {
        var config = {
            MODIFYFC: {
                title: '修改要素',
                text: '改',
                icon: '<span class="float-option-bar">移</span>'
            },
            ADDFC: {
                title: '新增要素',
                text: '增',
                icon: '<span class="float-option-bar">增</span>'
            },
            BREAKFC: {
                title: '打断要素',
                text: '断',
                icon: '<span class="float-option-bar">断</span>'
            }
        };

        this.getEditTool = function (toolType) {
            if (config[toolType]) {
                return config[toolType];
            }
            return null;
        };
    };

    return function () {
        if (!instance) {
            instance = new Singleton();
        }
        return instance;
    };
}());
