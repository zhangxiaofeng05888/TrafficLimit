/**
 * 警示信息的前端数据模型
 * @class FM.mapApi.render.data.RdWarningInfos
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdWarningInfos = function (data) {
    var parts = [];
    for (var index = 0; index < data.m.info.length; index++) {
        var warningInfoPart = new FM.mapApi.render.data.RdWarningInfoPart(data, index);
        parts.push(warningInfoPart);
    }
    return parts;
};
