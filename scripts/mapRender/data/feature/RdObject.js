/**
 * CRF对象的前端数据模型
 * @class FM.mapApi.render.data.RdObject
 * @author LiuYang
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
 FM.mapApi.render.data.RdObject = FM.mapApi.render.data.Feature.extend({
     /**
      * 模型转换主函数，将接口返回的数据转换为前端数据模型
      * @method setAttribute
      * @author LiuYang
      * @date   2017-09-12
      * @param  {object} data 接口返回的数据
      * @return {undefined}
      */
     setAttribute: function (data) {
         this.properties.geoLiveType = 'RDOBJECT';
         this.properties.id = parseInt(data.i, 10);
         this.properties.links = [];
         this.properties.nodes = [];
         var j;
         if (data.m && data.m.a) {
             for (j = 0; j < data.m.a.length; j++) {
                 if (data.m.a[j].t == 2) {
                     this.properties.links.push({
                         orgPid: parseInt(data.m.a[j].p, 10),
                         linkPid: parseInt(data.m.a[j].i, 10),
                         orgType: 'RDROAD'
                     });
                 } else if (data.m.a[j].t == 1) {
                     this.properties.links.push({
                         orgPid: parseInt(data.m.a[j].p, 10),
                         linkPid: parseInt(data.m.a[j].i, 10),
                         orgType: 'RDINTER'
                     });
                 } else if (data.m.a[j].t == 0) {
                     this.properties.links.push({
                         orgPid: parseInt(data.m.a[j].p, 10),
                         linkPid: parseInt(data.m.a[j].i, 10),
                         orgType: 'RDLINK'
                     });
                 }
             }
         }
         if (data.m && data.m.b) {
             for (j = 0; j < data.m.b.length; j++) {
                 if (data.m.b[j].t == 2) {
                     this.properties.nodes.push({
                         orgPid: parseInt(data.m.b[j].p, 10),
                         nodePid: parseInt(data.m.b[j].i, 10),
                         orgType: 'RDROAD'
                     });
                 } else if (data.m.b[j].t == 1) {
                     this.properties.nodes.push({
                         orgPid: parseInt(data.m.b[j].p, 10),
                         nodePid: parseInt(data.m.b[j].i, 10),
                         orgType: 'RDINTER'
                     });
                 } else if (data.m.b[j].t == 0) {
                     this.properties.nodes.push({
                         nodePid: parseInt(data.m.b[j].i, 10),
                         orgPid: parseInt(data.m.b[j].p, 10),
                         orgType: 'RDNODE'
                     });
                 }
             }
         }
         this.geometry = this._getGeometry(data);
     },

     /**
      * 获取数据模型的几何对象
      * @method _getGeometry
      * @author LiuYang
      * @date   2017-09-12
      * @param  {object} data 接口返回的数据
      * @return {object} 几何对象
      */
     _getGeometry: function (data) {
         var i;
         var geometry = {
             type: 'GeometryCollection',
             geometries: []
         };
         var markerPoint = {
             type: 'Point',
             coordinates: data.g
         };
         geometry.geometries.push(markerPoint);

         var linksLineString = {
             type: 'MultiLineString',
             coordinates: []
         };
         if (data.m && data.m.a) {
             for (i = 0; i < data.m.a.length; i++) {
                 linksLineString.coordinates.push(data.m.a[i].g);
             }
         }
         geometry.geometries.push(linksLineString);
         var nodesPoint = {
             type: 'MultiPoint',
             coordinates: []
         };
         if (data.m && data.m.b) {
             for (i = 0; i < data.m.b.length; i++) {
                 nodesPoint.coordinates.push(data.m.b[i].g);
             }
         }
         geometry.geometries.push(nodesPoint);
         var outLineString = {
             type: 'LineString',
             coordinates: []
         };
         if (data.m && data.m.c && data.m.c.length > 0) {
             outLineString.coordinates = data.m.c;
         }
         geometry.geometries.push(outLineString);
         return geometry;
     }
 });
