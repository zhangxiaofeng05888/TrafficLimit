/**
 * Created by zhongxiaoming on 2017/4/13.
 */
FM.dataApi.Info = FM.dataApi.GeoDataModel.extend({
    /**
     * @geoLiveType
     * 模型类型
     */
    geoLiveType: 'INFO',
    initialize: function (data) {
        this.globalId = data.globalId || null;
        this.b_featureKind = data.b_featureKind || 2;
        this.b_sourceCode = data.b_sourceCode || 1;
        this.b_sourceId = data.b_sourceId || '';
        this.b_reliability = data.b_reliability || 1;
        this.g_location = data.g_location || null;
        this.g_guide = data.g_guide || null;
        this.t_storageDate = data.t_storageDate || '';
        this.t_expectDate = data.t_expectDate || '';
        this.t_newsDate = data.t_newsDate || '';
        this.t_expDateReliab = data.t_expDateReliab || '';
        this.t_publishDate = data.t_publishDate || '';
        this.t_submitDate = data.t_submitDate || '';
        this.t_closeDate = data.t_closeDate || '';
        this.t_operateDate = data.t_operateDate || '';
        this.t_isPublished = data.t_isPublished || 0;
        this.t_isClosed = data.t_isClosed || 0;
        this.t_lifecycle = data.t_lifecycle || 0;
        this.t_payPoints = data.t_payPoints || 0;
        this.h_outdoor = data.h_outdoor || 0;
        this.h_indoor = data.h_indoor || 0;
        this.h_audit = data.h_audit || 0;
        if (data.i_poi) {
            this.i_poi = {
                kindCode: data.i_poi.kindCode || '',
                name: data.i_poi.name || '',
                address: data.i_poi.address || '',
                telephone: data.i_poi.telephone || '',
                foodtype: data.i_poi.foodtype || '',
                father: data.i_poi.father || '',
                rating: data.i_poi.rating || 0,
                url: data.i_poi.url || '',
                i_road: data.i_poi.i_road || '',
                roadKind: data.i_poi.roadKind || 0,
                length: data.i_poi.length || '',
                startPoint: data.i_poi.startPoint || '',
                passPoint: data.i_poi.passPoint || '',
                endPoint: data.i_poi.endPoint || '',

                i_memo: data.i_poi.i_memo || '',
                i_proposal: data.i_poi.passPoint || 3,
                i_level: data.i_poi.i_level || 1,
                i_topicName: data.i_poi.i_topicName || '',
                i_infoContent: data.i_poi.i_infoContent || '',
                i_area: data.i_poi.i_area || '',
                i_gainType: data.i_poi.i_gainType || '',
                i_confirmMode: data.i_poi.i_confirmMode || '',
                i_confirmResult: data.i_poi.i_confirmResult || '',
                i_precision: data.i_poi.i_precision || '',
                i_serviceStatus: data.i_poi.i_serviceStatus || ''
            };
        } else {
            this.i_poi = {
                kindCode: '',
                name: '',
                address: '',
                telephone: '',
                foodtype: '',
                father: '',
                rating: 0,
                url: '',
                i_road: '',
                roadKind: 0,
                length: '',
                startPoint: '',
                passPoint: '',
                endPoint: '',
                i_memo: '',
                i_proposal: 3,
                i_level: 1,
                i_topicName: '',
                i_infoContent: '',
                i_area: '',
                i_gainType: '',
                i_confirmMode: '',
                i_confirmResult: '',
                i_precision: '',
                i_serviceStatus: ''
            };
        }

        this.r_features = data.r_features || [];
        this.f_array = data.f_array || [];
        this.c_array = data.c_array || [];
        this.setAttributes();
    },

    setAttributes: function () {

    }
});
