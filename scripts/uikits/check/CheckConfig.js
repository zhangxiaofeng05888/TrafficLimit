/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.check.CheckConfig = {
    RDLINK: {
        runtime: [
            'link_nodes_num_limit_check', // link的形状点不能大于490个 GLM01027
            'permit_check_node_is_not_contain_shapenode', // 形状点之间不能重合
            'permit_check_link_is_not_move_to_corner_node',
            'link_snap_link_limit_to_node',
            'two_link_is_not_same_enode_and_snode' // 两个rdlink不能有相同的起点和终点
        ],
        precheck: [
            'permit_check_is_integrity_rdlink' // 创建link，鼠标只点一个形状点就进行保存时，不能保存数据
        ],
        postcheck: [],
        property: []
    },
    RDNODE: {
        runtime: [
            'permit_check_rdnode_is_not_move_to_corner_node',
            'link_node_is_not_closed_on_add_node',
            'link_node_is_not_closed_on_move_node'
        ],
        precheck: [
            'permit_node_finalGeometry_no_empty'
        ],
        postcheck: [],
        property: []
    },
    LCLINK: {
        runtime: [
            'link_nodes_num_limit_check', // link的形状点不能大于490个 GLM01027
            'permit_check_node_is_not_contain_shapenode',
            'link_snap_link_limit_to_node',
            'shaping_check_face_isless_threepoint',
            'shaping_check_link_selfintersect_2',
            'permitmovecornerrules_link',
            'permitmovesheetcornerrules_link',
            'shaping_check_link_ringnobreak_2_link',
            'shaping_check_sheetline_not_move'
        ],
        precheck: [
            'permit_check_is_integrity_rdlink' // 创建link，鼠标只点一个形状点就进行保存时，不能保存数据
        ],
        postcheck: [],
        property: []
    },
    LCNODE: {
        runtime: [
            'permitmovecornerrules_node',
            'permitmovesheetcornerrules_node',
            'shaping_check_link_ringnobreak_2_node',
            'shaping_check_face_selfintersect_node',
            'link_node_is_not_closed_on_add_node',
            'link_node_is_not_closed_on_move_node'
        ],
        precheck: [
            'permit_node_finalGeometry_no_empty'
        ],
        postcheck: [],
        property: []
    },
    LULINK: {
        runtime: [
            'permit_check_node_is_not_contain_shapenode',
            'link_nodes_num_limit_check', // link的形状点不能大于490个 GLM01027
            'link_snap_link_limit_to_node',
            'shaping_check_face_isless_threepoint',
            'shaping_check_link_selfintersect_2',
            'permitmovecornerrules_link',
            'permitmovesheetcornerrules_link',
            'shaping_check_link_ringnobreak_2_link',
            'shaping_check_sheetline_not_move'
        ],
        precheck: [
            'permit_check_is_integrity_rdlink' // 创建link，鼠标只点一个形状点就进行保存时，不能保存数据
        ],
        postcheck: [],
        property: []
    },
    LUNODE: {
        runtime: [
            'permitmovecornerrules_node',
            'permitmovesheetcornerrules_node',
            'shaping_check_link_ringnobreak_2_node',
            'shaping_check_face_selfintersect_node',
            'link_node_is_not_closed_on_add_node',
            'link_node_is_not_closed_on_move_node'
        ],
        precheck: [
            'permit_node_finalGeometry_no_empty'
        ],
        postcheck: [],
        property: []
    },
    ZONELINK: {
        runtime: [
            'permit_check_node_is_not_contain_shapenode',
            'link_nodes_num_limit_check', // link的形状点不能大于490个 GLM01027
            'link_snap_link_limit_to_node',
            'shaping_check_face_isless_threepoint',
            'shaping_check_link_selfintersect_2',
            'permitmovecornerrules_link',
            'permitmovesheetcornerrules_link',
            'shaping_check_link_ringnobreak_2_link',
            'shaping_check_sheetline_not_move'
        ],
        precheck: [
            'permit_check_is_integrity_rdlink' // 创建link，鼠标只点一个形状点就进行保存时，不能保存数据
        ],
        postcheck: [],
        property: []
    },
    ZONENODE: {
        runtime: [
            'permitmovecornerrules_node',
            'permitmovesheetcornerrules_node',
            'shaping_check_link_ringnobreak_2_node',
            'shaping_check_face_selfintersect_node',
            'link_node_is_not_closed_on_add_node',
            'link_node_is_not_closed_on_move_node'
        ],
        precheck: [
            'permit_node_finalGeometry_no_empty'
        ],
        postcheck: [],
        property: []
    },
    ADLINK: {
        runtime: [
            'permit_check_node_is_not_contain_shapenode',
            'link_nodes_num_limit_check', // link的形状点不能大于490个 GLM01027
            'link_snap_link_limit_to_node',
            'shaping_check_face_isless_threepoint',
            'shaping_check_link_selfintersect_2',
            'permitmovecornerrules_link',
            'permitmovesheetcornerrules_link',
            'shaping_check_link_ringnobreak_2_link',
            'shaping_check_sheetline_not_move'
        ],
        precheck: [
            'permit_check_is_integrity_rdlink' // 创建link，鼠标只点一个形状点就进行保存时，不能保存数据
        ],
        postcheck: [],
        property: []
    },
    ADNODE: {
        runtime: [
            'permitmovecornerrules_node',
            'permitmovesheetcornerrules_node',
            'shaping_check_link_ringnobreak_2_node',
            'shaping_check_face_selfintersect_node',
            'link_node_is_not_closed_on_add_node',
            'link_node_is_not_closed_on_move_node'
        ],
        precheck: [
            'permit_node_finalGeometry_no_empty'
        ],
        postcheck: [],
        property: []
    },
    RWLINK: {
        runtime: [
            'permit_check_node_is_not_contain_shapenode',
            'link_nodes_num_limit_check', // link的形状点不能大于490个 GLM01027
            'link_snap_link_limit_to_node',
            'shaping_check_link_selfintersect_2',
            'permitmovecornerrules_link',
            'permitmovesheetcornerrules_link',
            'shaping_check_link_ringnobreak_2_link'
        ],
        precheck: [
            'permit_check_is_integrity_rdlink' // 创建link，鼠标只点一个形状点就进行保存时，不能保存数据
        ],
        postcheck: [],
        property: []
    },
    RWNODE: {
        runtime: [
            'permitmovecornerrules_node',
            'permitmovesheetcornerrules_node',
            'shaping_check_link_ringnobreak_2_node',
            'link_node_is_not_closed_on_add_node',
            'link_node_is_not_closed_on_move_node'
        ],
        precheck: [
            'permit_node_finalGeometry_no_empty'
        ],
        postcheck: [],
        property: []
    },
    CMGBUILDLINK: {
        runtime: [
            'permit_check_node_is_not_contain_shapenode',
            'link_nodes_num_limit_check', // link的形状点不能大于490个 GLM01027
            'link_snap_link_limit_to_node',
            'shaping_check_face_isless_threepoint',
            'permitmovesheetcornerrules_link',
            'shaping_check_link_selfintersect_2',
            'shaping_check_link_ringnobreak_2_link'
        ],
        precheck: [
            'permit_check_is_integrity_rdlink' // 创建link，鼠标只点一个形状点就进行保存时，不能保存数据
        ],
        postcheck: [],
        property: []
    },
    CMGBUILDNODE: {
        runtime: [
            'permitmovesheetcornerrules_node',
            'shaping_check_link_ringnobreak_2_node',
            'shaping_check_face_selfintersect_node',
            'link_node_is_not_closed_on_add_node',
            'link_node_is_not_closed_on_move_node'
        ],
        precheck: [
            'permit_node_finalGeometry_no_empty'
        ],
        postcheck: [],
        property: []
    },

    CMGBUILDING: {
        runtime: [
        ],
        precheck: [
            'permit_face_no_empty'
        ],
        postcheck: [],
        property: []
    },
    LCFACE: {
        runtime: [
            'shaping_check_face_selfintersect_face',
            'lcLink_with_single_line_river_not_composed_to_face'
        ],
        precheck: [
            'check_face_must_composed_by_closedlink',
            'check_face_at_least_three_points',
            'shaping_check_face_selfintersect_face_when_link_to_face'
        ],
        postcheck: [],
        property: []
    },
    LUFACE: {
        runtime: [
            'shaping_check_face_selfintersect_face'
        ],
        precheck: [
            'check_face_must_composed_by_closedlink',
            'check_face_at_least_three_points',
            'shaping_check_face_selfintersect_face_when_link_to_face'
        ],
        postcheck: [],
        property: []
    },
    ADFACE: {
        runtime: [
            'shaping_check_face_selfintersect_face'
        ],
        precheck: [
            'check_face_must_composed_by_closedlink',
            'check_face_at_least_three_points',
            'check_adlink_face_must_composed_by_closedlink',
            'shaping_check_face_selfintersect_face_when_link_to_face'
        ],
        postcheck: [],
        property: []
    },
    ZONEFACE: {
        runtime: [
            'shaping_check_face_selfintersect_face'
        ],
        precheck: [
            'check_face_must_composed_by_closedlink',
            'check_face_at_least_three_points',
            'shaping_check_face_selfintersect_face_when_link_to_face'
        ],
        postcheck: [],
        property: []
    },
    CMGBUILDFACE: {
        runtime: [
            'shaping_check_face_selfintersect_face'
        ],
        precheck: [
            'check_face_must_composed_by_closedlink',
            'check_face_at_least_three_points',
            'shaping_check_face_selfintersect_face_when_link_to_face'
        ],
        postcheck: [],
        property: []
    },
    RDRESTRICTION: {
        runtime: [],
        precheck: [
            'permit_check_is_integrity_restriction',
            'restriction_part_has_arrow_outLink',
            'restriction_viaLink_is_closed'
        ],
        postcheck: [],
        property: []
    },
    RDRESTRICTIONTRUCK: {
        runtime: [],
        precheck: [
            'permit_check_is_integrity_restriction',
            'restriction_part_has_arrow_outLink',
            'restriction_viaLink_is_closed'
        ],
        postcheck: [],
        property: []
    },
    RDSLOPE: {
        runtime: [
            'rdSlope_outLink_kind_check', // 坡度关联退出线种别检查
            'rdSlope_inNode_check',
            'rdSlope_links_check',
            'rdSlope_outLink_length_check'
        ],
        precheck: [
            'rdSlope_outLink_form_check'
        ],
        postcheck: [],
        property: []
    },
    IXPOI: {
        runtime: [
            'ixPoi_link_form_check' // 新建poi时对link的form属性的检查
        ],
        precheck: [
            'ixPoi_name_kindCode_check',
            'ixPoi_batch_converge_location_integrity_check',
            'ixPoi_batch_guide_auto_integrity_check',
            'ixPoi_batch_guide_manual_integrity_check',
            'ixPoi_batch_translate_location_integrity_check'
        ],
        postcheck: [],
        property: []
    },
    RDMILEAGEPILE: {
        runtime: [
            'mileagePile_link_kind_check', // 里程桩关联link种别检查
            'mileagePile_link_form_check', // 里程桩关联link形态检查
            'mileagePile_point_position' // 里程桩点位不能再link端点
        ],
        precheck: [
            'mileagePile_point_complete'    // 里程桩完整性检查
        ],
        postcheck: [],
        property: []
    },
    RDLINKWARNING: {
        runtime: [
            'linkWarning_link_limit', // 10级路/步行街/人渡不能是警示信息的进入线
            'move_point_distance', // 移动点位不能超过50m,
            // 'linkWarning_point_no_node',  // 点限速位置不能为link端点
            'linkWarning_move_canpass_link',  // 移动点判断连通性
            'rdlink_warning_geo_is_not_in_mesh_link'
        ],
        precheck: [
            'point_direct_link_no_empty' // 新增要素所选条件不全，point、linkPid、direct
        ],
        postcheck: [],
        property: []
    },
    RDSPEEDLIMIT: {
        runtime: [
            'speedLimit_link_no_cross', // 不能选择交叉口link
            'move_point_distance', // 移动点位不能超过50m,
            'speedLimit_point_no_node',  // 点限速位置不能为link端点
            'speedLimit_move_canpass_link'  // 移动点判断连通性
        ],
        precheck: [
            'point_direct_link_no_empty' // 新增要素所选条件不全，point、linkPid、direct
        ],
        postcheck: [],
        property: []
    },
    RDLINKSPEEDLIMIT: {
        runtime: [],
        precheck: [
            'linkSpeedLimit_complete' // 新增要素所选条件不全
        ],
        postcheck: [],
        property: []
    },
    RDELECTRONICEYE: {
        runtime: [
            'move_point_distance', // 移动点位不能超过100m
            'electronicEye_add_pair' // 配对电子眼必须是区间测速开始和区间测速结束
        ],
        precheck: [
            'point_direct_link_no_empty' // 新增要素所选条件不全，point、linkPid、direct
        ],
        postcheck: [],
        property: []
    },
    RDSPEEDBUMP: {
        runtime: [
            'rdSpeedBump_link_kind_check', // 减速带进入线种别检查
            'rdSpeedBump_link_form_check' // 里程桩进入线形态检查
        ],
        precheck: [
            'speedBump_link_point_check'    // 减速带完整性检查
        ],
        postcheck: [],
        property: []
    },
    // RDWARNINGINFO: {
    //     runtime: [
    //         'rdWarningInfo_link_check', // 警示信息进入线种别、形态检查
    //         'rdWarningInfo_node_check' // 警示信息进入点不能为图廓点
    //     ],
    //     precheck: [
    //         'rdWarningInfo_link_node'   // 警示信息完整性
    //     ],
    //     postcheck: [],
    //     property: []
    // },
    RDGATE: {
        runtime: [
            'rdGate_node_hookLink_check' // 大门点挂接link数检查
        ],
        precheck: [
            'link_node_link_no_empty'
        ],
        postcheck: [],
        property: []
    },
    RDTOLLGATE: {
        runtime: [
            'rdTollGate_node_hookLink_check', // 收费站点挂接link数检查
            'rdTollGate_inLink_outLink_check' // 收费站进入、退出线检查
        ],
        precheck: [
            'link_node_link_no_empty'
        ],
        postcheck: [],
        property: []
    },
    RDHGWGLIMIT: {
        runtime: [
            'rdHgWgLimit_point_position', // 限高限重点位不能在link端点
            'move_point_distance' // 限高限重修改点位移动距离不能超过50米
        ],
        precheck: [
            'point_direct_link_no_empty'
        ],
        postcheck: [],
        property: []
    },
    RDSIDEROAD: {
        runtime: [],
        precheck: [
            'buffer_width'
        ],
        postcheck: [],
        property: []
    },
    RDMULTIDIGITIZED: {
        runtime: [],
        precheck: [
            'buffer_width'
        ],
        postcheck: [],
        property: []
    },
    // TIPBORDER: {
    //     runtime: [],
    //     precheck: [
    //         'tipBorder_Geometry'
    //     ],
    //     postcheck: [],
    //     property: []
    // },
    RDHIGHSPEEDBRANCH: {
        runtime: [
            'branch_rule_1', // 高速分歧、IC分歧、实景看板的进入线必须是城高或高速
            'branch_rule_6', // 高速分歧、IC分歧的退出线必须是城高或高速
            'branch_is_not_same_outLink'    // 退出线不能选择和之前一样
        ],
        precheck: [
            'branch_link_node_link_no_empty' // PERMIT_CHECK_IS_INTEGRITY_RDBRANCH 分歧信息关系要完整，分歧信息应该是完整的线点线关系
        ],
        postcheck: [],
        property: []
    },
    RDASPECTBRANCH: {
        runtime: [
            'branch_rule_2', // 方面分歧、方向看板、实景看板不能以8级及以下的link作为分歧进入线
            'branch_rule_7', // 方面分歧、方向看板、实景看板不能以8级及以下的link作为分歧退出线
            'branch_is_not_same_outLink'    // 退出线不能选择和之前一样
        ],
        precheck: [
            'branch_link_node_link_no_empty' // PERMIT_CHECK_IS_INTEGRITY_RDBRANCH 分歧信息关系要完整，分歧信息应该是完整的线点线关系
        ],
        postcheck: [],
        property: []
    },
    RDICBRANCH: {
        runtime: [
            'branch_rule_1', // 高速分歧、IC分歧、实景看板的进入线必须是城高或高速
            'branch_rule_6', // 高速分歧、IC分歧的退出线必须是城高或高速
            'branch_is_not_same_outLink'    // 退出线不能选择和之前一样
        ],
        precheck: [
            'branch_link_node_link_no_empty' // PERMIT_CHECK_IS_INTEGRITY_RDBRANCH 分歧信息关系要完整，分歧信息应该是完整的线点线关系
        ],
        postcheck: [],
        property: []
    },
    RD3DBRANCH: {
        runtime: [
            'branch_rule_3', // 3D分歧不能以9级路、10级路、步行街和人渡的link作为分歧进入线
            'branch_rule_8', // 3D分歧不能以10级路、步行街和人渡的link作为分歧退出线
            'branch_is_not_same_outLink'    // 退出线不能选择和之前一样
        ],
        precheck: [
            'branch_link_node_link_no_empty' // PERMIT_CHECK_IS_INTEGRITY_RDBRANCH 分歧信息关系要完整，分歧信息应该是完整的线点线关系
        ],
        postcheck: [],
        property: []
    },
    RDCOMPLEXSCHEMA: {
        runtime: [
            'branch_is_not_same_outLink'    // 退出线不能选择和之前一样
        ],
        precheck: [
            'branch_link_node_link_no_empty' // PERMIT_CHECK_IS_INTEGRITY_RDBRANCH 分歧信息关系要完整，分歧信息应该是完整的线点线关系
        ],
        postcheck: [],
        property: []
    },
    RDREALIMAGE: {
        runtime: [
            'branch_rule_4', // 实景图的进入线不能为9级路、10级路、步行街、公交车专用道、人渡、轮渡、交叉口link
            'branch_rule_9', // 实景图的退出线不能为9级路、10级路、步行街、公交车专用道、人渡、轮渡、交叉口link
            'branch_is_not_same_outLink'    // 退出线不能选择和之前一样
        ],
        precheck: [
            'branch_link_node_link_no_empty' // PERMIT_CHECK_IS_INTEGRITY_RDBRANCH 分歧信息关系要完整，分歧信息应该是完整的线点线关系
        ],
        postcheck: [],
        property: []
    },
    RDSIGNASREAL: {
        runtime: [
            'branch_rule_1', // 实景看板的进入线必须是城高或高速
            'branch_rule_2', // 实景看板不能以8级及以下的link作为分歧进入线
            'branch_rule_7', // 实景看板不能以8级及以下的link作为分歧退出线
            'branch_is_not_same_outLink'    // 退出线不能选择和之前一样
        ],
        precheck: [
            'branch_link_node_link_no_empty' // PERMIT_CHECK_IS_INTEGRITY_RDBRANCH 分歧信息关系要完整，分歧信息应该是完整的线点线关系
        ],
        postcheck: [],
        property: []
    },
    RDSERIESBRANCH: {
        runtime: [
            'branch_rule_5', // 连续分歧的进入线不能为1、2级种别以外种别的道路
            'branch_rule_10', // 连续分歧的退出线不能为1、2级种别以外种别的道路
            'branch_is_not_same_outLink'    // 退出线不能选择和之前一样
        ],
        precheck: [
            'branch_link_node_link_no_empty' // PERMIT_CHECK_IS_INTEGRITY_RDBRANCH 分歧信息关系要完整，分歧信息应该是完整的线点线关系
        ],
        postcheck: [],
        property: []
    },
    RDSE: {
        runtime: [
            'rdSe_link_form_check', // 10级路/步行街/人渡不能是SE的进入、退出线
            'rdSe_link_imicode_check' // IMI代码为1和2的link不能作为分叉口的退出线
        ],
        precheck: [
            'link_node_link_no_empty'
        ],
        postcheck: [],
        property: []
    },
    RDSCHEMATICBRANCH: {
        runtime: [
            'branch_is_not_same_outLink'    // 退出线不能选择和之前一样
        ],
        precheck: [
            'branch_link_node_link_no_empty' // PERMIT_CHECK_IS_INTEGRITY_RDBRANCH 分歧信息关系要完整，分歧信息应该是完整的线点线关系
        ],
        postcheck: [],
        property: []
    },
    RDSIGNBOARD: {
        runtime: [
            'branch_rule_2', // 方面分歧、方向看板、实景看板不能以8级及以下的link作为分歧进入线
            'branch_rule_7', // 方面分歧、方向看板、实景看板不能以8级及以下的link作为分歧退出线
            'branch_is_not_same_outLink'    // 退出线不能选择和之前一样
        ],
        precheck: [
            'branch_link_node_link_no_empty' // PERMIT_CHECK_IS_INTEGRITY_RDBRANCH 分歧信息关系要完整，分歧信息应该是完整的线点线关系
        ],
        postcheck: [],
        property: []
    },
    RDVARIABLESPEED: {
        runtime: [
            'rdVariableSpeed_link_check', // 可变限速，进入线、退出线、接续link检查
            'rdVariableSpeed_inNode_check', // 可变限速进入点检查
            'rdVariableSpeed_recommend_viasLink_check' // 可变限速推荐接续link检查
        ],
        precheck: [
            'rdVariableSpeed_data_complete' // 进入线、进入点、退出线必须完整
        ],
        postcheck: [],
        property: []
    },
    RDDIRECTROUTE: {
        runtime: [
            'rdDirectRoute_link_check' // 顺行进入线、退出线、经过线检查
            // 'directRoute_outlink_select'    // 退出线不能选择线线关系
        ],
        precheck: [
            'rdDirectRoute_data_complete' // 进入线、进入点、退出线必须完整
        ],
        postcheck: [],
        property: []
    },
    RDVOICEGUIDE: {
        runtime: [
            'voiceGuide_inLink_check_kind', // 9级路、10级路、步行街、人渡、高速道路、城市高速不能作为语音引导的进入线 RELATING_CHECK_INLINK_VOICE_HIGHWAY
            'voiceGuide_outLink_check_kind', // 9级路、10级路、步行街、人渡不能作为语音引导的退出线 RELATING_CHECK_INLINK_VOICE_HIGHWAY
            'voiceGuide_inLink_form_corss', // 交叉点内道路不能作为语音引导的进入线 GLM18012
            'voiceGuide_outLink_form_corss', // 交叉点内道路不能作为语音引导的退出线 GLM18012
            'voiceGuide_inLink_form_island', // 环岛不能作为语音引导的进入线 GLM18015
            'voiceGuide_outLink_form_island' // 环岛不能作为语音引导的退出线 GLM18015
        ],
        precheck: [
            'voiceGuide_data_complete' // 语音引导信息不完整，语音引导信息应该是完整的线点线关系
        ],
        postcheck: [],
        property: []
    },
    RDLANECONNEXITY: {
        runtime: [
            'lane_connexity_runtime_check'
        ],
        precheck: [
            'lane_connexity_integrity_check'
        ],
        postcheck: [],
        property: []
    },
    RDINTER: {
        runtime: [
            // 'rdInter_node_check' // 不能前端校验的原因是，框选操作结束后虽然款选结果包含图廓点，但是其他的点可以做crfi，不能撤销用户的操作,
        ],
        precheck: [
            'rdInter_node_form_check' // 至少需要一个node点
        ],
        postcheck: [],
        property: []
    },
    RDROAD: {
        runtime: [],
        precheck: [
            'rdRoad_link_form_check' // 至少需要一个link
        ],
        postcheck: [],
        property: []
    },
    RDOBJECT: {
        runtime: [],
        precheck: [
            'rdObject_form_check' // link，inter road，至少需要一个
        ],
        postcheck: [],
        property: []
    },
    RDGSC: {
        runtime: [
            'rdgsc_link_form_check'
        ],
        precheck: [
            'rdgsc_changed_check',
            'rdgsc_integrity_check',
            'link_node_is_not_closed_on_add_rdgsc'
        ],
        postcheck: [],
        property: []
    },
    LINKBREAK: {
        runtime: [],
        precheck: [
            'link_break_form_check'
        ],
        postcheck: [],
        property: []
    },
    TIPPEDESTRIANSTREET: {
        runtime: [],
        precheck: [
            'startEndTip_integrity_check',
            'startEndTip_canPass_check',
            'startEndTip_samePoint_check'
        ],
        postcheck: [],
        property: []
    },
    TIPROADSA: {
        runtime: [
            'tipRoadSA_link_check_kind'
        ],
        precheck: [
            'tipRoadSA_data_check'
        ],
        postcheck: [],
        property: []
    },
    TIPROADPA: {
        runtime: [
            'tipRoadSA_link_check_kind'
        ],
        precheck: [
            'tipRoadSA_data_check'
        ],
        postcheck: [],
        property: []
    },
    TIPHIGHWAYCONNECT: {
        runtime: [
            'tipRoadSA_link_check_kind'
        ],
        precheck: [
            'tipRoadSA_data_check'
        ],
        postcheck: [],
        property: []
    },
    REGIONSELECT: {
        runtime: [],
        precheck: ['regionSelect_commit_check'],
        postcheck: [],
        property: []
    },
    TIPLANECONNEXITY: {
        runtime: [],
        precheck: ['tipLaneConnexity_extend_check'],
        postcheck: [],
        property: ['tipLaneConnexity_extend_update_check']
    },
    TIPSKETCH: {
        runtime: [],
        precheck: ['tipSketch_save_check'],
        postcheck: [],
        property: []
    },
    TIPBRIDGE: {
        runtime: [],
        precheck: [
            'startEndTip_integrity_check',
            'startEndTip_canPass_check',
            'startEndTip_samePoint_check'
        ],
        postcheck: [],
        property: []
    },
    TIPBUSLANE: {
        runtime: [],
        precheck: [
            'startEndTip_integrity_check',
            'startEndTip_canPass_check',
            'startEndTip_samePoint_check'
        ],
        postcheck: [],
        property: []
    },
    TIPMAINTENANCE: {
        runtime: [],
        precheck: [
            'startEndTip_integrity_check',
            'startEndTip_canPass_check',
            'startEndTip_samePoint_check'
        ],
        postcheck: [],
        property: []
    },
    TIPTUNNEL: {
        runtime: [],
        precheck: [
            'startEndTip_integrity_check',
            'startEndTip_canPass_check',
            'startEndTip_samePoint_check'
        ],
        postcheck: [],
        property: []
    },
    TIPMULTIDIGITIZED: {
        runtime: [],
        precheck: [
            'startEndTip_integrity_check'
        ],
        postcheck: [],
        property: []
    },
    TIPLINKS: {
        runtime: [
            'permit_check_node_is_not_contain_shapenode' // 形状点之间不能重合
        ],
        precheck: [
            'length_not_zero'
        ],
        postcheck: [],
        property: []
    },
    TIPROADNAME: {
        runtime: [],
        precheck: [
            'length_not_zero'
        ],
        postcheck: [],
        property: []
    },
    TIPGSC: {
        runtime: [
            'self_intersection_check'
        ],
        precheck: [],
        postcheck: [],
        property: []
    },
    MERGESUBTASK: {
        runtime: [],
        precheck: [
            'merge_subTask_num',
            'merge_subTask_adjacent'
        ],
        postcheck: [],
        property: []
    },
    DRAWSUBTASK: {
        runtime: [],
        precheck: [
            'drawLink_not_intersect'
        ],
        postcheck: [],
        property: []
    },
    DRAWQUALITYCIRCLE: {
        runtime: [],
        precheck: [
            'draw_polygon_close',
            'drawPolygon_not_intersect'
        ],
        postcheck: [],
        property: []
    },
    UPDATEQUALITYCIRCLE: {
        runtime: [],
        precheck: [
            'draw_polygon_close'
        ],
        postcheck: [],
        property: []
    },
    RDCROSS: {
        runtime: [],
        precheck: [
            'rdcross_integrity'
        ],
        postcheck: [],
        property: []
    },
    RDTRAFFICSIGNAL: {
        runtime: [],
        precheck: [
            'node_no_empty'
        ],
        postcheck: [],
        property: []
    },
    TIPBUILDTIMECHANGE: {
        runtime: [],
        precheck: [
            'startEndTip_integrity_check',
            'startEndTip_canPass_check',
            'startEndTip_samePoint_check',
            'buildTimeChange_limit_check'
        ],
        postcheck: [],
        property: []
    },
    TIPDELETEPROPERTYINPROGRESS: {
        runtime: [],
        precheck: [
            'property_in_progress_check'
        ],
        postcheck: [],
        property: []
    },
    ADJUSTIMAGE: {
        runtime: [],
        precheck: [
            'permit_check_move_distance' // 形状点之间不能重合
        ],
        postcheck: [],
        property: []
    }

};
