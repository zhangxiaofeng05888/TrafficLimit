/**
 * Created by wangtun on 2016/3/15.
 */
FM.dataApi.RdBranch = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.rowId = data.rowId || null;
        this.branchPid = data.pid; // modified by chenx on 20161214: 为了不同分歧类型的高亮
        this.inLinkPid = data.inLinkPid;
        this.nodePid = data.nodePid;
        this.outLinkPid = data.outLinkPid;
        this.relationshipType = data.relationshipType || 1;
        this.realimages = [];
        var i;
        if (data.realimages.length > 0) {
            for (i = 0; i < data.realimages.length; i++) {
                var realImage = new FM.dataApi.RdBranchRealImage(data.realimages[i]);
                this.realimages.push(realImage);
            }
        }

        this.schematics = [];
        if (data.schematics.length > 0) {
            for (i = 0; i < data.schematics.length; i++) {
                var schemtic = new FM.dataApi.RdBranchSchematic(data.schematics[i]);
                this.schematics.push(schemtic);
            }
        }

        this.seriesbranches = [];
        if (data.seriesbranches.length > 0) {
            for (i = 0; i < data.seriesbranches.length; i++) {
                var seriesBranch = new FM.dataApi.RdBranchSeriesBranch(data.seriesbranches[i]);
                this.seriesbranches.push(seriesBranch);
            }
        }

        this.signasreals = [];
        if (data.signasreals.length > 0) {
            for (i = 0; i < data.signasreals.length; i++) {
                var signasReal = new FM.dataApi.RdBranchSignAsreal(data.signasreals[i]);
                this.signasreals.push(signasReal);
            }
        }

        this.signboards = [];
        if (data.signboards.length > 0) {
            for (i = 0; i < data.signboards.length; i++) {
                var signBoard = new FM.dataApi.RdBranchSignBoard(data.signboards[i]);
                this.signboards.push(signBoard);
            }
        }

        this.vias = [];
        if (data.vias.length > 0) {
            for (i = 0; i < data.vias.length; i++) {
                var via = new FM.dataApi.RdBranchVia(data.vias[i]);
                this.vias.push(via);
            }
        }

        this.details = [];
        if (data.details.length > 0) {
            for (i = 0; i < data.details.length; i++) {
                var detail = new FM.dataApi.RdBranchDetail(data.details[i]);
                this.details.push(detail);
            }
        }
        // modified by chenx on 20161214: 为了不同分歧类型的高亮，不同类型的分歧的pid取值不同，与canvasFeature保持一致
        // if (data.branchType) {
        //     this.branchType = data.branchType;
        //     this.pid = data.pid;
        // } else
        if (data.details.length) {
            this.branchType = data.details[0].branchType;
            this.pid = data.details[0].pid;
            switch (this.branchType) {
                case 0:
                    this.geoLiveType = 'RDHIGHSPEEDBRANCH';
                    break;
                case 1:
                    this.geoLiveType = 'RDASPECTBRANCH';
                    break;
                case 2:
                    this.geoLiveType = 'RDICBRANCH';
                    break;
                case 3:
                    this.geoLiveType = 'RD3DBRANCH';
                    break;
                case 4:
                    this.geoLiveType = 'RDCOMPLEXSCHEMA';
                    break;
                default:
                    break;
            }
        } else if (data.realimages.length) {
            this.branchType = 5;
            this.pid = data.realimages[0].rowId;
            this.geoLiveType = 'RDREALIMAGE';
        } else if (data.schematics.length) {
            this.branchType = 8;
            this.pid = data.schematics[0].pid;
            this.geoLiveType = 'RDSCHEMATICBRANCH';
        } else if (data.seriesbranches.length) {
            this.branchType = 7;
            this.pid = data.seriesbranches[0].rowId;
            this.geoLiveType = 'RDSERIESBRANCH';
        } else if (data.signasreals.length) {
            this.branchType = 6;
            this.pid = data.signasreals[0].pid;
            this.geoLiveType = 'RDSIGNASREAL';
        } else if (data.signboards.length) {
            this.branchType = 9;
            this.pid = data.signboards[0].pid;
            this.geoLiveType = 'RDSIGNBOARD';
        }
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.branchPid;
        data.rowId = this.rowId;
        data.inLinkPid = this.inLinkPid;
        data.nodePid = this.nodePid;
        data.outLinkPid = this.outLinkPid;
        data.geoLiveType = this.geoLiveType;
        data.relationshipType = this.relationshipType;
        data.realimages = [];
        var i;
        for (i = 0; i < this.realimages.length; i++) {
            data.realimages.push(this.realimages[i].getIntegrate());
        }

        data.schematics = [];
        for (i = 0; i < this.schematics.length; i++) {
            data.schematics.push(this.schematics[i].getIntegrate());
        }

        data.seriesbranches = [];
        for (i = 0; i < this.seriesbranches.length; i++) {
            data.seriesbranches.push(this.seriesbranches[i].getIntegrate());
        }

        data.signasreals = [];
        for (i = 0; i < this.signasreals.length; i++) {
            data.signasreals.push(this.signasreals[i].getIntegrate());
        }

        data.signboards = [];
        for (i = 0; i < this.signboards.length; i++) {
            data.signboards.push(this.signboards[i].getIntegrate());
        }

        data.vias = [];
        for (i = 0; i < this.vias.length; i++) {
            data.vias.push(this.vias[i].getIntegrate());
        }

        data.details = [];
        for (i = 0; i < this.details.length; i++) {
            data.details.push(this.details[i].getIntegrate());
        }

        data.branchType = this.branchType;
        data.rowId = this.rowId;
        return data;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.branchPid;
        data.rowId = this.rowId;
        data.inLinkPid = this.inLinkPid;
        data.nodePid = this.nodePid;
        data.outLinkPid = this.outLinkPid;
        data.relationshipType = this.relationshipType;
        data.realimages = [];
        var i;
        for (i = 0; i < this.realimages.length; i++) {
            data.realimages.push(this.realimages[i].getIntegrate());
        }

        data.schematics = [];
        for (i = 0; i < this.schematics.length; i++) {
            data.schematics.push(this.schematics[i].getIntegrate());
        }

        data.seriesbranches = [];
        for (i = 0; i < this.seriesbranches.length; i++) {
            data.seriesbranches.push(this.seriesbranches[i].getIntegrate());
        }

        data.signasreals = [];
        for (i = 0; i < this.signasreals.length; i++) {
            data.signasreals.push(this.signasreals[i].getIntegrate());
        }

        data.signboards = [];
        for (i = 0; i < this.signboards.length; i++) {
            data.signboards.push(this.signboards[i].getIntegrate());
        }

        data.vias = [];
        for (i = 0; i < this.vias.length; i++) {
            data.vias.push(this.vias[i].getIntegrate());
        }

        data.details = [];
        for (i = 0; i < this.details.length; i++) {
            data.details.push(this.details[i].getIntegrate());
        }
        data.branchType = this.branchType;
        data.rowId = this.rowId;
        return data;
    },

    _doValidate: function () {
        if (this.signboards.length) {
            for (var i = 0; i < this.signboards.length; i++) {
                this.signboards[i]._doValidate();
            }
        }
        if (this.details.length > 0) {
            for (var j = 0; j < this.details.length; j++) {
                if (this.details[j].branchType == 1 || this.details[j].branchType == 2) {
                    this.details[j]._doValidate();
                }
            }
        }
    }
});
/** *
 * rdBranch初始化函数
 * @param data 分歧数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdBranch}
 */
FM.dataApi.rdBranch = function (data, options) {
    return new FM.dataApi.RdBranch(data, options);
};
