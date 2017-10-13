/**
 * Created by zhongxiaoming on 2017/4/9.
 */
FM.uikit.Config = FM.uikit.Config || {};
// 单例，只读 情报矢量化编辑工具
FM.uikit.Config.InfoEditTool = (function () {
    var instance;

    var Singleton = function () {
        var config = {
            SELECTPARENT: {
                title: '编辑父',
                text: '父',
                icon: "<div class='icon-father'></div>"
            },
            POISAME: {
                title: '同一关系',
                text: '同',
                icon: "<div class='icon-same'></div>"
            },
            MODIFY: {
                title: '修改要素',
                text: '移',
                icon: '<span class="float-option-bar">改</span>'
            },
            ADDPAIRBOND: {
                title: '增加配对关系',
                text: '配',
                icon: '<span class="float-option-bar">配</span>'
            },
            UPDATE: {
                title: '修改要素',
                text: '改',
                icon: '<span class="float-option-bar">改</span>'
            },
            BREAK: {
                title: '修改要素',
                text: '断',
                icon: '<span class="float-option-bar">断</span>'
            },
            COPY: {
                title: '复制要素',
                text: '分',
                icon: '<span class="float-option-bar">分</span>'
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
