FM.mapApi.render.renderer.FcWorkRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        switch (geoLiveType) {
            case 'RDLINK':
                return new FM.mapApi.render.renderer.TMRdLinkFcWork(feature, zoom);
            case 'RDNODE':
                return new FM.mapApi.render.renderer.RdObstacle(feature, zoom);
            default:
                return null;
        }
    }
});
