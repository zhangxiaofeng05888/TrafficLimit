/**
 * IntRtic等级的前端数据模型
 * @class FM.mapApi.render.data.RdRtic
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdRtic = FM.mapApi.render.data.Feature.extend({
    geometry: {},
    properties: {},
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.geometry.type = 'LineString';
        this.properties.geoLiveType = 'RDLINKINTRTIC';
        this.properties.direct = data.m.e;
        if (data.m.a) {
            this.properties.alongText = data.m.a;
            this.properties.alongColor = this.getrTicColor(data.m.b);
        }
        if (data.m.c) {
            this.properties.reverseText = data.m.c;
            this.properties.reverseColor = this.getrTicColor(data.m.d);
        }
        var forwardtext = data.m.a;   // 顺行
        var reversetext = data.m.c; // 逆行
        if (forwardtext && reversetext) { // 双方向
            if (forwardtext[forwardtext.length - 1] === '上' && reversetext[reversetext.length - 1] === '上') { // 同为上 不绘制

            } else if (forwardtext[forwardtext.length - 1] === '下' && reversetext[reversetext.length - 1] === '下') { // 同为下 不绘制

            } else {
                this.addSymbol(forwardtext, reversetext);
            }
        } else {
            if (forwardtext && data.m.e === 2) {
                if (forwardtext[forwardtext.length - 1] === '上') {
                    this.addSymbol(forwardtext, reversetext);
                }
            }
            if (reversetext && data.m.e === 3) {
                if (reversetext[reversetext.length - 1] === '上') {
                    this.addSymbol(forwardtext, reversetext);
                }
            }
        }
    },

    /**
     * 获取颜色值
     * @method getrTicColor
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {string} level 等级
     * @return {string} 颜色值
     */
    getrTicColor: function (level) {
        switch (parseInt(level, 10)) {
            case 0:
                return '#808080';
            case 1:
                return '#FF0000';
            case 2:
                return '#006400';
            case 3:
                return '#00008B';
            case 4:
                return '#FF1493';
            default:
                return '#808080';
        }
    },

    /**
     * 添加符号
     * @method addSymbol
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {number} forwardtext 顺方向文字信息
     * @param  {number} reversetext 逆方向文字信息
     * @return {undefined}
     */
    addSymbol: function (forwardtext, reversetext) {
        var position = 'e'; // 双方向只显示上行 enode
        if (this.properties.direct === 1) { // 双方向
            if (forwardtext) {
                if (forwardtext[forwardtext.length - 1] === '上') { // 顺方向 是最后一个点
                    position = 'e';
                }
            }
            if (reversetext) {
                if (reversetext[reversetext.length - 1] === '上') { // 逆方向 是第一个点
                    position = 's';
                }
            }
        } else if (this.properties.direct === 3) { // 逆方向
            position = 's';
        } else if (this.properties.direct === 2) {
            position = 'e';
        }
        var symbolData = {
            type: 'CompositeLineSymbol',
            symbols: [{
                type: 'EndMarkerLineSymbol',
                position: position,
                marker: {
                    type: 'TriangleMarkerSymbol',
                    width: 12,
                    height: 10,
                    color: this.properties.color,
                    outLine: {
                        width: 1,
                        color: 'black'
                    }
                }
            }]
        };
        // 显示顺向信息
        if (forwardtext) {
            var textShow = {
                type: 'TextLineSymbol',
                text: null,
                offset: 0,
                marker: {
                    type: 'TextMarkerSymbol',
                    font: '微软雅黑',
                    size: 10,
                    color: this.properties.alongColor
                }
            };
            textShow.text = forwardtext;
            if (this.properties.direct === 2) {
                textShow.offset = 10;
            } else if (this.properties.direct === 3) {
                textShow.offset = -10;
            } else {
                textShow.offset = -10;
                if (forwardtext[forwardtext.length - 1] === '上') { // 顺方向
                    textShow.offset = 10;
                }
            }
            symbolData.symbols.push(textShow);
        }

        // 显示逆向信息
        if (reversetext) {
            var reverseShow = {
                type: 'TextLineSymbol',
                text: null,
                offset: 0,
                marker: {
                    type: 'TextMarkerSymbol',
                    font: '微软雅黑',
                    size: 10,
                    color: this.properties.reverseColor
                }
            };
            reverseShow.text = reversetext;
            if (this.properties.direct === 2) {
                reverseShow.offset = 10;
            } else if (this.properties.direct === 3) {
                reverseShow.offset = -10;
            } else {
                reverseShow.offset = -10;
                if (reversetext[reversetext.length - 1] === '上') { // 顺方向
                    reverseShow.offset = 10;
                }
            }
            symbolData.symbols.push(reverseShow);
        }

        var symbol = this.symbolFactory.createSymbol(symbolData);
        symbol.geometry = this.geometryFactory.fromGeojson(this.geometry);
        this.properties.symbol = symbol;
    }
});
