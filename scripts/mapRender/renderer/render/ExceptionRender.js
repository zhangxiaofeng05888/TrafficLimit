FM.mapApi.render.renderer.ExceptionRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        if (geoLiveType == 'TIPLINKS' && zoom > 9) {
            return new FM.mapApi.render.renderer.CustomTipLinks(feature, zoom);
        }
        if (zoom < 17 && zoom >= 10) {
            if (geoLiveType == 'TIPFC') {
                return new FM.mapApi.render.renderer.CustomTipFC(feature, zoom);
            }
            return new FM.mapApi.render.renderer.TipAllNode(feature, zoom);
        } else if (zoom >= 17) {
            switch (geoLiveType) {
                case 'TIPFC':
                    return new FM.mapApi.render.renderer.CustomTipFC(feature, zoom);
                case 'TIPMAINTENANCE':
                    return new FM.mapApi.render.renderer.CustomTipMaintenance(feature, zoom);
                case 'TIPPEDESTRIANSTREET':
                    return new FM.mapApi.render.renderer.CustomTipPedestrianStreet(feature, zoom);
                case 'TIPTUNNEL':
                    return new FM.mapApi.render.renderer.CustomTipTunnel(feature, zoom);
                case 'TIPBUSLANE':
                    return new FM.mapApi.render.renderer.CustomTipBusLane(feature, zoom);
                case 'TIPBRIDGE':
                    return new FM.mapApi.render.renderer.CustomTipBridge(feature, zoom);
                default:
                    return null;
            }
        }
        return null;
    }
});
