FM.mapApi.render.renderer.TipRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        if (zoom < 17 && zoom >= 10) {
            return new FM.mapApi.render.renderer.TipAllNode(feature, zoom);
        } else if (zoom >= 17) {
            switch (geoLiveType) {
                case 'TIPTOLLGATE':
                    return new FM.mapApi.render.renderer.TipTollGate(feature, zoom);
                case 'TIPBORDER':
                    return new FM.mapApi.render.renderer.TipBorder(feature, zoom);
                case 'TIP3DBRANCH':
                    return new FM.mapApi.render.renderer.Tip3DBranch(feature, zoom);
                case 'TIPBRIDGE':
                    return new FM.mapApi.render.renderer.TipBridge(feature, zoom);
                case 'TIPBUSLANE':
                    return new FM.mapApi.render.renderer.TipBusLane(feature, zoom);
                case 'TIPBYPATH':
                    return new FM.mapApi.render.renderer.TipBypath(feature, zoom);
                case 'TIPCHARGEOPENROAD':
                    return new FM.mapApi.render.renderer.TipChargeOpenRoad(feature, zoom);
                case 'TIPCONNECT':
                    return new FM.mapApi.render.renderer.TipConnect(feature, zoom);
                case 'TIPCROSSLINEOVERPASS':
                    return new FM.mapApi.render.renderer.TipCrossLineOverpass(feature, zoom);
                case 'TIPDELETETAG':
                    return new FM.mapApi.render.renderer.TipDeleteTag(feature, zoom);
                case 'TIPDIRECT':
                    return new FM.mapApi.render.renderer.TipDirect(feature, zoom);
                case 'TIPDRIVEWAYMOUNT':
                    return new FM.mapApi.render.renderer.TipDrivewayMount(feature, zoom);
                case 'TIPELECTRONICEYE':
                    return new FM.mapApi.render.renderer.TipElectroniceye(feature, zoom);
                case 'TIPELEVATEDROAD':
                    return new FM.mapApi.render.renderer.TipElevatedRoad(feature, zoom);
                case 'TIPFC':
                    return new FM.mapApi.render.renderer.TipFC(feature, zoom);
                case 'TIPGPSDOT':
                    return new FM.mapApi.render.renderer.TipGPSDot(feature, zoom);
                case 'TIPGSBRANCH':
                    return new FM.mapApi.render.renderer.TipGSBranch(feature, zoom);
                case 'TIPGSC':
                    return new FM.mapApi.render.renderer.TipGSC(feature, zoom);
                case 'TIPHIGHSPEEDENTRANCE':
                    return new FM.mapApi.render.renderer.TipHighSpeedEntrance(feature, zoom);
                case 'TIPLANECONNEXITY':
                    return new FM.mapApi.render.renderer.TipLaneConnexity(feature, zoom);
                case 'TIPLEFTTORIGHT':
                    return new FM.mapApi.render.renderer.TipLeftToRight(feature, zoom);
                case 'TIPLINKS':
                    return new FM.mapApi.render.renderer.TipLinks(feature, zoom);
                case 'TIPMAINTENANCE':
                    return new FM.mapApi.render.renderer.TipMaintenance(feature, zoom);
                case 'TIPMULTIDIGITIZED':
                    return new FM.mapApi.render.renderer.TipMultiDigitized(feature, zoom);
                case 'TIPNARROWCHANNEL':
                    return new FM.mapApi.render.renderer.TipNarrowChannel(feature, zoom);
                case 'TIPNOCROSSING':
                    return new FM.mapApi.render.renderer.TipNoCrossing(feature, zoom);
                case 'TIPNOENTRY':
                    return new FM.mapApi.render.renderer.TipNoEntry(feature, zoom);
                case 'TIPNOMALRESTRICTION':
                    return new FM.mapApi.render.renderer.TipNomalRestriction(feature, zoom);
                case 'TIPNORMALROADSIDE':
                    return new FM.mapApi.render.renderer.TipNormalRoadSide(feature, zoom);
                case 'TIPOBSTACLE':
                    return new FM.mapApi.render.renderer.TipObstacle(feature, zoom);
                case 'TIPOVERPASS':
                    return new FM.mapApi.render.renderer.TipOverpass(feature, zoom);
                case 'TIPOVERPASSNAME':
                    return new FM.mapApi.render.renderer.TipOverpassName(feature, zoom);
                case 'TIPPARKINGLOT':
                    return new FM.mapApi.render.renderer.TipParkinglot(feature, zoom);
                case 'TIPPAVEMENTCOVER':
                    return new FM.mapApi.render.renderer.TipPavementCover(feature, zoom);
                case 'TIPPEDESTRIANSTREET':
                    return new FM.mapApi.render.renderer.TipPedestrianStreet(feature, zoom);
                case 'TIPPOIROAD':
                    return new FM.mapApi.render.renderer.TipPOIRoad(feature, zoom);
                case 'TIPRAILWAYCROSSING':
                    return new FM.mapApi.render.renderer.TipRailwayCrossing(feature, zoom);
                case 'TIPRAMP':
                    return new FM.mapApi.render.renderer.TipRamp(feature, zoom);
                case 'TIPREGIONROAD':
                    return new FM.mapApi.render.renderer.TipRegionRoad(feature, zoom);
                case 'TIPREPAIR':
                    return new FM.mapApi.render.renderer.TipRepair(feature, zoom);
                case 'TIPRESTRICTION':
                    return new FM.mapApi.render.renderer.TipRestriction(feature, zoom);
                case 'TIPROADCROSS':
                    return new FM.mapApi.render.renderer.TipRoadCross(feature, zoom);
                case 'TIPROADCROSSPROM':
                    return new FM.mapApi.render.renderer.TipRoadCrossProm(feature, zoom);
                case 'TIPROADDIRECTION':
                    return new FM.mapApi.render.renderer.TipRoadDirection(feature, zoom);
                case 'TIPROADNAME':
                    return new FM.mapApi.render.renderer.TipRoadName(feature, zoom);
                case 'TIPROADPA':
                    return new FM.mapApi.render.renderer.TipRoadPA(feature, zoom);
                case 'TIPROADTYPE':
                    return new FM.mapApi.render.renderer.TipRoadType(feature, zoom);
                case 'TIPROADSA':
                    return new FM.mapApi.render.renderer.TipRoadSA(feature, zoom);
                case 'TIPROUNDABOUT':
                    return new FM.mapApi.render.renderer.TipRoundabout(feature, zoom);
                case 'TIPROUTE':
                    return new FM.mapApi.render.renderer.TipRoute(feature, zoom);
                case 'TIPSCENICROUTE':
                    return new FM.mapApi.render.renderer.TipScenicRoute(feature, zoom);
                case 'TIPSEASONALROAD':
                    return new FM.mapApi.render.renderer.TipSeasonalRoad(feature, zoom);
                case 'TIPSIDEROAD':
                    return new FM.mapApi.render.renderer.TipSideRoad(feature, zoom);
                case 'TIPSKETCH':
                    return new FM.mapApi.render.renderer.TipSketch(feature, zoom);
                case 'TIPSLOPE':
                    return new FM.mapApi.render.renderer.TipSlope(feature, zoom);
                case 'TIPSPECIALTRAFFICTYPE':
                    return new FM.mapApi.render.renderer.TipSpecialTrafficType(feature, zoom);
                case 'TIPSPEEDLIMIT':
                    return new FM.mapApi.render.renderer.TipSpeedlimit(feature, zoom);
                case 'TIPTRAFFICSIGNAL':
                    return new FM.mapApi.render.renderer.TipTrafficSignal(feature, zoom);
                case 'TIPTRAFFICSIGNALDIR':
                    return new FM.mapApi.render.renderer.TipTrafficSignalDir(feature, zoom);
                case 'TIPTUNNEL':
                    return new FM.mapApi.render.renderer.TipTunnel(feature, zoom);
                case 'TIPUNDERPASS':
                    return new FM.mapApi.render.renderer.TipUnderpass(feature, zoom);
                case 'TIPUSAGEFEEREQUIRED':
                    return new FM.mapApi.render.renderer.TipUsageFeeRequired(feature, zoom);
                case 'TIPWARNINGINFO':
                    return new FM.mapApi.render.renderer.TipWarningInfo(feature, zoom);
                case 'TIPGATE':
                    return new FM.mapApi.render.renderer.TipGate(feature, zoom);
                //  315不上线
                case 'TIPSPEEDBUMP':
                    return new FM.mapApi.render.renderer.TipSpeedBump(feature, zoom);
                case 'TIPTRUCKLIMIT':
                    return new FM.mapApi.render.renderer.TipTruckLimit(feature, zoom);
                case 'TIPVARIABLESPEED':
                    return new FM.mapApi.render.renderer.TipVariableSpeed(feature, zoom);
                case 'TIPDRIVEWAYLIMIT':
                    return new FM.mapApi.render.renderer.TipDrivewayLimit(feature, zoom);
                case 'TIPTRUCKSPEEDLIMIT':
                    return new FM.mapApi.render.renderer.TipTruckSpeedLimit(feature, zoom);
                case 'TIPLANECHANGEPOINT':
                    return new FM.mapApi.render.renderer.TipLaneChangePoint(feature, zoom);
                case 'TIPREVERSIBLELANE':
                    return new FM.mapApi.render.renderer.TipReversibleLane(feature, zoom);
                case 'TIPTRUCKRESTRICTION':
                    return new FM.mapApi.render.renderer.TipTruckRestrictionTemp(feature, zoom);
                case 'TIPCROSSVOICEGUIDE':
                    return new FM.mapApi.render.renderer.TipCrossVoiceGuide(feature, zoom);
                case 'TIPNATUREVOICEGUIDE':
                    return new FM.mapApi.render.renderer.TipNatureVoiceGuide(feature, zoom);
                case 'TIPBANTRUCKSIN':
                    return new FM.mapApi.render.renderer.TipBanTrucksIn(feature, zoom);
                case 'TIPBUSDRIVEWAY':
                    return new FM.mapApi.render.renderer.TipBusDriveway(feature, zoom);
                case 'TIPVARIABLEDIRECTIONLANE':
                    return new FM.mapApi.render.renderer.TipVariableDirectionLane(feature, zoom);
                case 'TIPORIENTATION':
                    return new FM.mapApi.render.renderer.TipOrientation(feature, zoom);
                case 'TIPREALSIGN':
                    return new FM.mapApi.render.renderer.TipRealSign(feature, zoom);
                case 'TIPJVCBRANCH':
                    return new FM.mapApi.render.renderer.TipJVCBranch(feature, zoom);
                case 'TIPNORMALCROSS':
                    return new FM.mapApi.render.renderer.TipNormalCross(feature, zoom);
                case 'TIPMILEAGEPEG':
                    return new FM.mapApi.render.renderer.TipMileagePeg(feature, zoom);
                //  新增
                case 'TIPADASLINK':
                    return new FM.mapApi.render.renderer.TipADASLink(feature, zoom);
                case 'TIPADASNODE':
                    return new FM.mapApi.render.renderer.TipADASNode(feature, zoom);
                case 'TIPSTAIR':
                    return new FM.mapApi.render.renderer.TipStair(feature, zoom);
                case 'TIPOVERBRIDGE':
                    return new FM.mapApi.render.renderer.TipOverBridge(feature, zoom);
                case 'TIPNODESHIFT':
                    return new FM.mapApi.render.renderer.TipNodeShift(feature, zoom);
                case 'TIPGENERAL':
                    return new FM.mapApi.render.renderer.TipGeneral(feature, zoom);
                case 'TIPHIGHWAYCONNECT':
                    return new FM.mapApi.render.renderer.TipHighWayConnect(feature, zoom);
                case 'TIPLANELIMITWIDTHHEIGHT':
                    return new FM.mapApi.render.renderer.TipLaneLimitWidthHeight(feature, zoom);
                case 'TIPDELETEPROPERTYINPROGRESS':
                    return new FM.mapApi.render.renderer.TipDeletePropertyInProgress(feature, zoom);
                case 'TIPBUILDTIMECHANGE':
                    return new FM.mapApi.render.renderer.TipBuildTimeChange(feature, zoom);
                //  未制作
                case 'TIPAIRPORTFACE':
                    return new FM.mapApi.render.renderer.TipAirPortFace(feature, zoom);
                case 'TIPHIGHWAY':
                    return new FM.mapApi.render.renderer.TipHighway(feature, zoom);
                case 'TIPAOIFACE':
                    return new FM.mapApi.render.renderer.TipAOIFace(feature, zoom);
                case 'TIPAOINODE':
                    return new FM.mapApi.render.renderer.TipAOINode(feature, zoom);
                case 'TIPRAILWAY':
                    return new FM.mapApi.render.renderer.TipRailWay(feature, zoom);
                case 'TIPBUAFACE':
                    return new FM.mapApi.render.renderer.TipBUAFace(feature, zoom);
                default:
                    return null;
            }
        }
        return null;
    }
});
