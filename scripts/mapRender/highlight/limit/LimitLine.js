/**
 * Created by zhaohang on 2017/11/15.
 */
/**
 * 定义‘限行线’要素选中时的高亮规则
 * @file      LimitLine.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.LIMITLINE = {
    topo: [{
        joinKey: 'geometry',
        highlight: {
            type: 'geometry',
            zIndex: 1,
            defaultSymbol: 'ls_link'
        }
    }]
};
