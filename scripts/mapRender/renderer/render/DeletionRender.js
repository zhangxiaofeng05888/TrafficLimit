FM.mapApi.render.renderer.DeletionRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        switch (geoLiveType) {
            case 'LINKDELETION':
                return new FM.mapApi.render.renderer.DeletionLink(feature, zoom);
            case 'MISSROADDIDI':
                return new FM.mapApi.render.renderer.MissRoadDidi(feature, zoom);
            case 'MISSROADTENGXUN':
                return new FM.mapApi.render.renderer.MissRoadTengxun(feature, zoom);
            default:
                return null;
        }
    }
});
