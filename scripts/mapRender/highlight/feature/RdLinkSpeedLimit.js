/**
 * 定义‘线限速’要素选中时的高亮规则
 * @file      RdLinkSpeedLimit.js
 * @author    ZhaoHang
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDLINKSPEEDLIMIT = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'RDLINKSPEEDLIMIT',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [
        {
            joinKey: 'linkPid',
            highlight: {
                type: 'pid',
                layer: 'RDLINK',
                zIndex: 1,
                defaultSymbol: 'relationEdit_ls_inLink'
            }
        }, {
            joinKey: 'links',
            highlight: {
                type: 'pid',
                layer: 'RDLINK',
                zIndex: 1,
                defaultSymbol: 'relationEdit_ls_viaLink'
            }
        }
    ]
};
