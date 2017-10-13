/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.check.CheckController = L.Class.extend({
    initialize: function (options) {
        // 绑定函数作用域
        FM.Util.bind(this);

        this.checkEngines = {};
        this.loadCheckEngines();
    },

    loadCheckEngines: function () {
        var config = fastmap.uikit.check.CheckConfig;
        var keys = Object.getOwnPropertyNames(config);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var value = config[key];
            this.checkEngines[key] = {};
            this.createCheckEnginesByType(key, value);
        }
    },

    createCheckEnginesByType: function (geoLiveType, config) {
        var keys = Object.getOwnPropertyNames(config);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var situation = key;
            var checkEngine = new fastmap.uikit.check.CheckEngine(geoLiveType, situation);
            var ruleNames = config[key];
            this.loadCheckRules(checkEngine, ruleNames);
            this.checkEngines[geoLiveType][situation] = checkEngine;
        }
    },

    loadCheckRules: function (checkEngine, ruleNames) {
        for (var i = 0; i < ruleNames.length; ++i) {
            var ruleName = ruleNames[i];
            var rule = new fastmap.uikit.check.rule[ruleName]();
            checkEngine.addRule(rule);
        }
    },

    getCheckEngine: function (geoLiveType, situation) {
        var featureEngines = this.checkEngines[geoLiveType];
        if (!featureEngines) {
            return null;
        }
        return featureEngines[situation];
    },

    destroy: function () {
        fastmap.uikit.check.CheckController.instance = null;
    },

    statics: {
        instance: null,

        getInstance: function () {
            if (!fastmap.uikit.check.CheckController.instance) {
                fastmap.uikit.check.CheckController.instance =
                    new fastmap.uikit.check.CheckController();
            }
            return fastmap.uikit.check.CheckController.instance;
        }
    }
});
