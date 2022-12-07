<script>
// 物流列表筛选条件表单项
const logisticsChooseOptions = [
  {
    label: '运单号',
    type: 'input',
    prop: 'waybill_no'
  },
  {
    label: '订单号',
    type: 'remote',
    prop: 'order_id'
  },
  {
    label: '物流商',
    type: 'select',
    multiple: true,
    prop: 'logistic_supplier_id',
    options: []
  },
  {
    label: '海外仓',
    type: 'select',
    multiple: true,
    prop: 'oversea_location_id',
    options: []
  },
  {
    label: '仓库分布',
    type: 'select',
    multiple: true,
    prop: 'warehouse_area_id',
    options: []
  },
  {
    label: '仓库',
    type: 'select',
    multiple: true,
    prop: 'warehouse_id',
    options: []
  },
  {
    label: '平台',
    type: 'select',
    multiple: true,
    prop: 'platform_id',
    options: []
  },
  {
    label: '店铺',
    type: 'select',
    multiple: true,
    prop: 'shop_id',
    options: []
  },
  {
    label: 'SKU',
    type: 'remote',
    prop: 'sku_id'
  },
  {
    label: '标签',
    type: 'select',
    multiple: true,
    prop: 'label_id',
    options: []
  },
  {
    label: '包裹类型',
    type: 'select',
    multiple: false,
    prop: 'label_id',
    options: []
  },
  {
    label: '异常处理情况',
    type: 'select',
    multiple: false,
    prop: 'exception_handing',
    options: []
  },
  {
    label: '发货时间',
    type: 'date',
    prop: 'shipping_time'
  },
  {
    label: '创建时间',
    type: 'date',
    prop: 'create_time'
  },
  {
    label: '最新轨迹停留时长(天)',
    type: 'input',
    prop1: 'start_event_day',
    prop2: 'end_event_day',
    range: true
  }
];

// 物流列表中的运单
const logisticsTableFields = [
  {
    label: 'ID',
    prop: 'id',
    width: '100px',
    show: true
  },
  {
    label: '运单号',
    prop: 'waybill_no',
    show: true
  },
  {
    label: '物流商',
    prop: 'logistic_supplier',
    show: true
  },
  {
    label: '仓库',
    prop: 'warehouse',
    show: true
  },
  {
    label: '包裹类型',
    prop: 'parcel_type_desc',
    show: true
  },
  {
    label: '标签',
    prop: 'label',
    show: true
  },
  {
    label: '订单号',
    prop: 'order_no',
    show: true
  },
  {
    label: 'SKU',
    prop: 'sku',
    show: true
  },
  {
    label: '发货时间',
    prop: 'shipping_time',
    show: true
  },
  {
    label: '首枪时效',
    prop: 'receipt_days',
    show: true
  },
  {
    label: '送达时效',
    prop: 'delivery_days',
    show: true
  },
  {
    label: '最新轨迹停留时长',
    prop: 'stay_time',
    show: true
  },
  {
    label: '异常处理情况',
    prop: 'exception_handling_desc',
    show: true
  },
  {
    label: '运输子状态',
    prop: 'transit_sub_state_desc',
    width: '300px',
    show: true
  },
  {
    label: '最新轨迹地址',
    prop: 'current_event_address',
    show: true
  },
  {
    label: '最新轨迹时间',
    prop: 'current_event_time',
    show: true
  },
  {
    label: '最新轨迹详情',
    prop: 'current_event_detail',
    width: '300px',
    show: true
  },
  {
    label: '获取状态',
    prop: 'sync_state_desc',
    show: true
  },
  {
    label: '获取时间',
    prop: 'sync_time',
    show: true
  },
  {
    label: '创建人',
    prop: 'creator',
    show: true
  },
  {
    label: '创建时间',
    prop: 'create_time',
    show: true
  },
  {
    label: '备注',
    prop: 'remark',
    show: true
  },
  {
    label: '运输状态',
    prop: 'transit_state_desc',
    show: true
  }
];

// 运输状态
const transitState = [
  {
    key: '',
    label: '全部',
    name: 'all'
  },
  {
    key: 0,
    label: '待查询',
    name: 'unqueried'
  },
  {
    key: 10,
    label: '暂无信息',
    name: 'no_record'
  },
  {
    key: 20,
    label: '已接收',
    name: 'received'
  },
  {
    key: 30,
    label: '运输中',
    name: 'in_transit'
  },
  {
    key: 40,
    label: '派送中',
    name: 'delivering'
  },
  {
    key: 50,
    label: '投递失败',
    name: 'delivery_failed'
  },
  {
    key: 60,
    label: '异常',
    name: 'abnormal'
  },
  {
    key: 70,
    label: '已签收',
    name: 'delivered'
  },
  {
    key: 80,
    label: '已过期',
    name: 'expired'
  }
];

export default {
  transitState,
  logisticsTableFields,
  logisticsChooseOptions
};
</script>
