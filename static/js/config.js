
window.login = {
  grant_type: 'password',
  client_id: 'backend-admin-app-client',
  scope: [
    'openid',
    'phone',
    'profile',
    'role',
    'XMGISPlatform',
    'IdentityService',
    'IdentityServer',
    'ApiGateway',
    'FileManagement',
    'XMGISStatistics',
    'XMGisDict',
    'XMGISSettingManagement',
    'XMGISDynamicForm',
  ],
}

window.mapName= 20220921115121
// 一键检测页面
window.oneDetection = {
  detectName: "3a051190-0470-f41f-9c37-b86267712fd7",
  detecttNamePL: "3a06c8d8-5c3a-868e-4db5-c8c78638dcc6",
  yzltUrl:
    "http://gisapp.xmghszzx.com:8020/gisProxy51/rest/services/Plan/YZLT_QYKJGHYZLT/MapServer/9", //一键检测，用地性质统计
  seaField: ["xm_xmmc", "yhpzwh"], // 涉及用海
  landField: ["xmmc", "pzwh"], // 涉及用地 // 批量检测-检测指标
  catalog: [
    {
      label: "地块编号",
      value: "地块编号",
      prop: "ID",
    },
    {
      label: "规划用地性质",
      value: "规划用地性质",
      prop: "type",
    },
    {
      label: "容积率上限",
      value: "容积率上限",
      prop: "plotRatioMax",
    },
    {
      label: "容积率下限",
      value: "容积率下限",
      prop: "plotRatioMin",
    },
    {
      label: "建筑高度上限",
      value: "建筑高度上限",
      prop: "buildingHeightMax",
    },
    {
      label: "建筑高度下限",
      value: "建筑高度下限",
      prop: "buildingHeightMin",
    },
    {
      label: "是否涉及耕地",
      value: "是否涉及耕地",
      prop: "plowland",
    },
    {
      label: "是否涉及林地",
      value: "是否涉及林地",
      prop: "forest",
    },
    {
      label: "用海情况",
      value: "用海情况",
      prop: "sea",
    },
    {
      label: "是否符合总规",
      value: "是否符合总规",
      prop: "comprehensivePlanning",
    },
    {
      label: "是否符合土规",
      value: "是否符合土规",
      prop: "landPlanning",
    },
    {
      label: "农转用情况",
      value: "农转用情况",
      prop: "farm",
    },
    {
      label: "是否涉及安全控制区",
      value: "是否涉及安全控制区",
      prop: "safetyZone",
    },
    {
      label: "是否涉及文物保护",
      value: "是否涉及文物保护",
      prop: "culturalRelic",
    },
    {
      label: "收储情况",
      value: "收储情况",
      prop: "stockpile",
    },
    {
      label: "是否有控规依据",
      value: "是否有控规依据",
      prop: "controlPlanning",
    },
  ],
};
