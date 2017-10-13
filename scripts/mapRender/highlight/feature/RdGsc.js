/**
 * 定义‘立交’要素选中时的高亮规则
 * @file      RdGsc.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDGSC = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'RDLINK',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [{
        joinKey: 'links',
        highlight: {
            type: 'geoLiveObject',
            key: 'linkPid',
            layer: 'RDLINK',
            zIndex: 1,
            rule: {
                attribute: 'zlevel',
                forks: [{
                    value: 0,
                    symbol: 'ls_link_part_0'
                }, {
                    value: 1,
                    symbol: 'ls_link_part_1'
                }, {
                    value: 2,
                    symbol: 'ls_link_part_2'
                }, {
                    value: 3,
                    symbol: 'ls_link_part_3'
                }],
                defaultSymbol: 'ls_link'
            }
        }
    }, {
        joinKey: 'links',
        highlight: {
            type: 'geoLiveObject',
            key: 'linkPid',
            layer: 'RWLINK',
            zIndex: 1,
            rule: {
                attribute: 'zlevel',
                forks: [{
                    value: 0,
                    symbol: 'ls_link_part_0'
                }, {
                    value: 1,
                    symbol: 'ls_link_part_1'
                }, {
                    value: 2,
                    symbol: 'ls_link_part_2'
                }, {
                    value: 3,
                    symbol: 'ls_link_part_3'
                }],
                defaultSymbol: 'ls_link'
            }
        }
    }, {
        joinKey: 'links',
        highlight: {
            type: 'geoLiveObject',
            key: 'linkPid',
            layer: 'LCLINK',
            zIndex: 1,
            rule: {
                attribute: 'zlevel',
                forks: [{
                    value: 0,
                    symbol: 'ls_link_part_0'
                }, {
                    value: 1,
                    symbol: 'ls_link_part_1'
                }, {
                    value: 2,
                    symbol: 'ls_link_part_2'
                }, {
                    value: 3,
                    symbol: 'ls_link_part_3'
                }],
                defaultSymbol: 'ls_link'
            }
        }
    }, {
        joinKey: 'links',
        highlight: {
            type: 'geoLiveObject',
            key: 'linkPid',
            layer: 'CMGBUILDLINK',
            zIndex: 1,
            rule: {
                attribute: 'zlevel',
                forks: [{
                    value: 0,
                    symbol: 'ls_link_part_0'
                }, {
                    value: 1,
                    symbol: 'ls_link_part_1'
                }, {
                    value: 2,
                    symbol: 'ls_link_part_2'
                }, {
                    value: 3,
                    symbol: 'ls_link_part_3'
                }],
                defaultSymbol: 'ls_link'
            }
        }
    }]
};
