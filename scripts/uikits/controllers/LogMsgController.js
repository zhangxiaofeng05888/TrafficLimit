/**
 * Created by wangmingong on 2016/8/22.
 * Class LogMsgController
 */
fastmap.uikit.LogMsgController = (function () {
    var instantiated;

    function init() {
        var Controller = L.Class.extend({
            options: {},
            initialize: function () {
                this.messages = [];
                this.updateOutPuts = '';
                var messageArr = this.messages;
                this.msgObj = function (data) {
                    var _msg = {};
                    var tempContent = data.msgContent || '没有描述';
                    _msg.content = { contentValue: '', type: '', resNum: 0 };
                    var pattern = new RegExp('#({.+})#', 'g');
                    var matchRes = pattern.exec(tempContent);
                    if (matchRes) {
                        _msg.content.contentValue = tempContent.substring(0, matchRes.index);
                        _msg.content.type = JSON.parse(matchRes[1]).type;
                        _msg.content.resNum = JSON.parse(matchRes[1]).resNum;
                    } else {
                        _msg.content.contentValue = tempContent;
                    }
                    _msg.msgId = data.msgId || Date.parse(new Date());
                    _msg.type = data.msgType || 1;
                    if (data.createTime) {
                        _msg.createTime = Utils.dateFormat(data.createTime + '');
                    } else {
                        var date = new Date();
                        var seperator1 = '-';
                        var seperator2 = ':';
                        var month = date.getMonth() + 1;
                        var strDate = date.getDate();
                        if (month >= 1 && month <= 9) {
                            month = '0' + month;
                        }
                        if (strDate >= 0 && strDate <= 9) {
                            strDate = '0' + strDate;
                        }
                        _msg.createTime = date.getFullYear() + seperator1 + month + seperator1 + strDate
                            + ' ' + date.getHours() + seperator2 + date.getMinutes()
                            + seperator2 + date.getSeconds();
                    }
                    _msg.pushUserName = data.pushUserName || '匿名';
                    _msg.title = data.msgTitle || '未命名';
                    _msg.time = data.time || 5000;
                    _msg.status = 1;
                    if (data.msgParam) {
                        var temp = JSON.parse(data.msgParam);
                        _msg.flagId = temp.relateObjectId;
                    }
                    _msg.remove = function (msg) {
                        for (var i = 0; i < messageArr.length; i++) {
                            if (messageArr[i].msgId == msg.msgId) {
                                messageArr.splice(i, 1);
                            }
                        }
                    };
                    return _msg;
                };
            },
            /** *
             * 添加massage
             * @param {Object}massage
             */
            pushMsg: function ($scope, msg) {
                if (typeof msg === 'object') {
                    this.messages.unshift(this.msgObj(msg));
                } else if (typeof msg === 'string') {
                    this.messages.unshift(this.msgObj({ value: msg }));
                }
            },
            /** *
             * 清空
             */
            clear: function () {
                this.messages = [];
            }
        });
        return new Controller();
    }
    return function (options) {
        if (!instantiated) {
            instantiated = init();
        }
        return instantiated;
    };
}());
