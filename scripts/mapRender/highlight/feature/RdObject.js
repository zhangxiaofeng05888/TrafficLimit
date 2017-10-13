/**
 * 定义‘crf对象’要素选中时的高亮规则
 * @file      RdObject.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDOBJECT = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'RDOBJECT',
    zIndex: 0,
    defaultSymbol: 'pt_feature_relationBorder',
    topo: [{
        joinKey: 'links',
        highlight: {
            type: 'geoLiveObject',
            key: 'linkPid',
            layer: 'RDLINK',
            zIndex: 0,
            defaultSymbol: 'ls_link'
        }
    }, {
        joinKey: 'nodes',
        highlight: {
            type: 'geoLiveObject',
            key: 'nodePid',
            layer: 'RDNODE',
            zIndex: 2,
            defaultSymbol: 'pt_node_cross'
        }
    }, {
        joinKey: 'inters',
        highlight: {
            topo: [
                {
                    joinKey: 'links',
                    highlight: {
                        type: 'geoLiveObject',
                        key: 'linkPid',
                        layer: 'RDLINK',
                        zIndex: 1,
                        defaultSymbol: 'ls_rdLink_in'
                    }
                }, {
                    joinKey: 'nodes',
                    highlight: {
                        type: 'geoLiveObject',
                        key: 'nodePid',
                        layer: 'RDNODE',
                        zIndex: 2,
                        defaultSymbol: 'pt_node_cross'
                    }
                }
            ]
        }
    }, {
        joinKey: 'roads',
        highlight: {
            topo: [
                {
                    joinKey: 'links',
                    highlight: {
                        type: 'geoLiveObject',
                        key: 'linkPid',
                        layer: 'RDLINK',
                        zIndex: 1,
                        defaultSymbol: 'ls_rdLink_in'
                    }
                }
            ]
        }
    }]
};
