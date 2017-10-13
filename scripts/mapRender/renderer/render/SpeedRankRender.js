FM.mapApi.render.renderer.SpeedRankRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        switch (geoLiveType) {
            case 'RDLINK':
                return new FM.mapApi.render.renderer.TMRdLinkSpeedRank(feature, zoom);
            default:
                return null;
        }
    }
});
