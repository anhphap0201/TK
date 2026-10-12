<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import {
  Chart,
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  monthlyData: {
    type: Array,
    default: () => [],
  },
});

const canvasRef = ref(null);
let chartInstance = null;

function renderChart() {
  if (!canvasRef.value) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  if (!props.monthlyData || props.monthlyData.length === 0) return;

  const labels = props.monthlyData.map((d) => d.period);
  const kwhValues = props.monthlyData.map((d) => d.total_kwh);
  const costValues = props.monthlyData.map((d) => d.total_amount);

  const ctx = canvasRef.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Sản lượng (kWh)',
          data: kwhValues,
          backgroundColor: 'rgba(0, 153, 255, 0.75)',
          borderColor: '#0099ff',
          borderWidth: 1.5,
          borderRadius: 6,
          yAxisID: 'yKwh',
          order: 2,
        },
        {
          label: 'Tổng tiền (VNĐ)',
          data: costValues,
          type: 'line',
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          borderWidth: 2.5,
          pointBackgroundColor: '#f59e0b',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
          yAxisID: 'yCost',
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 14,
            font: { family: 'inherit', size: 12, weight: '500' },
          },
        },
        tooltip: {
          padding: 10,
          callbacks: {
            label(context) {
              const label = context.dataset.label || '';
              const val = context.raw || 0;
              if (context.datasetIndex === 0) {
                return `${label}: ${new Intl.NumberFormat('vi-VN').format(val)} kWh`;
              }
              return `${label}: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'inherit', size: 11 } },
        },
        yKwh: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Điện năng (kWh)',
            font: { size: 11, weight: '600' },
          },
          grid: { color: 'rgba(226, 232, 240, 0.8)' },
          ticks: {
            callback: (val) => `${val} kWh`,
            font: { size: 11 },
          },
        },
        yCost: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Số tiền (VNĐ)',
            font: { size: 11, weight: '600' },
          },
          grid: { drawOnChartArea: false },
          ticks: {
            callback: (val) => `${(val / 1000).toLocaleString('vi-VN')}k`,
            font: { size: 11 },
          },
        },
      },
    },
  });
}

onMounted(() => {
  renderChart();
});

watch(() => props.monthlyData, () => {
  renderChart();
}, { deep: true });

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<template>
  <div class="w-full h-80 relative">
    <div v-if="!monthlyData || monthlyData.length === 0" class="h-full flex items-center justify-center text-slate-400 text-sm">
      Chưa có đủ dữ liệu theo tháng để vẽ biểu đồ
    </div>
    <canvas v-show="monthlyData && monthlyData.length > 0" ref="canvasRef"></canvas>
  </div>
</template>
