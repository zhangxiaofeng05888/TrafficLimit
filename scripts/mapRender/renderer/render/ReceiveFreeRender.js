FM.mapApi.render.renderer.ReceiveFreeRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        switch (geoLiveType) {
            case 'RDLINK':
                return new FM.mapApi.render.renderer.TMRdLinkReceiveFree(feature, zoom);
            default:
                return null;
        }
    }
});
