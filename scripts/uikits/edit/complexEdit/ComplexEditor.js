/**
 * Created by linglong on 2016/3/22.
 */

fastmap.uikit.complexEdit.ComplexEditor = fastmap.uikit.Editor.extend({
    initialize: function (options) {
        fastmap.uikit.Editor.prototype.initialize.call(this, options);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.checkController = fastmap.uikit.check.CheckController.getInstance();
        this.toolController = fastmap.uikit.ToolController.getInstance();
        this.isEditing = false;
        this.editResult = null;
        this.onFinish = null;

        this.loadTools();
    },

    loadTools: function () {
        this.toolController.addTool(new fastmap.uikit.complexEdit.UpDownDepartTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.SideRoadTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.AdminJoinFacesTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.AddPairElectronicEyeTool());
        this.toolController.addTool(new fastmap.uikit.relationEdit.LineDimensionsTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.SelectPoiParentTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.SamePoiTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.ChangeLinkDirectTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.LinksAutoBreakTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.BatchTranslatePoiLocationTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.BatchConvergePoiLocationTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.BatchPoiGuideAutoTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.BatchPoiGuideManualTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.AdjustImageTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.CopyTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.DrawPolygonTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.BatchEditLimitTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.BreakEditLineTool());
        this.toolController.addTool(new fastmap.uikit.complexEdit.TrackTool());
    },

    start: function (editResult, onFinish) {
        if (this.isEditing) {
            this.abort();
        }

        this.isEditing = true;

        this.editResult = editResult;
        this.onFinish = onFinish;

        var type = this.editResult.type;
        var toolName;
        switch (type) {
            case 'UpDownDepartResult':
                toolName = 'UpDownDepartResult';
                break;
            case 'SideRoadResult':
                toolName = 'SideRoadResult';
                break;
            case 'AddPairElectronicEyeResult':
                toolName = 'AddPairElectronicEyeTool';
                break;
            case 'PoiParentResult':
                toolName = 'SelectPoiParentTool';
                break;
            case 'SamePoiResult':
                toolName = 'SamePoiTool';
                break;
            case 'LineDimensionsResult': // 线划构面
                toolName = 'LineDimensionsTool';
                break;
            case 'AdminJoinFacesResult':
                toolName = 'AdminJoinFacesTool';
                break;
            case 'LinkDirectResult':
                toolName = 'ChangeLinkDirectTool';
                break;
            case 'LinksAutoBreakResult':
                toolName = 'LinksAutoBreakTool';
                break;
            case 'BatchTranslatePoiLocationEditResult':
                toolName = 'BatchTranslatePoiLocationTool';
                break;
            case 'BatchConvergePoiLocationEditResult':
                toolName = 'BatchConvergePoiLocationTool';
                break;
            case 'BatchPoiGuideAutoEditResult':
                toolName = 'BatchPoiGuideAutoTool';
                break;
            case 'BatchPoiGuideManualEditResult':
                toolName = 'BatchPoiGuideManualTool';
                break;
            case 'AdjustImageResult':
                toolName = 'AdjustImageTool';
                break;
            case 'TipLinkUpDownDepartResult':
                toolName = 'TipLinkUpDownDepartTool';
                break;
            case 'CopyResult':
                toolName = 'CopyTool';
                break;
            case 'DrawPolygonResult':
                toolName = 'DrawPolygonTool';
                break;
            case 'BatchEditLimitResult':
                toolName = 'BatchEditLimitTool';
                break;
            case 'BreakEditLineResult':
                toolName = 'BreakEditLineTool';
                break;
            case 'TrackResult':
                toolName = 'TrackTool';
                break;
            default:
                throw new Error('未知的编辑类型');
        }

        this.toolController.resetCurrentTool(toolName, this.onToolFinish, {
            editResult: editResult,
            toolOptions: this.options
        });
    },

    stop: function () {
        if (!this.isEditing) {
            return;
        }

        this.isEditing = false;
        this.editResult = null;
        this.onFinish = null;

        this.toolController.resetCurrentTool('PanTool', null, null);
    },

    abort: function () {
        if (!this.isEditing) {
            return;
        }

        this.isEditing = false;
        this.editResult = null;
        this.onFinish = null;

        this.toolController.resetCurrentTool('PanTool', null, null);
    },

    onToolFinish: function (editResult) {
        if (!this.onFinish) {
            return;
        }

        this.editResult = editResult;

        this.onFinish(this.editResult);
    },

    destroy: function () {
        fastmap.uikit.complexEdit.ComplexEditor.instance = null;
    },

    statics: {
        instance: null,

        getInstance: function (options) {
            if (!fastmap.uikit.complexEdit.ComplexEditor.instance) {
                fastmap.uikit.complexEdit.ComplexEditor.instance =
                    new fastmap.uikit.complexEdit.ComplexEditor(options);
            }
            return fastmap.uikit.complexEdit.ComplexEditor.instance;
        }
    }
});
