<template>
  <div ref="chart" class="area-plot-content" />
</template>

<script>
import _ from 'lodash';
import utils from '../utils';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themesAnimated);

const THRESHOLD = 7;

export default {
  name: 'AreaPlot',
  props: {
    data: Array,
  },
  data() {
    return {
      chart: null,
    };
  },
  beforeUnmount() {
    if (this.chart) this.chart.dispose();
  },
  mounted() {
    if (!this.chart) {
      const chart = am4core.create(this.$refs.chart, am4charts.XYChart);
      ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'].forEach(
        (i) => (chart[i] = 0), // eslint-disable-line no-return-assign
      );
      chart.data = this.data;
      chart.zoomOutButton.disabled = true;
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.disabled = true;
      dateAxis.renderer.labels.template.disabled = true;
      if (this.data.length > 1) {
        dateAxis.keepSelection = true;
        dateAxis.start = this.data.length > THRESHOLD ? 0.05 : 0.2;
        dateAxis.end = this.data.length > THRESHOLD ? 0.95 : 0.8;
      }
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.disabled = true;
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = 'created_at';
      series.dataFields.valueY = 'count';
      series.tensionX = 0.77;
      series.strokeWidth = 3;
      series.fillOpacity = 0.5;
      series.stroke = am4core.color('#000');
      series.fill = am4core.color('#000');
      series.tooltipText = '{valueY.value}';
      utils.hideLicenseFromChart(this.$refs.chart);
      this.chart = chart;
    }
  },
};
</script>

<style scoped lang='scss'>
.area-plot-content {
  width: 100%;
  height: 100%;
}
</style>
