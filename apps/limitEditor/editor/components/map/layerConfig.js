/**
 * Created by zhongxiaoming on 2015/08/07.
 * Rebuild by chenxiao on 2016-06-30
 */
App.editorLayerConfig = [{
    // 第三方的背景地图，以及图幅、网格和照片图层
    groupId: 'backgroundLayers',
    groupName: '背景',
    layers: [{
        clazz: L.tileLayer.wms,
        url: 'http://zs.navinfo.com:7090/rest/wms',
        options: {
            id: 'zisan',
            name: '资三',
            layers: 'GCJ02',
            crs: L.CRS.EPSG4326,
            version: '1.1.1',
            selected: false,
            visible: false,
            editable: false,
            singleSelect: true,
            maxZoom: 20,
            zIndex: 1
        }
    }, {
        clazz: L.tileLayer,
        url: 'http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
        options: {
            id: 'tencent',
            name: '腾讯',
            subdomains: ['rt0', 'rt1', 'rt2', 'rt3'],
            tms: true,
            selected: false,
            visible: false,
            added: true,
            singleSelect: true,
            maxZoom: 20,
            zIndex: 2
        }
    }, {
        url: '',
        clazz: fastmap.mapApi.meshLayer,
        options: {
            id: 'mesh',
            name: '图幅',
            url: '',
            visible: true,
            zIndex: 3
        }
    }, {
        url: '',
        clazz: fastmap.mapApi.gridLayer,
        options: {
            id: 'grid',
            name: '格网',
            gridInfo: null,
            url: '',
            divideX: 4,
            divideY: 4,
            visible: false,
            zIndex: 3
        }
    }, {
        url: '',
        clazz: fastmap.mapApi.tileJSON,
        options: {
            name: '照片',
            id: 'photo',
            url: '',
            visible: false,
            zIndex: 4
        }
    }]
}, {
    // 主要用于加载17级以下的从hadoop库中取的路网数据
    groupId: 'referenceLayers',
    groupName: '参考',
    layers: []
}];
