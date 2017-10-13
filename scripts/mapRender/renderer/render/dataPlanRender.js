/**
 * Created by zhaohang on 2017/7/5.
 */
FM.mapApi.render.renderer.DataPlanRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        switch (geoLiveType) {
            case 'RDLINK':
                return new FM.mapApi.render.renderer.DataPlanRdLink(feature, zoom);
            case 'IXPOI':
                return new FM.mapApi.render.renderer.DataPlanIxPoi(feature, zoom);
            default:
                return null;
        }
    }
});
