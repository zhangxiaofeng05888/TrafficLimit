/**
 * Created by zhongxiaoming on 2017/4/14.
 */
FM.dataApi.PointInfo = FM.dataApi.Info.extend({

    setAttributes: function () {
        this.geoLiveType = 'PointInfo';
        this.wktToGeoJson();
    },

    wktToGeoJson: function () {
        var geometryAlgorithm = new fastmap.mapApi.geometry.GeometryAlgorithm();
        this.g_location = geometryAlgorithm.wktToGeojson(this.g_location);
    }
});
