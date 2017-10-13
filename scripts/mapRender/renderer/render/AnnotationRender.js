/**
 * Created by wangtun on 2017/6/22.
 */
FM.mapApi.render.renderer.AnnotationRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        switch (geoLiveType) {
            case 'RDLINK':
                return new FM.mapApi.render.renderer.RdLinkAnnotation(feature, zoom);
            default:
                return null;
        }
    }
});
