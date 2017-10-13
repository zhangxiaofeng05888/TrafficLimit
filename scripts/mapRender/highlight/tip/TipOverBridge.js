/**
 * 定义‘过街天桥’tips选中时的高亮规则
 * @file      TipOverBridge.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPOVERBRIDGE = {
    topo: [
        {
            joinKey: 'geometry',
            highlight: {
                topo: [
                    {
                        joinKey: 'g_location',
                        highlight: {
                            type: 'geometry',
                            zIndex: 1,
                            defaultSymbol: 'ls_boders'
                        }
                    }
                ]
            }
        }, {
            joinKey: 'deep',
            highlight: {
                topo: [
                    {
                        joinKey: 'geo',
                        highlight: {
                            type: 'geometry',
                            zIndex: 1,
                            defaultSymbol: 'tip_circle'
                        }
                    }
                ]
            }
        }
    ]
};
