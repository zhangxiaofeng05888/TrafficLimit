/**
 * 定义‘市街图面’要素选中时的高亮规则
 * @file      CmgBuildFace.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.CMGBUILDFACE = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'CMGBUILDFACE',
    zIndex: 0,
    defaultSymbol: 'pt_face'
};
