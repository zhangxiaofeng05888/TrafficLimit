/**
 * 定义‘土地利用面’要素选中时的高亮规则
 * @file      LuFace.js
 * @author    WangMingDong
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.LUFACE = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'LUFACE',
    zIndex: 0,
    defaultSymbol: 'pt_face'
};
