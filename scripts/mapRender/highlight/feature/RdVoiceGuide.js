/**
 * 定义‘语音引导’要素选中时的高亮规则
 * @file      RdVoiceGuide.js
 * @author    WangMingDong
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDVOICEGUIDE = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'RDVOICEGUIDE',
    zIndex: 0,
    defaultSymbol: 'pt_feature_relationBorder',
    topo: [{
        joinKey: 'nodePid',
        highlight: {
            type: 'pid',
            layer: 'RDNODE',
            zIndex: 1,
            defaultSymbol: 'pt_rdNode_in'
        }
    }, {
        joinKey: 'inLinkPid',
        highlight: {
            type: 'pid',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_in'
        }
    }, {
        joinKey: 'details',
        highlight: {
            topo: [{
                joinKey: 'outLinkPid',
                highlight: {
                    type: 'pid',
                    layer: 'RDLINK',
                    zIndex: 1,
                    defaultSymbol: 'ls_rdLink_out'
                }
            },
            {
                joinKey: 'vias',
                highlight: {
                    type: 'geoLiveObject',
                    key: 'linkPid',
                    layer: 'RDLINK',
                    zIndex: 1,
                    defaultSymbol: 'ls_rdLink_via'
                }
            }]
        }
    }]
};
