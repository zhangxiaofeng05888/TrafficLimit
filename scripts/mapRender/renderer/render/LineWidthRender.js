/**
 * Created by zhongxiaoming on 2017/8/8.
 */
FM.mapApi.render.renderer.LineWidthRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        switch (geoLiveType) {
            case 'RDLINK':
                return new FM.mapApi.render.renderer.TMRLinkWidth(feature, zoom);
            default:
                return null;
        }
    }
});
