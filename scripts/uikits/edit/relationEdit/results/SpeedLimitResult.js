/**
 * Created by chenx on 2017/4/17.
 */

fastmap.uikit.relationEdit.SpeedLimitResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'SpeedLimitResult');

        this.inLink = null;
        this.inNodePid = 0;
        this.direct = 0;
        this.viaLinks = [];
        this.speedType = 0;
        this.fromSpeedLimit = 0;
        this.fromLimitSrc = 0;
        this.toSpeedLimit = 0;
        this.toLimitSrc = 0;
        this.speedClassWork = 1;
        this.speedDependent = 0;
        this.timeDomain = ''; // 服务端要求处理成空字符串
        this.reverseSideViaLinks = [];   //   非追踪方向经过线
        this.limitSideViaLinks = [];   //   追踪方向经过线
    }
});
