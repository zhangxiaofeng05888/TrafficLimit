/**
 * Created by xujie3949 on 2016/12/8.
 * 单例对象,管理地图中所有的工具
 */

fastmap.uikit.ToolController = L.Class.extend({
    initialize: function () {
        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();

        this.dblClickTimeInterval = 300;

        this.dblClickDisInterval = 1;

        this.lastClickTime = null;

        this.lastClickPos = null;

        this.map = null;

        // 所有注册的工具,不包含后台工具
        this.tools = {};

        // 所有的后台工具
        this.backTools = {};

        // 当前的工具
        this.currentTool = null;

        // 指示当前工具是否运行,对背景后台工具无效
        this.isRunning = true;

        this.loadTools();

        this.resetLastClickStatus();
    },

    loadTools: function () {
        this.addTool(new fastmap.uikit.PanTool());
        this.addTool(new fastmap.uikit.selectTool.PointSelectTool());
        this.addTool(new fastmap.uikit.selectTool.RectSelectTool());
        this.addTool(new fastmap.uikit.selectTool.TrackSelectTool());
        this.addTool(new fastmap.uikit.selectTool.StreetViewSelectTool());
        this.addTool(new fastmap.uikit.selectTool.PolygonSelectTool());
        this.addTool(new fastmap.uikit.assistantTool.DistanceTool());
        this.addTool(new fastmap.uikit.assistantTool.AngleTool());
        this.addTool(new fastmap.uikit.assistantTool.AreaTool());
    },

    setMap: function (map) {
        this.map = map;
    },

    resetLastClickStatus: function () {
        this.lastClickTime = 0;

        this.lastClickPos = {
            type: 'Point',
            coordinates: [-Number.MAX_VALUE, -Number.MAX_VALUE]
        };
    },

    /**
     * 添加工具,不激活工具
     * 如果工具已经存在则忽略
     * @param tool
     */
    addTool: function (tool) {
        if (this.tools.hasOwnProperty(tool.name)) {
            return;
        }

        this.tools[tool.name] = tool;
    },

    /**
     * 根据名称删除工具
     * 如果工具未注册则忽略
     * 如果工具处于激活状态,先退出激活状态
     * @param toolName
     */
    delTool: function (toolName) {
        if (!this.tools.hasOwnProperty(toolName)) {
            return;
        }

        if (toolName === this.currentTool.name) {
            this.currentTool.onDeactive();
            this.currentTool = null;
        }

        delete this.tools[toolName];
    },

    /**
     * 添加后台工具,并激活工具
     * 如果工具已经存在则忽略
     * @param tool
     */
    addBackTool: function (tool) {
        if (this.backTools.hasOwnProperty(tool.name)) {
            return;
        }

        tool.onActive();
        this.backTools.tools[tool.name] = tool;
    },

    /**
     * 根据名称删除后台工具
     * 如果工具未注册则忽略
     * 如果工具处于激活状态,先退出激活状态
     * @param toolName
     */
    delBackTool: function (toolName) {
        if (!this.backTools.hasOwnProperty(toolName)) {
            return;
        }

        var tool = this.backTools[toolName];
        tool.onDeactive();

        delete this.backTools[toolName];
    },

    /**
     * 根据名称设置当前工具
     * @param toolName
     * @param onFinish
     * @param options
     * @returns {boolean}
     */
    resetCurrentTool: function (toolName, onFinish, options) {
        this.continue();

        if (!this.tools.hasOwnProperty(toolName)) {
            return false;
        }

        var tool = this.tools[toolName];

        if (this.currentTool) {
            this.currentTool.onDeactive();
        }

        if (!tool.onActive(this.map, onFinish, options)) {
            return false;
        }

        this.currentTool = tool;
        return true;
    },

    clearCurrentTool: function () {
        if (this.currentTool) {
            this.currentTool.onDeactive();
            this.currentTool = null;
        }
    },

    /**
     * 暂停当前工具
     */
    pause: function () {
        this.isRunning = false;
    },

    /**
     * 继续当前工具
     */
    continue: function () {
        this.isRunning = true;
    },

    onMouseDown: function (event) {
        var buttonType = this.getButtonType(event.originalEvent.button);
        switch (buttonType) {
            case 'leftButton':
                this.dispatchEvent('onLeftButtonDown', event);
                break;
            case 'middleButton':
                this.dispatchEvent('onMiddleButtonDown', event);
                break;
            case 'rightButton':
                this.dispatchEvent('onRightButtonDown', event);
                break;
            default:
                throw new Error('未知按键类型:' + buttonType);
        }
    },

    onMouseUp: function (event) {
        var buttonType = this.getButtonType(event.originalEvent.button);
        switch (buttonType) {
            case 'leftButton':
                this.dispatchEvent('onLeftButtonUp', event);
                break;
            case 'middleButton':
                this.dispatchEvent('onMiddleButtonUp', event);
                break;
            case 'rightButton':
                this.dispatchEvent('onRightButtonUp', event);
                break;
            default:
                throw new Error('未知按键类型:' + buttonType);
        }

        // 鼠标弹起的时候处理模拟click事件
        var now = new Date().getTime();
        var diffTime = now - this.lastClickTime;
        var pos = this.PointToGeojson(event.layerPoint);
        var diffDis = this.geometryAlgorithm.distance(pos, this.lastClickPos);
        if (diffTime < this.dblClickTimeInterval && diffDis < this.dblClickDisInterval) {
            this.onDblClick(event);
            // 双击触发后恢复状态
            this.resetLastClickStatus();
        } else {
            this.onClick(event);
            this.lastClickPos = pos;
            this.lastClickTime = now;
        }
    },

    onMouseMove: function (event) {
        this.dispatchEvent('onMouseMove', event);
    },

    onWheel: function (event) {
        this.dispatchEvent('onWheel', event);
    },

    onClick: function (event) {
        var buttonType = this.getButtonType(event.originalEvent.button);
        switch (buttonType) {
            case 'leftButton':
                this.dispatchEvent('onLeftButtonClick', event);
                break;
            case 'middleButton':
                this.dispatchEvent('onMiddleButtonClick', event);
                break;
            case 'rightButton':
                this.dispatchEvent('onRightButtonClick', event);
                break;
            default:
                throw new Error('未知按键类型:' + buttonType);
        }
    },

    onDblClick: function (event) {
        var buttonType = this.getButtonType(event.originalEvent.button);
        switch (buttonType) {
            case 'leftButton':
                this.dispatchEvent('onLeftButtonDblClick', event);
                break;
            case 'middleButton':
                this.dispatchEvent('onMiddleButtonDblClick', event);
                break;
            case 'rightButton':
                this.dispatchEvent('onRightButtonDblClick', event);
                break;
            default:
                throw new Error('未知按键类型:' + buttonType);
        }
    },

    onKeyDown: function (event) {
        this.dispatchEvent('onKeyDown', event);
        this.onKeyPress(event);
    },

    onKeyUp: function (event) {
        this.dispatchEvent('onKeyUp', event);
    },

    onKeyPress: function (event) {
        this.dispatchEvent('onKeyPress', event);
    },

    getButtonType: function (button) {
        switch (button) {
            case 0:
                return 'leftButton';
            case 1:
                return 'middleButton';
            case 2:
                return 'rightButton';
            default:
                throw new Error('位置按键类型:' + button);
        }
    },

    dispatchEvent: function (eventName, event) {
        for (var i = 0; i < this.backTools.length; ++i) {
            var tool = this.backTools[i];
            this.callEventHandler(tool, eventName, event);
        }

        if (this.currentTool && this.isRunning) {
            this.callEventHandler(this.currentTool, eventName, event);
        }
    },

    callEventHandler: function (tool, eventName, event) {
        var eventMethod = tool[eventName];
        if (eventMethod) {
            try {
                eventMethod.call(tool, event);
            } catch (err) {
                FM.Util.log(err);
            }
        }
    },

    PointToGeojson: function (point) {
        var geojson = {
            type: 'Point',
            coordinates: [point.x, point.y]
        };
        return geojson;
    },

    /**
     * 销毁单例对象
     */
    destroy: function () {
        fastmap.uikit.ToolController.instance = null;
    },

    statics: {
        instance: null,

        getInstance: function () {
            if (!fastmap.uikit.ToolController.instance) {
                fastmap.uikit.ToolController.instance =
                    new fastmap.uikit.ToolController();
            }
            return fastmap.uikit.ToolController.instance;
        }
    }
});
