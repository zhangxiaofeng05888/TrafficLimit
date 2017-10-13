/**
 * 分歧类要素的前端数据模型
 * @class FM.mapApi.render.data.RdBranch
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdBranch = function (data) {
    var parts = [];
    for (var key = 0; key < data.m.a.length; key++) {
        for (var cnt = 0; cnt < data.m.a[key].ids.length; cnt++) {
            var branchPart = new FM.mapApi.render.data.RdBranchPart(data, key, cnt);
            // if (cnt > 0) { // 同一进入线类型相同的点不重复渲染，但是需要加到tile里
            //    branchPart.properties.symbol = null;
            // }
            parts.push(branchPart);
        }
    }
    return parts;
};
