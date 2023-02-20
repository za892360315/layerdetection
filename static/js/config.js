window.mapConfig = {
  governmentSpace: {
    id: 'HL06_XZJZ_3857_1119',
    serviceUrl:
      'https://gisapp.xmghszzx.com:8030/gisProxy25/rest/services/CGCS2000/XMMAP/MapServer',
    formal:
      'http://10.192.10.45:8320/xmgis/api/platform/layer-request/3a05bd42-241c-ee40-ba99-2d0a6763042d/xmgis/api/data-sharing/layer-request/3a03edc6-f8d6-158d-70e5-41a0f4846ed5/arcgis/rest/services/CGCS2000/XMMAP/MapServer',
    title: '电子地图',
    type: 'Tile',
    layerType: 7,
    opacity: 100,
    spatialReference: {
      wkid: 4490,
    },
    visible: true,
  },
  governmentNotes: {
    id: 'HL06_XZJZ_3857_1119-z',
    serviceUrl:
      'https://gisapp.xmghszzx.com:8030/gisProxy25/rest/services/CGCS2000/XMMAP_CVA/MapServer',
    formal:
      'http://10.192.10.45:8320/xmgis/api/platform/layer-request/3a05bd42-241c-ee40-ba99-2d0a6763042d/xmgis/api/data-sharing/layer-request/3a03edc6-f8d6-158d-70e5-41a0f4846ed5/arcgis/rest/services/CGCS2000/XMMAP/MapServer',
    title: '电子地图-注记',
    type: 'Tile',
    layerType: 7,
    opacity: 100,
    spatialReference: {
      wkid: 4490,
    },
    visible: true,
  },
  governmentSpace3d: {
    id: 'HL06_XZJZ_3857_1119_3d',
    serviceUrl:
      'https://gisapp.xmghszzx.com:8030/gisProxy25/rest/services/CGCS2000/XMMAP/MapServer/tile/{level}/{row}/{col}',
    formal:
      'http://10.192.10.45:8320/xmgis/api/platform/layer-request/3a05bd42-241c-ee40-ba99-2d0a6763042d/xmgis/api/data-sharing/layer-request/3a03edc6-f8d6-158d-70e5-41a0f4846ed5/arcgis/rest/services/CGCS2000/XMMAP/MapServer/tile/{level}/{row}/{col}',
    title: '电子地图3d',
    type: 'WebTile',
    layerType: 8,
    opacity: 100,
    spatialReference: {
      wkid: 4490,
      latestWkid: 4490,
    },
    visible: false,
    lods: [
      {
        level: 0,
        levelValue: '1',
        resolution: 0.703125,
        scale: 295497593.05875003,
      },
      {
        level: 1,
        levelValue: '2',
        resolution: 0.3515625,
        scale: 147748796.52937502,
      },
      {
        level: 2,
        levelValue: '3',
        resolution: 0.17578125,
        scale: 73874398.264687508,
      },
      {
        level: 3,
        levelValue: '4',
        resolution: 0.087890625,
        scale: 36937199.132343754,
      },
      {
        level: 4,
        levelValue: '5',
        resolution: 0.0439453125,
        scale: 18468599.566171877,
      },
      {
        level: 5,
        levelValue: '6',
        resolution: 0.02197265625,
        scale: 9234299.7830859385,
      },
      {
        level: 6,
        levelValue: '7',
        resolution: 0.010986328125,
        scale: 4617149.8915429693,
      },
      {
        level: 7,
        levelValue: '8',
        resolution: 0.0054931640625,
        scale: 2308574.9457714846,
      },
      {
        level: 8,
        levelValue: '9',
        resolution: 0.00274658203125,
        scale: 1154287.4728857423,
      },
      {
        level: 9,
        levelValue: '10',
        resolution: 0.001373291015625,
        scale: 577143.73644287116,
      },
      {
        level: 10,
        levelValue: '11',
        resolution: 0.0006866455078125,
        scale: 288571.86822143558,
      },
      {
        level: 11,
        levelValue: '12',
        resolution: 0.00034332275390625,
        scale: 144285.93411071779,
      },
      {
        level: 12,
        levelValue: '13',
        resolution: 0.000171661376953125,
        scale: 72142.967055358895,
      },
      {
        level: 13,
        levelValue: '14',
        resolution: 8.58306884765625e-5,
        scale: 36071.483527679447,
      },
      {
        level: 14,
        levelValue: '15',
        resolution: 4.291534423828125e-5,
        scale: 18035.741763839724,
      },
      {
        level: 15,
        levelValue: '16',
        resolution: 2.1457672119140625e-5,
        scale: 9017.8708819198619,
      },
      {
        level: 16,
        levelValue: '17',
        resolution: 1.0728836059570313e-5,
        scale: 4508.9354409599309,
      },
      {
        level: 17,
        levelValue: '18',
        resolution: 5.3644180297851563e-6,
        scale: 2254.4677204799655,
      },
      {
        level: 18,
        levelValue: '19',
        resolution: 2.68220901489257815e-6,
        scale: 1127.23386023998275,
      },
      {
        level: 19,
        levelValue: '20',
        resolution: 1.341104507446289075e-6,
        scale: 563.616930119991375,
      },
    ],
  },
  satelliteImage: {
    id: '3a03edca-b831-5991-64ee-6dac265c72xx',
    serviceUrl:
      'https://gisapp.xmghszzx.com:8030/gisProxy25/rest/services/CGCS2000/DOMMAP/MapServer/tile/{level}/{row}/{col}',
    formal:
      'http://10.192.10.45:8320/xmgis/api/platform/layer-request/3a05bd4f-02ff-7c3b-5180-e38871bb238c/xmgis/api/data-sharing/layer-request/3a03edca-b831-5991-64ee-6dac265c72da/arcgis/rest/services/CGCS2000/DOMMAP/MapServer/tile/{level}/{row}/{col}',
    title: '影像底图2000',
    type: 'WebTile',
    layerType: 8,
    opacity: 100,
    spatialReference: {
      wkid: 4490,
    },
    visible: false,
    lods: [
      {
        level: 0,
        levelValue: '1',
        resolution: 0.703125,
        scale: 295497593.05875003,
      },
      {
        level: 1,
        levelValue: '2',
        resolution: 0.3515625,
        scale: 147748796.52937502,
      },
      {
        level: 2,
        levelValue: '3',
        resolution: 0.17578125,
        scale: 73874398.264687508,
      },
      {
        level: 3,
        levelValue: '4',
        resolution: 0.087890625,
        scale: 36937199.132343754,
      },
      {
        level: 4,
        levelValue: '5',
        resolution: 0.0439453125,
        scale: 18468599.566171877,
      },
      {
        level: 5,
        levelValue: '6',
        resolution: 0.02197265625,
        scale: 9234299.7830859385,
      },
      {
        level: 6,
        levelValue: '7',
        resolution: 0.010986328125,
        scale: 4617149.8915429693,
      },
      {
        level: 7,
        levelValue: '8',
        resolution: 0.0054931640625,
        scale: 2308574.9457714846,
      },
      {
        level: 8,
        levelValue: '9',
        resolution: 0.00274658203125,
        scale: 1154287.4728857423,
      },
      {
        level: 9,
        levelValue: '10',
        resolution: 0.001373291015625,
        scale: 577143.73644287116,
      },
      {
        level: 10,
        levelValue: '11',
        resolution: 0.0006866455078125,
        scale: 288571.86822143558,
      },
      {
        level: 11,
        levelValue: '12',
        resolution: 0.00034332275390625,
        scale: 144285.93411071779,
      },
      {
        level: 12,
        levelValue: '13',
        resolution: 0.000171661376953125,
        scale: 72142.967055358895,
      },
      {
        level: 13,
        levelValue: '14',
        resolution: 8.58306884765625e-5,
        scale: 36071.483527679447,
      },
      {
        level: 14,
        levelValue: '15',
        resolution: 4.291534423828125e-5,
        scale: 18035.741763839724,
      },
      {
        level: 15,
        levelValue: '16',
        resolution: 2.1457672119140625e-5,
        scale: 9017.8708819198619,
      },
      {
        level: 16,
        levelValue: '17',
        resolution: 1.0728836059570313e-5,
        scale: 4508.9354409599309,
      },
      {
        level: 17,
        levelValue: '18',
        resolution: 5.3644180297851563e-6,
        scale: 2254.4677204799655,
      },
      {
        level: 18,
        levelValue: '19',
        resolution: 2.68220901489257815e-6,
        scale: 1127.23386023998275,
      },
      {
        level: 19,
        levelValue: '20',
        resolution: 1.341104507446289075e-6,
        scale: 563.616930119991375,
      },
    ],
  },
  imageNotes: {
    name: "202112141154250",
    displayName: "2000厦门影像图注记",
    type: 'WebTile',
    layerType: 8,
    opacity: 100,
    spatialReference: {
      wkid: 4490,
    },
    serviceUrl:
        "https://gisapp.xmghszzx.com:8030/gisProxy25/rest/services/CGCS2000/DOMMAP_CIA/MapServer/tile/{level}/{row}/{col}",
    formal:"https://gisapp.xmghszzx.com:8030/gisProxy25/rest/services/CGCS2000/DOMMAP_CIA/MapServer/tile/{level}/{row}/{col}",
    visible: false,
    id: "3a00c941-4bf6-f2be-6978-ff309acac665444",
    lods: [
      {
        level: 0,
        levelValue: '1',
        resolution: 0.703125,
        scale: 295497593.05875003,
      },
      {
        level: 1,
        levelValue: '2',
        resolution: 0.3515625,
        scale: 147748796.52937502,
      },
      {
        level: 2,
        levelValue: '3',
        resolution: 0.17578125,
        scale: 73874398.264687508,
      },
      {
        level: 3,
        levelValue: '4',
        resolution: 0.087890625,
        scale: 36937199.132343754,
      },
      {
        level: 4,
        levelValue: '5',
        resolution: 0.0439453125,
        scale: 18468599.566171877,
      },
      {
        level: 5,
        levelValue: '6',
        resolution: 0.02197265625,
        scale: 9234299.7830859385,
      },
      {
        level: 6,
        levelValue: '7',
        resolution: 0.010986328125,
        scale: 4617149.8915429693,
      },
      {
        level: 7,
        levelValue: '8',
        resolution: 0.0054931640625,
        scale: 2308574.9457714846,
      },
      {
        level: 8,
        levelValue: '9',
        resolution: 0.00274658203125,
        scale: 1154287.4728857423,
      },
      {
        level: 9,
        levelValue: '10',
        resolution: 0.001373291015625,
        scale: 577143.73644287116,
      },
      {
        level: 10,
        levelValue: '11',
        resolution: 0.0006866455078125,
        scale: 288571.86822143558,
      },
      {
        level: 11,
        levelValue: '12',
        resolution: 0.00034332275390625,
        scale: 144285.93411071779,
      },
      {
        level: 12,
        levelValue: '13',
        resolution: 0.000171661376953125,
        scale: 72142.967055358895,
      },
      {
        level: 13,
        levelValue: '14',
        resolution: 8.58306884765625e-5,
        scale: 36071.483527679447,
      },
      {
        level: 14,
        levelValue: '15',
        resolution: 4.291534423828125e-5,
        scale: 18035.741763839724,
      },
      {
        level: 15,
        levelValue: '16',
        resolution: 2.1457672119140625e-5,
        scale: 9017.8708819198619,
      },
      {
        level: 16,
        levelValue: '17',
        resolution: 1.0728836059570313e-5,
        scale: 4508.9354409599309,
      },
      {
        level: 17,
        levelValue: '18',
        resolution: 5.3644180297851563e-6,
        scale: 2254.4677204799655,
      },
      {
        level: 18,
        levelValue: '19',
        resolution: 2.68220901489257815e-6,
        scale: 1127.23386023998275,
      },
      {
        level: 19,
        levelValue: '20',
        resolution: 1.341104507446289075e-6,
        scale: 563.616930119991375,
      },
    ],
  },
}
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
