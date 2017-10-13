fastmap.uikit.editControl.MergeCircleControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.toolController.addTool(new fastmap.uikit.complexEdit.MergeSubTaskTool());
        this.dataService = fastmap.service.DataServiceEdit.getInstance();
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = new fastmap.uikit.complexEdit.MergeSubTaskResult();
        this.toolController.resetCurrentTool('MergeSubTaskTool', this.onToolFinish, {
            editResult: editResult
        });

        return true;
    },

    onToolFinish: function (editResult) {
        if (!this.precheck(editResult)) {
            return;
        }

        var self = this;
        swal({
            title: '请确认是否合并子任务圈!',
            type: 'warning',
            animation: 'slide-from-top',
            showCancelButton: true,
            confirmButtonText: '是',
            cancelButtonText: '否',
            confirmButtonColor: '#ec6c62'
        }, function (f) {
            if (f) {
                var params = {
                    taskId: App.Temp.taskId,
                    condition: {
                        id1: editResult.selectSubTaskIds[0],
                        id2: editResult.selectSubTaskIds[1]
                    }
                };
                self.dataService.planSubTask(params)
                    .then(self.onCreateSuccess)
                    .catch(self.onCreateFail);
            }
        });
    },

    onCreateSuccess: function (res) {
        this.toolController.resetCurrentTool('PanTool');
        this.eventController.fire(L.Mixin.EventTypes.DRAWTASKCIRCLE);
        this.run();
    },

    onCreateFail: function (err) {
        this.toolController.resetCurrentTool('PanTool');
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
