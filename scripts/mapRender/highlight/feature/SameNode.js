/**
 * 定义‘同一点’要素选中时的高亮规则
 * @file      SameNode.js
 * @author    MaLi
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.SAMENODE = {
    topo: [{
        joinKey: 'RDNODE',
        highlight: {
            type: 'geoLiveObject',
            key: 'nodePid',
            layer: 'rdNode',
            zIndex: 1,
            rule: {
                attribute: 'isMain',
                forks: [{
                    value: 1,
                    symbol: 'pt_rdNode_sameMain'
                }],
                defaultSymbol: 'pt_rdNode_same'
            }
        }
    }, {
        joinKey: 'ADNODE',
        highlight: {
            type: 'geoLiveObject',
            key: 'nodePid',
            layer: 'adNode',
            zIndex: 1,
            defaultSymbol: 'pt_adNode_same'
        }
    }, {
        joinKey: 'ZONENODE',
        highlight: {
            type: 'geoLiveObject',
            key: 'nodePid',
            layer: 'zoneNode',
            zIndex: 1,
            defaultSymbol: 'pt_zoneNode_same'
        }
    }, {
        joinKey: 'LUNODE',
        highlight: {
            type: 'geoLiveObject',
            key: 'nodePid',
            layer: 'luNode',
            zIndex: 1,
            defaultSymbol: 'pt_luNode_same'
        }
    }]
};
