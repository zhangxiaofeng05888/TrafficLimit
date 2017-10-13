/**
 * 定义‘季节性关闭道路’tips选中时的高亮规则
 * @file      TipSeasonalRoad.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPSEASONALROAD = { // 1516 季节性关闭道路
    // 起点和终点 多线
    topo: [
        {
            joinKey: 'deep',
            highlight: {
                topo: [
                    {
                        joinKey: 'gSLoc',
                        highlight: {
                            type: 'geometry',
                            zIndex: 1,
                            defaultSymbol: 'tip_circle'
                        }
                    }, {
                        joinKey: 'gELoc',
                        highlight: {
                            type: 'geometry',
                            zIndex: 1,
                            defaultSymbol: 'tip_circle'
                        }
                    }, {
                        joinKey: 'f_array',
                        highlight: {
                            topo: [
                                {
                                    joinKey: 'id',
                                    highlight: {
                                        type: 'pid',
                                        layer: 'RDLINK',
                                        zIndex: 1,
                                        defaultSymbol: 'ls_boders'
                                    }
                                }, {
                                    joinKey: 'id',
                                    highlight: {
                                        type: 'pid',
                                        layer: 'TIPLINKS',
                                        zIndex: 1,
                                        defaultSymbol: 'ls_boders'
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }, {
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
        }
    ]
};

