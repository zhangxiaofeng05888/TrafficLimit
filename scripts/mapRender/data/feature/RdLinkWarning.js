/**
 * 警示信息的前端数据模型
 * @class FM.mapApi.render.data.RdLinkWarning
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdLinkWarning = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'RDLINKWARNING';
        this.properties.typeCode = data.m.e;
        this.properties.direct = data.m.a;
        this.properties.linkPid = data.m.d;
        this.properties.angle = data.m.b;
        this.properties.sequenceNo = data.m.c;
        this.geometry = this._getGeometry(data.g);
        this.arrowGeometry = this._getArrowGeometry(data.g);
    },

    /**
     * 获取数据模型的几何对象
     * @method _getGeometry
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} geo 接口返回的数据
     * @return {object} 几何对象
     */
    _getGeometry: function (geo) {
        var geometry = {
            type: 'Point',
            coordinates: []
        };
        var offSetObj = this._getOffSet();

        geometry.coordinates = [geo[0] + offSetObj.offX, geo[1] + offSetObj.offY];
        return geometry;
    },

    /**
     * 获取数据模型的几何对象的偏移
     * @method _getOffSet
     * @author LiuZhe
     * @date   2017-09-12
     * @return {object} 几何对象
     */
    _getOffSet: function () {
        var sequenceNo = this.properties.sequenceNo;
        var angle = this.properties.angle;
        var width = 40;
        var height = 40;
        var offX = 0;
        var offY = 0;
        var multiplier = 2 / 3;

        //  在警示信息作用方向的关联 link 右侧显示，这块代码看着复杂，其实只是正负符号的变换
        if (angle >= 0 && angle <= 90) {
            //  偏移位置为
            //  1,2,3
            //  4,5,6
            if (sequenceNo === 1 || sequenceNo === 4) {
                offX = width * multiplier;
            } else if (sequenceNo === 2 || sequenceNo === 5) {
                offX = width * multiplier + width / 2;
            } else if (sequenceNo === 3 || sequenceNo === 6) {
                offX = width * multiplier + width;
            }

            if (sequenceNo > 0 && sequenceNo < 4) {
                offY = height / 3;
            } else if (sequenceNo > 3 && sequenceNo < 7) {
                offY = height / 3 + height / 2;
            }
        } else if (angle > 90 && angle <= 180) {
            //  偏移位置为
            //  3,2,1
            //  6,5,4
            if (sequenceNo === 1 || sequenceNo === 4) {
                offX = -width * multiplier;
            } else if (sequenceNo === 2 || sequenceNo === 5) {
                offX = -width * multiplier - width / 2;
            } else if (sequenceNo === 3 || sequenceNo === 6) {
                offX = -width * multiplier - width;
            }

            if (sequenceNo > 0 && sequenceNo < 4) {
                offY = height / 3;
            } else if (sequenceNo > 3 && sequenceNo < 7) {
                offY = height / 3 + height / 2;
            }
        } else if (angle > 180 && angle <= 270) {
            //  偏移位置为
            //  6,5,4
            //  3,2,1
            if (sequenceNo === 1 || sequenceNo === 4) {
                offX = -width * multiplier;
            } else if (sequenceNo === 2 || sequenceNo === 5) {
                offX = -width * multiplier - width / 2;
            } else if (sequenceNo === 3 || sequenceNo === 6) {
                offX = -width * multiplier - width;
            }

            if (sequenceNo > 0 && sequenceNo < 4) {
                offY = -height / 3;
            } else if (sequenceNo > 3 && sequenceNo < 7) {
                offY = -height / 3 - height / 2;
            }
        } else if (angle > 270 && angle <= 360) {
            //  偏移位置为
            //  4,5,6
            //  1,2,3
            if (sequenceNo === 1 || sequenceNo === 4) {
                offX = width * multiplier;
            } else if (sequenceNo === 2 || sequenceNo === 5) {
                offX = width * multiplier + width / 2;
            } else if (sequenceNo === 3 || sequenceNo === 6) {
                offX = width * multiplier + width;
            }

            if (sequenceNo > 0 && sequenceNo < 4) {
                offY = -height / 3;
            } else if (sequenceNo > 3 && sequenceNo < 7) {
                offY = -height / 3 - height / 2;
            }
        }

        return {
            offX: offX,
            offY: offY
        };
    },

    /**
     * 获取数据模型的箭头符号的几何对象
     * @method _getArrowGeometry
     * @author LiuZhe
     * @date   2017-09-12
     * @return {object} 几何对象
     */
    _getArrowGeometry: function (geo) {
        var angle = this.properties.angle;
        var width = 40;
        var height = 40;
        var offX = 0;
        var offY = 0;
        var multiplier = 3 / 16;

        //  在警示信息作用方向的关联 link 右侧显示，这块代码看着复杂，其实只是正负符号的变换
        if (angle >= 0 && angle <= 90) {
            offX = width * multiplier;
            offY = height / 6;
        } else if (angle > 90 && angle <= 180) {
            offX = -width * multiplier;
            offY = height / 6;
        } else if (angle > 180 && angle <= 270) {
            offX = -width * multiplier;
            offY = -height / 6;
        } else if (angle > 270 && angle <= 360) {
            offX = width * multiplier;
            offY = -height / 6;
        }

        var geometry = {
            type: 'Point',
            coordinates: []
        };

        geometry.coordinates = [geo[0] + offX, geo[1] + offY];

        return geometry;
    }
});
