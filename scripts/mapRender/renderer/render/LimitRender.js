/**
 * Created by zhaohang on 2017/10/17.
 */
FM.mapApi.render.renderer.LimitRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        switch (geoLiveType) {
            case 'COPYTOLINE':
                return new FM.mapApi.render.renderer.CopyToLine(feature, zoom);
            case 'COPYTOPOLYGON':
                return new FM.mapApi.render.renderer.CopyToPolygon(feature, zoom);
            case 'DRAWPOLYGON':
                return new FM.mapApi.render.renderer.DrawPolygon(feature, zoom);
            case 'GEOMETRYLINE':
                return new FM.mapApi.render.renderer.GeometryLine(feature, zoom);
            case 'GEOMETRYPOLYGON':
                return new FM.mapApi.render.renderer.GeometryPolygon(feature, zoom);
            case 'LIMITLINE':
                return new FM.mapApi.render.renderer.LimitLine(feature, zoom);
            default:
                return null;
        }
    }
});

