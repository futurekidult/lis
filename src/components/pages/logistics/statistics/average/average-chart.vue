<template>
  <el-scrollbar>
    <div
      v-loading="$store.state.statistics.averageLoading"
      class="chart-layout"
    >
      <section
        v-for="(item, index) in $store.state.statistics.averageStatistics"
        :key="index"
        style="margin-left: 20px"
      >
        <div
          :id="`chart${index + 1}`"
          class="chart"
        />
        <div>{{ item.table.name }}</div>
        <el-scrollbar style="height: auto !important">
          <average-table :list="item.table.data" />
        </el-scrollbar>
      </section>
    </div>
  </el-scrollbar>
</template>

<script>
import * as echarts from 'echarts';
import { markRaw } from 'vue';
import AverageTable from './average-table.vue';
export default {
  components: {
    AverageTable
  },
  props: {
    data: {
      type: Array,
      default: null
    },
    headers: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      chart: {},
      option: {
        title: {},
        tooltip: {},
        xAxis: {},
        legend: {},
        dataZoom: [],
        yAxis: {},
        series: []
      }
    };
  },
  mounted() {
    let data = this.$store.state.statistics.averageStatistics;
    // 初始化echarts实例
    for (let i = 1; i <= data.length; i++) {
      this.chart[i] = markRaw(
        echarts.init(document.getElementById(`chart${i}`))
      );
      this.option[i] = {
        title: {},
        tooltip: {
          // 触发类型
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            // 坐标轴指示器的文本标签
            label: {
              backgroundColor: '#C0392B'
            }
          },
          // 提示框浮层内容格式器
          formatter: '{b0}: {c0}%'
        },
        xAxis: {},
        legend: {
          icon: 'rect'
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        yAxis: {
          type: 'value',
          axisTick: {
            //y轴刻度线
            show: false
          },
          splitLine: {
            //网格线
            show: false
          },
          axisLabel: {
            formatter: '{value}%'
          },
          min: (val) => {
            return Math.floor(val.min);
          },
          max: 100
        },
        series: []
      };
      this.option[i].title.text = data[i - 1].chart.name;
      let nameList = this.$global.rate;
      let positionList = data[i - 1].chart.data.map((item) => {
        return item;
      });
      this.option[i].legend.data = nameList;
      this.option[i].xAxis.data = data[i - 1].chart.date;
      for (let index in nameList) {
        this.option[i].series.push({
          name: nameList[index],
          type: 'line',
          data: positionList[index]
        });
      }
      this.chart[i].setOption(this.option[i]);
    }
  },
  methods: {}
};
</script>

<style scoped>
.chart-layout {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}
.chart {
  height: 400px;
  width: 800px;
}
table {
  border-collapse: collapse;
  border: 1px #edeef5 solid;
  width: 100%;
  margin-top: 20px;
  font-family: 'Times New Roman', Times, serif;
  height: 100%;
  overflow: hidden;
}
table > tr {
  color: #909399;
  text-align: center;
}
th,
td {
  border: 1px #edeef5 solid;
  font-size: 14px;
  line-height: 30px;
  padding: 0 12px;
  color: #606266;
}
tbody tr > td:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
}
</style>
