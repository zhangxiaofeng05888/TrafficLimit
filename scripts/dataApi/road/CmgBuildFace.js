/**
 * Created by liuzhe on 2016/7/25.
 */
FM.dataApi.CmgBuildFace = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.pid = data.pid;
        this.buildingPid = data.buildingPid;
        this.massing = data.massing;
        this.height = data.height;
        this.heightAcuracy = data.heightAcuracy;
        this.heightSource = data.heightSource;
        this.dataSource = data.dataSource;
        this.wallMaterial = data.wallMaterial;
        this.geometry = data.geometry;
        this.area = data.area || 0;
        this.perimeter = data.perimeter || 0;
        this.meshId = data.meshId || 0;
        this.rowId = data.rowId || null;
        this.geoLiveType = data.geoLiveType;
        this.createTime = data.createTime || null;

        if (typeof data.editFlag !== 'undefined') {
            this.editFlag = data.editFlag;
        } else {
            this.editFlag = 1;
        }

        this.tenants = [];
        if (data.tenants) {
            for (var i = 0, len = data.tenants.length; i < len; i++) {
                this.tenants.push(FM.dataApi.cmgBuildFaceTenant(data.tenants[i]));
            }
        }

        this.topos = [];
        if (data.topos) {
            for (var j = 0, lenTops = data.topos.length; j < lenTops; j++) {
                this.topos.push(FM.dataApi.cmgBuildFaceTopo(data.topos[j]));
            }
        }
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};

        data.pid = this.pid;
        data.buildingPid = this.buildingPid;
        data.massing = this.massing;
        data.height = this.height;
        data.heightAcuracy = this.heightAcuracy;
        data.heightSource = this.heightSource;
        data.dataSource = this.dataSource;
        data.wallMaterial = this.wallMaterial;
        data.geometry = this.geometry;
        data.area = this.area;
        data.perimeter = this.perimeter;
        data.meshId = this.meshId;
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        data.createTime = this.createTime;

        data.tenants = [];
        if (this.tenants) {
            for (var i = 0, len = this.tenants.length; i < len; i++) {
                data.tenants.push(this.tenants[i].getIntegrate());
            }
        }

        return data;
    },

    getSnapShot: function () {
        return this.getIntegrate();
    }
});
