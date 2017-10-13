/**
 * 定义‘TMC匹配信息’要素选中时的高亮规则
 * @file      RdTmcLocation.js
 * @author    WangMingDong
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDTMCLOCATION = {
    topo: [{
        joinKey: 'links',
        highlight: {
            type: 'geoLiveObject',
            key: 'linkPid',
            layer: 'rdLink',
            zIndex: 1,
            defaultSymbol: 'ls_tmc_link'
        }
    }]
};
