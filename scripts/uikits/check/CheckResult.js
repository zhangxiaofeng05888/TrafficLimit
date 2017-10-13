/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.check.CheckResult = L.Class.extend({
    initialize: function () {
        this.situation = 'unknown';
        this.geoLiveType = 'unknown';
        this.message = '';
    },

    equal: function (other) {
        if (this.situation !== other.situation) {
            return false;
        }

        if (this.geoLiveType !== other.geoLiveType) {
            return false;
        }

        if (this.message !== other.message) {
            return false;
        }

        return true;
    }
});
