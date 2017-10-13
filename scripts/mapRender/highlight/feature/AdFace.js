/**
 * 定义‘行政区划面’要素选中时的高亮规则
 * @file      AdFace.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.ADFACE = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'ADFACE',
    zIndex: 0,
    defaultSymbol: 'py_face'
};
