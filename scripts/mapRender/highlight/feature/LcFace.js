/**
 * 定义‘土地覆盖面’要素选中时的高亮规则
 * @file      LcFace.js
 * @author    WangMingDong
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.LCFACE = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'LCFACE',
    zIndex: 0,
    defaultSymbol: 'pt_face'
};
