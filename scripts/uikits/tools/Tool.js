/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.Tool = L.Class.extend({
    initialize: function () {
        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = '';
        this.isActive = false;
        this.map = null;
        this.onFinish = null;
        this.options = null;
        this.cursor = null;
    },

    onActive: function (map, onFinish, options) {
        if (this.isActive) {
            return true;
        }

        this.isActive = true;
        this.map = map;
        this.onFinish = onFinish;
        this.options = options;

        return true;
    },

    onDeactive: function () {
        if (!this.isActive) {
            return true;
        }

        this.isActive = false;
        this.map = null;
        this.onFinish = null;
        this.options = null;

        return true;
    },

    deny: function () {
        var toolController = fastmap.uikit.ToolController.getInstance();
        toolController.pause();
        this.cursor = this.map.getContainer().style.cursor;
        this.map.getContainer().style.cursor = 'not-allowed';
    },

    pause: function () {
        var toolController = fastmap.uikit.ToolController.getInstance();
        toolController.pause();
        this.cursor = this.map.getContainer().style.cursor;
        this.map.getContainer().style.cursor = 'wait';
    },

    continue: function () {
        var toolController = fastmap.uikit.ToolController.getInstance();
        toolController.continue();
        this.map.getContainer().style.cursor = this.cursor;
        this.cursor = null;
    },

    onLeftButtonDown: function (event) {
        this.checkIsActive();
        return true;
    },

    onMiddleButtonDown: function (event) {
        this.checkIsActive();
        return true;
    },

    onRightButtonDown: function (event) {
        this.checkIsActive();
        return true;
    },

    onLeftButtonUp: function (event) {
        this.checkIsActive();
        return true;
    },

    onMiddleButtonUp: function (event) {
        this.checkIsActive();
        return true;
    },

    onRightButtonUp: function (event) {
        this.checkIsActive();
        return true;
    },

    onLeftButtonClick: function (event) {
        this.checkIsActive();
        return true;
    },

    onMiddleButtonClick: function (event) {
        this.checkIsActive();
        return true;
    },

    onRightButtonClick: function (event) {
        this.checkIsActive();
        return true;
    },

    onLeftButtonDblClick: function (event) {
        this.checkIsActive();
        return true;
    },

    onMiddleButtonDblClick: function (event) {
        this.checkIsActive();
        return true;
    },

    onRightButtonDblClick: function (event) {
        this.checkIsActive();
        return true;
    },

    onMouseMove: function (event) {
        this.checkIsActive();
        return true;
    },

    onWheel: function (event) {
        this.checkIsActive();
        return true;
    },

    onKeyDown: function (event) {
        this.checkIsActive();
        return true;
    },

    onKeyUp: function (event) {
        this.checkIsActive();
        return true;
    },

    onKeyPress: function (event) {
        this.checkIsActive();
        return true;
    },

    checkIsActive: function () {
        if (!this.isActive) {
            throw new Error('工具[' + this.name + ']处于非激活状态!');
        }
    }
});
