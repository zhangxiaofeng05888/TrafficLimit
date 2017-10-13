FM.mapApi.render.renderer.ThematicRender = FM.mapApi.render.Render.extend({
    getRenderer: function (feature, zoom) {
        var TMCode = feature.properties.TMCode;
        switch (TMCode) {
            case 515:
                return new FM.mapApi.render.renderer.TMAppInfo(feature, zoom);
            case 509:
                return new FM.mapApi.render.renderer.TMDevelopState(feature, zoom);
            case 514:
                return new FM.mapApi.render.renderer.TMIsViaduct(feature, zoom);
            case 507:
                return new FM.mapApi.render.renderer.TMLinkFunctionClass(feature, zoom);
            case 506:
                return new FM.mapApi.render.renderer.TMLinkLaneClass(feature, zoom);
            case 508:
                return new FM.mapApi.render.renderer.TMLinkLaneNum(feature, zoom);
            case 502:
                return new FM.mapApi.render.renderer.TMLinkLimitNum(feature, zoom);
            case 503:
                return new FM.mapApi.render.renderer.TMLinkSpeedlimitSpeedClass(feature, zoom);
            case 504:
                return new FM.mapApi.render.renderer.TMLinkSpeedlimitSpeedClassWork(feature, zoom);
            case 505:
                return new FM.mapApi.render.renderer.TMLinkSpeedlimitSpeedLimitSrc(feature, zoom);
            case 510:
                return new FM.mapApi.render.renderer.TMMultiDigitized(feature, zoom);
            case 517:
                return new FM.mapApi.render.renderer.TMNameContent(feature, zoom);
            case 518:
                return new FM.mapApi.render.renderer.TMNameGroupid(feature, zoom);
            case 519:
                return new FM.mapApi.render.renderer.TMNameType(feature, zoom);
            case 511:
                return new FM.mapApi.render.renderer.TMPaveStatus(feature, zoom);
            case 516:
                return new FM.mapApi.render.renderer.TMRdLinkForm(feature, zoom);
            case 522:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay10(feature, zoom);
            case 523:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay11(feature, zoom);
            case 524:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay12(feature, zoom);
            case 525:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay13(feature, zoom);
            case 526:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay14(feature, zoom);
            case 527:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay15(feature, zoom);
            case 528:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay16(feature, zoom);
            case 529:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay17(feature, zoom);
            case 530:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay20(feature, zoom);
            case 531:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay31(feature, zoom);
            case 532:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay33(feature, zoom);
            case 533:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay34(feature, zoom);
            case 534:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay35(feature, zoom);
            case 535:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay36(feature, zoom);
            case 536:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay37(feature, zoom);
            case 537:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay38(feature, zoom);
            case 538:
                return new FM.mapApi.render.renderer.TMRdLinkFormOfWay39(feature, zoom);
            case 549:
                return new FM.mapApi.render.renderer.TMRdLinkIntRticRank(feature, zoom);
            case 521:
                return new FM.mapApi.render.renderer.TMRdLinkLimitType(feature, zoom);
            case 539:
                return new FM.mapApi.render.renderer.TMRdLinkLimitType0(feature, zoom);
            case 547:
                return new FM.mapApi.render.renderer.TMRdLinkLimitType1(feature, zoom);
            case 543:
                return new FM.mapApi.render.renderer.TMRdLinkLimitType2(feature, zoom);
            case 544:
                return new FM.mapApi.render.renderer.TMRdLinkLimitType5(feature, zoom);
            case 545:
                return new FM.mapApi.render.renderer.TMRdLinkLimitType6(feature, zoom);
            case 546:
                return new FM.mapApi.render.renderer.TMRdLinkLimitType7(feature, zoom);
            case 540:
                return new FM.mapApi.render.renderer.TMRdLinkLimitType8(feature, zoom);
            case 541:
                return new FM.mapApi.render.renderer.TMRdLinkLimitType9(feature, zoom);
            case 542:
                return new FM.mapApi.render.renderer.TMRdLinkLimitType10(feature, zoom);
            case 548:
                return new FM.mapApi.render.renderer.TMRdLinkRticRank(feature, zoom);
            case 551:
                return new FM.mapApi.render.renderer.TMRdLinkZoneCount(feature, zoom);
            case 552:
                return new FM.mapApi.render.renderer.TMRdLinkZoneSide(feature, zoom);
            case 550:
                return new FM.mapApi.render.renderer.TMRdLinkZoneTpye(feature, zoom);
            case 513:
                return new FM.mapApi.render.renderer.TMSpecialTraffic(feature, zoom);
            case 520:
                return new FM.mapApi.render.renderer.TMSpeedlimitConditionCount(feature, zoom);
            case 512:
                return new FM.mapApi.render.renderer.TMTollInfo(feature, zoom);
            case 501:
                return new FM.mapApi.render.renderer.TMTruckLimitData(feature, zoom);
            case 554:
                return new FM.mapApi.render.renderer.TMIMI(feature, zoom);
            case 555:
                return new FM.mapApi.render.renderer.TMRdLinkUrban(feature, zoom);
            case 556:
                return new FM.mapApi.render.renderer.TMRdLinkWalk(feature, zoom);
            case 557:
                return new FM.mapApi.render.renderer.TMRdLinkSidewalk(feature, zoom);
            case 558:
                return new FM.mapApi.render.renderer.TMRdLinkWalkstair(feature, zoom);
            default:
                return null;
        }
    }
});
