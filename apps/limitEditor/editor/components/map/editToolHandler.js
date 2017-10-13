function EditToolHandler(scope) {
    var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
    var objectEditCtrl = fastmap.uikit.ObjectEditController();

    this.handler = function (event) {
        var opType = event.currentTarget.type;
        switch (opType) {
            case 'MODIFY':
                var modifyControl = factory.modifyControl(map, { originObject: objectEditCtrl.data });
                if (!modifyControl) {
                    swal('提示', '编辑流程未实现', 'info');
                    return;
                }
                modifyControl.run();
                break;
            case 'ADDPAIRBOND':   // 配对电子眼
                var addPairBondControl = factory.addPairElectronicEyeControl(map, { originObject: objectEditCtrl.data });
                if (!addPairBondControl) {
                    swal('提示', '编辑流程未实现', 'info');
                    return;
                }
                addPairBondControl.run();
                break;
            default:
                swal('按钮功能未实现');
                break;
        }
    };
}
