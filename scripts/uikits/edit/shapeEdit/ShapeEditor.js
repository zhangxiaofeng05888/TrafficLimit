/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.shapeEdit.ShapeEditor = L.Class.extend({
    initialize: function (options) {
        fastmap.uikit.Editor.prototype.initialize.call(this, options);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.toolController = fastmap.uikit.ToolController.getInstance();
        this.operationController = fastmap.uikit.operation.OperationController.getInstance();
        this.snapController = fastmap.mapApi.snap.SnapController.getInstance();
        this.eventController = fastmap.uikit.EventController();

        this.name = '';
        this.isEditing = false;
        this.editResult = null;
        this.originEditResult = null;
        this.onFinish = null;

        this.eventController.on(L.Mixin.EventTypes.SHAPEEDITTOOLCHANGED, this.onShapeToolChanged);
        this.eventController.on(L.Mixin.EventTypes.SHAPEEDITSNAPACTORCHANGED, this.onSnapActorChanged);
    },

    loadTools: function () {
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PointAddTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PointMoveTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PathSmoothTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PathVertexAddTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PathVertexInsertTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PathVertexMoveTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PathVertexRemoveTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.TipBorderTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PoiAddTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PoiUpdateTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PointLocationTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PointGuideLinkTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PolygonSmoothTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PolygonVertexAddTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PolygonVertexInsertTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PolygonVertexMoveTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PolygonVertexRemoveTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.PointTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.TipLaneConnexityTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.BreakTipLinksTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.TipSketchTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.TipNomalRestrictionTool());
        this.toolController.addTool(new fastmap.uikit.shapeEdit.TipLinkUpDownDepartTool());
    },

    start: function (editResult, onFinish) {
        if (this.isEditing) {
            this.abort();
        }

        this.operationController.clear();

        this.isEditing = true;

        this.editResult = editResult;

        var checkController = editResult.checkController;
        editResult.checkController = null;
        this.originEditResult = FM.Util.clone(editResult);
        this.originEditResult.checkController = checkController;
        editResult.checkController = checkController;

        this.onFinish = onFinish;

        var defaultToolName = null;
        var tools = [];
        var isCreate = true;
        if (this.editResult.originObject) {
            isCreate = false;
        }
        var type = this.editResult.type;
        switch (type) {
            case 'PointAddResult':
                defaultToolName = 'PointAddTool';
                break;
            case 'PointMoveResult':
                defaultToolName = 'PointMoveTool';
                break;
            case 'PathResult':
                tools = this.getLinkTools();
                defaultToolName = isCreate ? 'PathVertexAddTool' : 'PathSmoothTool';
                break;
            case 'TipBorderResult':
                defaultToolName = 'TipBorderTool';
                break;
            case 'IxPoiResult':
                defaultToolName = isCreate ? 'PoiAddTool' : 'PoiUpdateTool';
                break;
            case 'PointLocationResult':
                defaultToolName = 'PointLocationTool';
                break;
            case 'PointGuideLinkResult':
                defaultToolName = 'PointGuideLinkTool';
                break;
            case 'PolygonResult':
                tools = this.getPolygonTools();
                defaultToolName = isCreate ? 'PolygonVertexAddTool' : 'PolygonSmoothTool';
                break;
            case 'PointResult':
                defaultToolName = 'PointTool';
                break;
            case 'TipLaneConnexityResult':
                defaultToolName = 'TipLaneConnexityTool';
                break;
            case 'BreakTipLinksResult':
                defaultToolName = 'BreakTipLinksTool';
                break;
            case 'TipSketchResult':
                defaultToolName = 'TipSketchTool';
                break;
            case 'TipNomalRestrictionResult':
                defaultToolName = 'TipNomalRestrictionTool';
                break;
            default:
                throw new Error('不支持的形状编辑类型:' + type);
        }

        this.toolController.resetCurrentTool(defaultToolName, this.onToolFinish, {
            editResult: editResult,
            toolOptions: this.options
        });
        this.checkTool(tools, defaultToolName);

        var snapActors = this.getSnapActors();

        this.eventController.fire(L.Mixin.EventTypes.OPENSHAPEEDITPANEL);
        this.eventController.fire(L.Mixin.EventTypes.REFRESHSHAPEEDITPANELTOOLS, {
            tools: tools
        });
        this.eventController.fire(L.Mixin.EventTypes.REFRESHSHAPEEDITPANELSNAPACTORS, {
            snapActors: snapActors
        });
    },

    stop: function () {
        if (!this.isEditing) {
            return;
        }

        this.isEditing = false;
        this.editResult = null;
        this.originEditResult = null;
        this.onFinish = null;

        this.operationController.clear();

        this.eventController.fire(L.Mixin.EventTypes.CLOSESHAPEEDITPANEL);

        this.toolController.resetCurrentTool('PanTool', null, null);
    },

    abort: function () {
        if (!this.isEditing) {
            return;
        }

        this.isEditing = false;
        this.editResult = null;
        this.originEditResult = null;
        this.onFinish = null;

        this.operationController.clear();

        this.eventController.fire(L.Mixin.EventTypes.CLOSESHAPEEDITPANEL);

        this.toolController.resetCurrentTool('PanTool', null, null);
    },

    onShapeToolChanged: function (args) {
        var toolItem = args.tool;
        this.toolController.resetCurrentTool(toolItem.toolName, this.onToolFinish, {
            toolOptions: this.options
        });

        var snapActors = this.getSnapActors();
        this.eventController.fire(L.Mixin.EventTypes.REFRESHSHAPEEDITPANELSNAPACTORS, {
            snapActors: snapActors
        });
    },

    onSnapActorChanged: function (args) {
        var snapItem = args.snapActor;
        var snapActors = this.editResult.snapActors;
        snapActors[snapItem.index].enable = snapItem.enable;
        var currentTool = this.toolController.currentTool;
        currentTool.refresh();
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        var currentTool = this.toolController.currentTool;
        currentTool.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        var currentTool = this.toolController.currentTool;
        currentTool.refresh();
    },

    createOperation: function (name, newEditResult) {
        var operation = new fastmap.uikit.operation.EditResultOperation(
            name,
            this.onRedo,
            this.onUndo,
            this.editResult,
            newEditResult);
        if (!operation.canDo()) {
            var currentTool = this.toolController.currentTool;
            currentTool.refresh();
            var err = operation.getError();
            currentTool.setCenterError(err, 2000);
            return;
        }
        this.operationController.add(operation);
    },

    getLinkTools: function () {
        var tools = [];
        tools.push(this.createToolItem('平滑修形', '平滑修形', 'PathSmoothTool', false));
        // 只有刚创建的link才显示延长线功能；
        if (!this.editResult.originObject) {
            tools.push(this.createToolItem('延长线', '延长线', 'PathVertexAddTool', false));
        }
        tools.push(this.createToolItem('插入形状点', '插入形状点', 'PathVertexInsertTool', false));
        tools.push(this.createToolItem('移动形状点', '移动形状点', 'PathVertexMoveTool', false));
        tools.push(this.createToolItem('删除形状点', '删除形状点', 'PathVertexRemoveTool', false));
        return tools;
    },

    getPolygonTools: function () {
        var tools = [];
        tools.push(this.createToolItem('平滑修形', '平滑修形', 'PolygonSmoothTool', false));
        tools.push(this.createToolItem('绘制点', '绘制形状点', 'PolygonVertexAddTool', false));
        tools.push(this.createToolItem('插入形状点', '插入形状点', 'PolygonVertexInsertTool', false));
        tools.push(this.createToolItem('移动形状点', '移动形状点', 'PolygonVertexMoveTool', false));
        tools.push(this.createToolItem('删除形状点', '删除形状点', 'PolygonVertexRemoveTool', false));
        return tools;
    },

    createToolItem: function (title, text, toolName, checked) {
        var item = {
            title: title,
            text: text,
            toolName: toolName,
            checked: checked
        };
        return item;
    },

    getSnapActors: function () {
        var snapItems = [];
        var currentTool = this.toolController.currentTool;
        if (currentTool.name !== 'PathVertexAddTool' && currentTool.name !== 'PathSmoothTool') {
            return snapItems;
        }

        if (!this.editResult.snapActors) {
            return snapItems;
        }

        var snapActors = this.editResult.snapActors;
        for (var i = 0; i < snapActors.length; ++i) {
            var snapActor = snapActors[i];
            var snapItem = this.createSnapItem(i, snapActor.geoLiveType, snapActor.enable);
            snapItems.push(snapItem);
        }
        return snapItems;
    },

    createSnapItem: function (index, geoLiveType, enable) {
        var item = {
            index: index,
            geoLiveType: geoLiveType,
            enable: enable
        };
        return item;
    },

    checkTool: function (tools, toolName) {
        for (var i = 0; i < tools.length; ++i) {
            var tool = tools[i];
            if (tool.toolName === toolName) {
                tool.checked = true;
                return;
            }
        }
    },

    onToolFinish: function () {
        if (!this.onFinish) {
            return;
        }

        this.onFinish(this.editResult);
    },

    /**
     * 销毁单例对象
     */
    destroy: function () {
        fastmap.uikit.shapeEdit.ShapeEditor.instance = null;
        this.eventController.off(L.Mixin.EventTypes.SHAPEEDITTOOLCHANGED, this.onShapeToolChanged);
        this.eventController.off(L.Mixin.EventTypes.SHAPEEDITSNAPACTORCHANGED, this.onSnapActorChanged);
    },

    statics: {
        instance: null,

        getInstance: function (options) {
            if (!fastmap.uikit.shapeEdit.ShapeEditor.instance) {
                fastmap.uikit.shapeEdit.ShapeEditor.instance =
                    new fastmap.uikit.shapeEdit.ShapeEditor(options);
            }
            return fastmap.uikit.shapeEdit.ShapeEditor.instance;
        }
    }
});
