<script>
// 全局数据
const demoTableFields = [
  {
    label: 'ID',
    prop: 'id',
    show: false
  },
  {
    label: '姓名',
    prop: 'name',
    show: true
  },
  {
    label: '所属部门',
    prop: 'department',
    show: true
  },
  {
    label: '状态',
    prop: 'state_desc',
    show: true
  },
  {
    label: '创建时间',
    prop: 'create_time',
    show: true
  }
];

const demoChooseOptions = [
  {
    label: 'ID',
    type: 'input',
    prop: 'id'
  },
  {
    label: '状态',
    prop: 'state',
    type: 'select',
    options: [
      {
        value: 1,
        label: '正常'
      },
      {
        value: 2,
        label: '封禁'
      },
      {
        value: 3,
        label: '离职'
      }
    ]
  },
  {
    label: '创建时间',
    type: 'date',
    prop: 'time'
  },
  {
    label: '范围',
    type: 'input',
    prop1: 'time1',
    prop2: 'time2',
    range: true
  }
];

const demoEditOptions = [
  {
    label: '状态',
    prop: 'state',
    type: 'select',
    options: [
      {
        value: 1,
        label: '正常'
      },
      {
        value: 2,
        label: '封禁'
      },
      {
        value: 3,
        label: '离职'
      }
    ]
  }
];

const demoEditRules = {
  state: [
    {
      required: true,
      message: '请选择'
    }
  ]
};

export default {
  demoEditRules,
  demoTableFields,
  demoEditOptions,
  demoChooseOptions
};
</script>
