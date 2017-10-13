FM.mapApi.render.renderer.FeatureRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        switch (geoLiveType) {
            case 'RDLINK':
                return new FM.mapApi.render.renderer.RdLink(feature, zoom);
            case 'RDNODE':
                return new FM.mapApi.render.renderer.RdNode(feature, zoom);
            case 'RWLINK':
                return new FM.mapApi.render.renderer.RwLink(feature, zoom);
            case 'RDCROSS':
                return new FM.mapApi.render.renderer.RdCross(feature, zoom);
            case 'IXPOI':
                return new FM.mapApi.render.renderer.IXPOI(feature, zoom);
            case 'RDRESTRICTION':
            case 'RDRESTRICTIONTRUCK':
                return new FM.mapApi.render.renderer.RdRestriction(feature, zoom);
            case 'RDMILEAGEPILE':
                return new FM.mapApi.render.renderer.RdMileagePile(feature, zoom);
            case 'ADADMIN':
                return new FM.mapApi.render.renderer.AdAdmin(feature, zoom);
            case 'ADFACE':
                return new FM.mapApi.render.renderer.AdFace(feature, zoom);
            case 'ADLINK':
                return new FM.mapApi.render.renderer.AdLink(feature, zoom);
            case 'ADNODE':
                return new FM.mapApi.render.renderer.AdNode(feature, zoom);
            case 'LCFACE':
                return new FM.mapApi.render.renderer.LcFace(feature, zoom);
            case 'LCLINK':
                return new FM.mapApi.render.renderer.LcLink(feature, zoom);
            case 'LCNODE':
                return new FM.mapApi.render.renderer.LcNode(feature, zoom);
            case 'LUFACE':
                return new FM.mapApi.render.renderer.LuFace(feature, zoom);
            case 'LULINK':
                return new FM.mapApi.render.renderer.LuLink(feature, zoom);
            case 'LUNODE':
                return new FM.mapApi.render.renderer.LuNode(feature, zoom);
            case 'CMGBUILDFACE':
                return new FM.mapApi.render.renderer.CmgBuildFace(feature, zoom);
            case 'CMGBUILDLINK':
                return new FM.mapApi.render.renderer.CmgBuildLink(feature, zoom);
            case 'CMGBUILDNODE':
                return new FM.mapApi.render.renderer.CmgBuildNode(feature, zoom);
            case 'CMGBUILDING':
                return new FM.mapApi.render.renderer.CmgBuildFeature(feature, zoom);
            case 'RDDIRECTROUTE':
                return new FM.mapApi.render.renderer.RdDirectRoute(feature, zoom);
            case 'RDELECTRONICEYE':
                return new FM.mapApi.render.renderer.RdElectronicEye(feature, zoom);
            case 'RDGATE':
                return new FM.mapApi.render.renderer.RdGate(feature, zoom);
            case 'RDHGWGLIMIT':
                return new FM.mapApi.render.renderer.RdHgwgLimit(feature, zoom);
            case 'RDINTERLINKS':
                return new FM.mapApi.render.renderer.RdInterLinks(feature, zoom);
            case 'RDINTERNODES':
                return new FM.mapApi.render.renderer.RdInterNodes(feature, zoom);
            case 'RDLANE':
                return new FM.mapApi.render.renderer.RdLane(feature, zoom);
            case 'RDLANECONNEXITY':
                return new FM.mapApi.render.renderer.RdLaneConnexity(feature, zoom);
            case 'RDOBJECTLINKS':
                return new FM.mapApi.render.renderer.RdObjectLinks(feature, zoom);
            case 'RDOBJECTMARKER':
                return new FM.mapApi.render.renderer.RdObjectMarker(feature, zoom);
            case 'RDOBJECTNODES':
                return new FM.mapApi.render.renderer.RdObjectNodes(feature, zoom);
            case 'RDOBJECTOUTLINE':
                return new FM.mapApi.render.renderer.RdObjectOutLine(feature, zoom);
            case 'RDROADLINKS':
                return new FM.mapApi.render.renderer.RdRoadLinks(feature, zoom);
            case 'RDSAMELINK':
                return new FM.mapApi.render.renderer.RdSameLink(feature, zoom);
            case 'RDSAMENODE':
                return new FM.mapApi.render.renderer.RdSameNode(feature, zoom);
            case 'RDSE':
                return new FM.mapApi.render.renderer.RdSe(feature, zoom);
            case 'RDSLOPE':
                return new FM.mapApi.render.renderer.RdSlope(feature, zoom);
            case 'RDSPEEDBUMP':
                return new FM.mapApi.render.renderer.RdSpeedBump(feature, zoom);
            case 'RDTRAFFICSIGNAL':
                return new FM.mapApi.render.renderer.RdTrafficSignal(feature, zoom);
            case 'RDVARIABLESPEED':
                return new FM.mapApi.render.renderer.RdVariableSpeed(feature, zoom);
            case 'RDVOICEGUIDE':
                return new FM.mapApi.render.renderer.RdVoiceGuide(feature, zoom);
            case 'RWNODE':
                return new FM.mapApi.render.renderer.RwNode(feature, zoom);
            case 'ZONEFACE':
                return new FM.mapApi.render.renderer.ZoneFace(feature, zoom);
            case 'ZONELINK':
                return new FM.mapApi.render.renderer.ZoneLink(feature, zoom);
            case 'ZONENODE':
                return new FM.mapApi.render.renderer.ZoneNode(feature, zoom);
            case 'RDHIGHSPEEDBRANCH':// 高速分歧
            case 'RDASPECTBRANCH':// 方面分歧
            case 'RDICBRANCH':// IC分歧
            case 'RD3DBRANCH':// 3d分歧
            case 'RDCOMPLEXSCHEMA':// 复杂路口模式图
            case 'RDREALIMAGE':// 实景图
            case 'RDSIGNASREAL':// 实景看板
            case 'RDSERIESBRANCH':// 连续分歧
            case 'RDSCHEMATICBRANCH':// 交叉点大路口模式图
            case 'RDSIGNBOARD':// 方向看板
                return new FM.mapApi.render.renderer.RdBranch(feature, zoom);
            case 'RDGSC':
                return new FM.mapApi.render.renderer.RdGsc(feature, zoom);
            case 'RDLINKSPEEDLIMIT':
                return new FM.mapApi.render.renderer.RdLinkSpeedLimit(feature, zoom);
            case 'RDLINKSPEEDLIMIT_DEPENDENT':
                return new FM.mapApi.render.renderer.RdLinkSpeedLimitDependent(feature, zoom);
            case 'RDRTIC':
                return new FM.mapApi.render.renderer.RdRtic(feature, zoom);
            case 'RDSPEEDLIMIT':
            case 'RDSPEEDLIMIT_DEPENDENT':
                return new FM.mapApi.render.renderer.RdSpeedLimit(feature, zoom);
            case 'RDTOLLGATE':
                return new FM.mapApi.render.renderer.RdTollgate(feature, zoom);
            case 'RDLINKWARNING':
                return new FM.mapApi.render.renderer.RdLinkWarning(feature, zoom);
            case 'RDOBJECT':
                return new FM.mapApi.render.renderer.RdObject(feature, zoom);
            case 'RDINTER':
                return new FM.mapApi.render.renderer.RdInter(feature, zoom);
            case 'RDROAD':
                return new FM.mapApi.render.renderer.RdRoad(feature, zoom);
            case 'TIPBORDER':
                return new FM.mapApi.render.renderer.TipBorder(feature, zoom);
            case 'TMCPOINT':
                return new FM.mapApi.render.renderer.TmcPoint(feature, zoom);
            case 'TMCLINE':
                return new FM.mapApi.render.renderer.TmcLine(feature, zoom);
            case 'TMCLOCATION':
                return new FM.mapApi.render.renderer.TmcLocation(feature, zoom);
            default:
                return null;
        }
    }
});
