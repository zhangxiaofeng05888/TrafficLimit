/**
 * 分歧类要素的前端数据模型
 * @class FM.mapApi.render.data.RdBranchPart
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdBranchPart = FM.mapApi.render.data.Feature.extend({
    geometry: {},
    properties: {},
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @param  {number} key 键
     * @param  {number} index 索引
     * @return {undefined}
     */
    setAttribute: function (data, key, index) {
        this.geometry.type = 'Point';
        this.geometry.coordinates = [data.g[0] + key * 30, data.g[1]];
        // this.properties.id = data.m.a[key].ids[index].detailId;
        this.properties.branchPid = data.m.a[key].ids[index].branchPid;
        // this.properties.rowId = data.m.a[key].ids[index].rowId;
        switch (data.m.a[key].type) {
            case 0: // 高速分歧
                this.properties.geoLiveType = 'RDHIGHSPEEDBRANCH';
                break;
            case 1: // 方面分歧
                this.properties.geoLiveType = 'RDASPECTBRANCH';
                break;
            case 2: // IC分歧
                this.properties.geoLiveType = 'RDICBRANCH';
                break;
            case 3: // 3d分歧
                this.properties.geoLiveType = 'RD3DBRANCH';
                break;
            case 4: // 复杂路口模式图
                this.properties.geoLiveType = 'RDCOMPLEXSCHEMA';
                break;
            case 5: // 实景图
                this.properties.geoLiveType = 'RDREALIMAGE';
                break;
            case 6: // 实景看板
                this.properties.geoLiveType = 'RDSIGNASREAL';
                break;
            case 7: // 连续分歧
                this.properties.geoLiveType = 'RDSERIESBRANCH';
                break;
            case 8: // 交叉点大路口模式图
                this.properties.geoLiveType = 'RDSCHEMATICBRANCH';
                break;
            case 9: // 方向看板
                this.properties.geoLiveType = 'RDSIGNBOARD';
                break;
            default:
                break;
        }
        // this.properties.geoLiveType = 'RDBRANCH';
        this.properties.rotate = data.m.c;
        this.properties.branchType = data.m.a[key].type;
        if (this.properties.branchType === 5 || this.properties.branchType === 7) { // detailId中存储的rowId值，字符串
            this.properties.id = data.m.a[key].ids[index].detailId;
        } else { // detailId中存储的子类型的id值，数字
            this.properties.id = parseInt(data.m.a[key].ids[index].detailId, 10);
        }
    }
});
