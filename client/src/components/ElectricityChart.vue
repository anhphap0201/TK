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
          backgroundColor: '#171717',
          borderColor: '#171717',
          borderWidth: 1,
          borderRadius: 2,
          yAxisID: 'yKwh',
          order: 2,
        },
        {
          label: 'Tổng tiền (VNĐ)',
          data: costValues,
          type: 'line',
          borderColor: '#B45309',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointBackgroundColor: '#B45309',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 1.5,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.1,
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
          align: 'end',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: { family: 'Geist, sans-serif', size: 11, weight: '500' },
            color: '#737373',
            usePointStyle: false,
          },
        },
        tooltip: {
          backgroundColor: '#171717',
          titleColor: '#FFFFFF',
          bodyColor: '#A3A3A3',
          padding: 8,
          cornerRadius: 4,
          titleFont: { family: 'Geist, sans-serif', size: 12, weight: '600' },
          bodyFont: { family: 'JetBrains Mono, monospace', size: 11 },
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
          ticks: { font: { family: 'JetBrains Mono, monospace', size: 10 }, color: '#737373' },
          border: { color: '#EAEAEA' },
        },
        yKwh: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Điện năng (kWh)',
            font: { family: 'Geist, sans-serif', size: 10, weight: '500' },
            color: '#737373',
          },
          grid: { color: '#F0F0F0' },
          ticks: {
            callback: (val) => `${val}`,
            font: { family: 'JetBrains Mono, monospace', size: 10 },
            color: '#737373',
          },
          border: { dash: [4, 4], color: '#EAEAEA' },
        },
        yCost: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Số tiền (VNĐ)',
            font: { family: 'Geist, sans-serif', size: 10, weight: '500' },
            color: '#737373',
          },
          grid: { drawOnChartArea: false },
          ticks: {
            callback: (val) => `${(val / 1000).toLocaleString('vi-VN')}k`,
            font: { family: 'JetBrains Mono, monospace', size: 10 },
            color: '#737373',
          },
          border: { color: '#EAEAEA' },
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
  <div class="w-full h-72 relative">
    <div v-if="!monthlyData || monthlyData.length === 0" class="h-full flex items-center justify-center text-[#A3A3A3] text-xs">
      Chưa có đủ dữ liệu theo tháng để vẽ biểu đồ
    </div>
    <canvas v-show="monthlyData && monthlyData.length > 0" ref="canvasRef"></canvas>
  </div>
</template>
