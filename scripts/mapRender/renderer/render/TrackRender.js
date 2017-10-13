/**
 * Created by zhongxiaoming on 2017/6/29.
 */
FM.mapApi.render.renderer.TrackRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        switch (geoLiveType) {
            case 'AUGPSRECORD':
                return new FM.mapApi.render.renderer.GpsTrack(feature, zoom);
            case 'VECTORTAB':
                return new FM.mapApi.render.renderer.VectorTab(feature, zoom);
            case 'VECTORTABSUSPECT':
                return new FM.mapApi.render.renderer.VectorSuspected(feature, zoom);
            default:
                return null;
        }
    }
});
