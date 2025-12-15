import * as echarts from 'echarts/core';
import { BarChart, PieChart, HeatmapChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  CalendarComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register the required components
echarts.use([
  BarChart,
  PieChart,
  HeatmapChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  CalendarComponent,
  CanvasRenderer
]);

export default echarts;
export type { EChartsOption } from 'echarts';
