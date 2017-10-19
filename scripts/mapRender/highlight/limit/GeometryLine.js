/**
 * Created by zhaohang on 2017/10/19.
 */
/**
 * 定义‘道路线’要素选中时的高亮规则
 * @file      RdLink.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.GEOMETRYLINE = {
    topo: [{
        joinKey: 'geometry',
        highlight: {
            type: 'geometry',
            zIndex: 1,
            defaultSymbol: 'ls_link'
        }
    }]
};
