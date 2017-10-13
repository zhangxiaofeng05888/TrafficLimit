/**
 * Created by wangmingdong on 2016/6/1.
 */
FM.dataApi.IxCheckResult = FM.dataApi.DataModel.extend({
    dataModelType: 'IX_CHECK_RESULT',

    setAttributes: function (data) {
        this.pid = data.id;
        this.ruleId = data.ruleid || '';
        this.geometry = data.geometry;
        this.information = data.information || '';
        this.rank = data.rank;
        this.targetsText = data.targets || '';
        this.targets = [];
        if (data.targets && data.targets.split(';').length > 0) {
            var list = data.targets.split(';');
            var temp;
            for (var i = 0; i < list.length; i++) {
                temp = list[i].replace(/\[|]/g, '').split(',');
                this.targets.push({
                    featType: temp[0].split('_').join(''),
                    pid: temp[1]
                });
            }
        }
        this.worker = data.worker;
        this.createDate = data.create_date;
        this.updateDate = data.update_date;
        this.status = data.status;
        this.qaStatus = data.qa_status;
        this.qaWorker = data.qa_worker;
        this.refFeatures = data.refFeatures || []; // poi检查结果预留
        this.jobId = data.jobId;
    },

    getIntegrate: function () {
        var ret = {};
        ret.create_date = this.createDate;
        ret.geometry = this.geometry;
        ret.id = this.pid;
        ret.information = this.information;
        ret.rank = this.rank;
        ret.ruleid = this.ruleId;
        ret.targets = this.targetsText;
        ret.worker = this.worker;
        return ret;
    }
});
