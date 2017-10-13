/**
 * 线限速的前端数据模型
 * @class FM.mapApi.render.data.RdLinkSpeedLimit
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdLinkSpeedLimit = function (item) {
    var parts = [];
    if (item.m.f == '0') { // 线限速
        var speedData = item.m.e[0].split(',');
        if (item.m.a != undefined && item.m.b != undefined) {
            var forwardData = [];
            forwardData.push(speedData[0]);
            forwardData.push(speedData[1]);
            forwardData.push(speedData[4]);
            parts.push(new FM.mapApi.render.data.RdLinkSpeedLimitPart(item.i, item.m.a, item.m.b, 2, forwardData));
        }
        if (item.m.c != undefined && item.m.d != undefined) {
            var reverseData = [];
            reverseData.push(speedData[2]);
            reverseData.push(speedData[3]);
            reverseData.push(speedData[4]);
            parts.push(new FM.mapApi.render.data.RdLinkSpeedLimitPart(item.i, item.m.c, item.m.d, 3, reverseData));
        }
    }
    if (item.m.f == '3') {
        var conditionData = item.m.e;
        if (item.m.a != undefined && item.m.b != undefined) {
            var conditionForwardData = [];
            for (var i = 0; i < conditionData.length; i++) {
                var conditionArray = conditionData[i].split(',');
                var conditionForwardArray = [];
                if (parseInt(conditionArray[0], 10) !== 0) {
                    conditionForwardArray.push(conditionArray[0]);
                    conditionForwardArray.push(conditionArray[1]);
                    conditionForwardArray.push(conditionArray[4]);
                    conditionForwardData.push(conditionForwardArray);
                }
            }
            parts.push(new FM.mapApi.render.data.RdLinkSpeedLimitDependent(item.i, item.m.a, item.m.b, 2, conditionForwardData));
        }
        if (item.m.c != undefined && item.m.d != undefined) {
            var conditionReverseData = [];
            for (var j = 0; j < conditionData.length; j++) {
                var conditionArray1 = conditionData[j].split(',');
                var conditionReverseArray = [];
                if (parseInt(conditionArray1[2], 10) !== 0) {
                    conditionReverseArray.push(conditionArray1[2]);
                    conditionReverseArray.push(conditionArray1[3]);
                    conditionReverseArray.push(conditionArray1[4]);
                    conditionReverseData.push(conditionReverseArray);
                }
            }
            parts.push(new FM.mapApi.render.data.RdLinkSpeedLimitDependent(item.i, item.m.c, item.m.d, 3, conditionReverseData));
        }
    }
    // if (item.m.a != undefined && item.m.b != undefined) {
    //    parts.push(new FM.mapApi.render.data.RdLinkSpeedLimitPart(item.i, item.m.a, item.m.b, 2, item.m.f,
    // item.m.e)); } if (item.m.c != undefined && item.m.d != undefined) { parts.push(new
    // FM.mapApi.render.data.RdLinkSpeedLimitPart(item.i, item.m.c, item.m.d, 3, item.m.f, item.m.e)); }
    return parts;
};
