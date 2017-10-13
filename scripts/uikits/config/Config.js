FM.uikit.Config = {
    isTip: function (type) {
        return type.substr(0, 3) === 'TIP';
    },
    getName: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getName(type);
        }
        return new FM.uikit.Config.Feature().getName(type);
    },
    getDataModel: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getDataModel(type);
        }
        return new FM.uikit.Config.Feature().getDataModel(type);
    },
    getAddTemplate: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getAddTemplate(type);
        }
        return new FM.uikit.Config.Feature().getAddTemplate(type);
    },
    getEditTemplate: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getEditTemplate(type);
        }
        return new FM.uikit.Config.Feature().getEditTemplate(type);
    },
    getTipEditTemplate: function (type) {
        return new FM.uikit.Config.InfoTip().getEditTemplate(type);
    },
    getFCTipEditTemplate: function (type) {
        return new FM.uikit.Config.PretreatmentTip().getEditTemplate(type);
    },
    getViewTemplate: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getViewTemplate(type);
        }
        return new FM.uikit.Config.Feature().getViewTemplate(type);
    },
    // 获取传入对象类型依赖的对象类型
    getDepends: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getDepends(type);
        }
        return new FM.uikit.Config.Feature().getDepends(type);
    },

    // 获取依赖于传入对象类型的对象类型
    getDependOn: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getDependOn(type);
        }
        return new FM.uikit.Config.Feature().getDependOn(type);
    },

    // 获取传入tips对象类型
    getInfoTipDependOn: function (type) {
        return new FM.uikit.Config.InfoTip().getDependOn(type);
    },

    // 获取对象类型用到的几何编辑工具列表
    getObjectEditTools: function (type) {
        if (this.isTip(type)) {
            return null;
        }
        return new FM.uikit.Config.Feature().getEditTools(type);
    },
    // 获取tips用到的几何编辑工具列表
    getTipsEditTools: function (type) {
        return new FM.uikit.Config.InfoTip().getEditTools(type);
    },
    // 获取Fc预处理工具
    getFCEditTools: function (type) {
        return new FM.uikit.Config.PretreatmentTip().getEditTools(type);
    },
    // 获取几何编辑工具配置信息
    getEditTool: function (tool) {
        return new FM.uikit.Config.EditTool().getEditTool(tool);
    },
    getTipCode: function (type) {
        var conf = FM.uikit.Config.Tip().getConfig();
        if (conf) {
            return conf.code;
        }
        return null;
    },
    getUtilityConfig: function (type) {
        return new FM.uikit.Config.Utility().getConfig(type);
    },
    getUtilityName: function (type) {
        return new FM.uikit.Config.Utility().getName(type);
    },
    getUtilityTemplate: function (type) {
        return new FM.uikit.Config.Utility().getTemplate(type);
    },
    getFeatureMapping: function () {
        return FM.uikit.Config.Feature().getMapping();
    },
    getTipMapping: function () {
        return FM.uikit.Config.Tip().getMapping();
    }
};
