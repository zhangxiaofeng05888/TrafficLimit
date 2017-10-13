FM.dataApi.Utils = {
    isTip: function (dataModel) {
        return dataModel instanceof FM.dataApi.Tip || dataModel instanceof FM.dataApi.CanvasTip;
    }
};
