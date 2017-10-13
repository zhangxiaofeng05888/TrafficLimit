FM.mapApi.render.renderer.InfoRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        switch (geoLiveType) {
            case 'PointInfo':
                return new FM.mapApi.render.renderer.PointInfo(feature, zoom);
            case 'LineInfo':
                return new FM.mapApi.render.renderer.LineInfo(feature, zoom);
            case 'PolygonInfo':
                return new FM.mapApi.render.renderer.PolygonInfo(feature, zoom);
            default:
                return null;
        }
    }
});

