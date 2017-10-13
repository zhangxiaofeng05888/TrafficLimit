FM.uikit.Config = FM.uikit.Config || {};
// 单例，只读
FM.uikit.Config.EditTool = (function () {
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
                text: '改',
                icon: '<span class="float-option-bar">改</span>'
            },
            MODIFYVIA: {
                title: '修改经过线',
                text: '经',
                icon: '<span class="float-option-bar">经</span>'
            },
            DIRECT: {
                title: '修改道路方向',
                text: '方',
                icon: '<span class="float-option-bar">方</span>'
            },
            DELETECLOSEDVERTEX: {
                title: '删除连续过近形状点',
                text: '删过近',
                icon: '<span class="float-option-bar">删除过近形状点</span>'
            },
            ADDPAIRBOND: {
                title: '增加配对关系',
                text: '配',
                icon: '<span class="float-option-bar">配</span>'
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
