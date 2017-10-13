/**
 * 定义‘限高限重’要素选中时的高亮规则
 * @file      RdHgwgLimit.js
 * @author    WangMingDong
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDHGWGLIMIT = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'RDHGWGLIMIT',
    zIndex: 0,
    defaultSymbol: 'pt_feature_relationBorder',
    topo: [{
        joinKey: 'linkPid',
        highlight: {
            type: 'pid',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_in'
        }
    }]
};
