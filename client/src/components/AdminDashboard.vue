<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import {
  Chart,
  BarController,
  LineController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Eye,
  X,
  CreditCard,
  PieChart as PieIcon,
  BarChart3,
  ExternalLink,
  Search,
} from 'lucide-vue-next';
import { api, formatVND, formatNumber } from '../api';

Chart.register(
  BarController,
  LineController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const emit = defineEmits(['inspect-customer']);

const searchCustomerCode = ref('');
function handleDirectCustomerLookup() {
  const code = searchCustomerCode.value.trim().toUpperCase();
  if (!code) return;
  emit('inspect-customer', code);
}

const loading = ref(false);
const errorMsg = ref('');
const statsData = ref(null);
const selectedYear = ref('ALL');

// Chế độ xem biểu đồ xu hướng (all, kwh, revenue)
const trendMode = ref('all');

// Drill-down chi tiết kỳ
const selectedPeriod = ref(null);
const periodDetail = ref(null);
const loadingPeriodDetail = ref(false);
const showPeriodModal = ref(false);

// Refs cho canvas biểu đồ
const trendCanvasRef = ref(null);
const growthCanvasRef = ref(null);
const tierCanvasRef = ref(null);
const debtCanvasRef = ref(null);

let trendChartInstance = null;
let growthChartInstance = null;
let tierChartInstance = null;
let debtChartInstance = null;

async function fetchStats(year = selectedYear.value) {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await api.getDashboardStats(year === 'ALL' ? null : year);
    statsData.value = res;
    if (year === 'ALL' && res.years && res.years.length > 0) {
      // Giữ 'ALL' hoặc lấy theo res
    }
    await nextTick();
    renderAllCharts();
  } catch (err) {
    errorMsg.value = err.message || 'Lỗi khi tải dữ liệu thống kê';
  } finally {
    loading.value = false;
  }
}

function selectYear(yr) {
  selectedYear.value = yr;
  fetchStats(yr);
}

// Lấy chi tiết kỳ cụ thể
async function openPeriodDetail(period) {
  selectedPeriod.value = period;
  showPeriodModal.value = true;
  loadingPeriodDetail.value = true;
  try {
    const res = await api.getPeriodDetail(period);
    periodDetail.value = res;
  } catch (err) {
    alert(err.message || 'Không thể tải chi tiết kỳ');
    showPeriodModal.value = false;
  } finally {
    loadingPeriodDetail.value = false;
  }
}

// 1. Biểu đồ Xu Hướng: Sản Lượng & Doanh Thu
function renderTrendChart() {
  if (!trendCanvasRef.value || !statsData.value) return;
  if (trendChartInstance) {
    trendChartInstance.destroy();
    trendChartInstance = null;
  }

  const monthly = statsData.value.monthly || [];
  if (monthly.length === 0) return;

  const labels = monthly.map((m) => m.period);
  const kwhData = monthly.map((m) => m.total_kwh);
  const revData = monthly.map((m) => m.total_amount);

  const datasets = [];

  if (trendMode.value === 'all' || trendMode.value === 'kwh') {
    datasets.push({
      label: 'Sản lượng tiêu thụ (kWh)',
      data: kwhData,
      type: 'bar',
      backgroundColor: '#171717',
      borderColor: '#171717',
      borderWidth: 1,
      borderRadius: 2,
      yAxisID: 'yKwh',
      order: 2,
    });
  }

  if (trendMode.value === 'all' || trendMode.value === 'revenue') {
    datasets.push({
      label: 'Doanh thu phát hành (VNĐ)',
      data: revData,
      type: 'line',
      borderColor: '#B45309',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointBackgroundColor: '#B45309',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 1.5,
      pointRadius: 3,
      pointHoverRadius: 6,
      tension: 0.1,
      yAxisID: 'yCost',
      order: 1,
    });
  }

  const ctx = trendCanvasRef.value.getContext('2d');
  trendChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      onClick: (evt, elements) => {
        if (elements && elements.length > 0) {
          const index = elements[0].index;
          const clickedPeriod = labels[index];
          if (clickedPeriod) {
            openPeriodDetail(clickedPeriod);
          }
        }
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
              if (context.dataset.yAxisID === 'yKwh') {
                return `${label}: ${new Intl.NumberFormat('vi-VN').format(val)} kWh`;
              }
              return `${label}: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)}`;
            },
            afterBody(items) {
              if (items && items[0]) {
                const idx = items[0].dataIndex;
                const m = monthly[idx];
                if (m) {
                  return [
                    `Tỷ lệ thu cước: ${m.collection_rate}%`,
                    `Đã thu: ${formatVND(m.paid_amount)}`,
                    `Nợ đọng: ${formatVND(m.unpaid_amount)}`,
                    `Nhấp chuột để xem chi tiết kỳ này ↗`,
                  ];
                }
              }
              return [];
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
          display: trendMode.value === 'all' || trendMode.value === 'kwh',
          position: 'left',
          title: {
            display: true,
            text: 'Sản lượng (kWh)',
            font: { family: 'Geist, sans-serif', size: 10, weight: '500' },
            color: '#737373',
          },
          grid: { color: '#F0F0F0' },
          ticks: {
            callback: (val) => `${(val / 1000).toLocaleString('vi-VN')}k`,
            font: { family: 'JetBrains Mono, monospace', size: 10 },
            color: '#737373',
          },
          border: { dash: [4, 4], color: '#EAEAEA' },
        },
        yCost: {
          type: 'linear',
          display: trendMode.value === 'all' || trendMode.value === 'revenue',
          position: 'right',
          title: {
            display: true,
            text: 'Doanh thu (VNĐ)',
            font: { family: 'Geist, sans-serif', size: 10, weight: '500' },
            color: '#737373',
          },
          grid: { drawOnChartArea: false },
          ticks: {
            callback: (val) => `${(val / 1000000).toLocaleString('vi-VN')}Tr`,
            font: { family: 'JetBrains Mono, monospace', size: 10 },
            color: '#737373',
          },
          border: { color: '#EAEAEA' },
        },
      },
    },
  });
}

// 2. Biểu đồ Tăng trưởng MoM (%)
function renderGrowthChart() {
  if (!growthCanvasRef.value || !statsData.value) return;
  if (growthChartInstance) {
    growthChartInstance.destroy();
    growthChartInstance = null;
  }

  const monthly = statsData.value.monthly || [];
  if (monthly.length === 0) return;

  const labels = monthly.map((m) => m.period);
  const kwhGrowth = monthly.map((m) => m.kwh_growth_pct);
  const revGrowth = monthly.map((m) => m.revenue_growth_pct);

  const ctx = growthCanvasRef.value.getContext('2d');
  growthChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Tăng trưởng kWh (%)',
          data: kwhGrowth,
          backgroundColor: kwhGrowth.map((v) => (v >= 0 ? '#171717' : '#737373')),
          borderRadius: 2,
        },
        {
          label: 'Tăng trưởng Doanh thu (%)',
          data: revGrowth,
          backgroundColor: revGrowth.map((v) => (v >= 0 ? '#B45309' : '#D97706')),
          borderRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: { family: 'Geist, sans-serif', size: 11, weight: '500' },
            color: '#737373',
          },
        },
        tooltip: {
          backgroundColor: '#171717',
          padding: 8,
          cornerRadius: 4,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw > 0 ? '+' : ''}${ctx.raw}%`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'JetBrains Mono, monospace', size: 10 }, color: '#737373' },
          border: { color: '#EAEAEA' },
        },
        y: {
          grid: { color: '#F0F0F0' },
          ticks: {
            callback: (val) => `${val}%`,
            font: { family: 'JetBrains Mono, monospace', size: 10 },
            color: '#737373',
          },
          border: { dash: [4, 4], color: '#EAEAEA' },
        },
      },
    },
  });
}

// 3. Biểu đồ Cơ Cấu 6 Bậc Thang EVN (Doughnut)
function renderTierChart() {
  if (!tierCanvasRef.value || !statsData.value) return;
  if (tierChartInstance) {
    tierChartInstance.destroy();
    tierChartInstance = null;
  }

  const tiers = statsData.value.overall_tiers;
  if (!tiers || !tiers.kwh) return;

  const labels = ['Bậc 1 (0-50)', 'Bậc 2 (51-100)', 'Bậc 3 (101-200)', 'Bậc 4 (201-300)', 'Bậc 5 (301-400)', 'Bậc 6 (>400)'];
  const data = tiers.kwh;

  const colors = [
    '#245E2A', // Xanh đậm Bậc 1
    '#1E4E8C', // Xanh lam Bậc 2
    '#0284C7', // Xanh ngọc Bậc 3
    '#D97706', // Vàng cam Bậc 4
    '#EA580C', // Cam Bậc 5
    '#DC2626', // Đỏ Bậc 6
  ];

  const ctx = tierCanvasRef.value.getContext('2d');
  tierChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 1,
          borderColor: '#FFFFFF',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: { family: 'Geist, sans-serif', size: 11 },
            color: '#737373',
            padding: 10,
          },
        },
        tooltip: {
          backgroundColor: '#171717',
          padding: 8,
          cornerRadius: 4,
          callbacks: {
            label(ctx) {
              const val = ctx.raw || 0;
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = total ? ((val / total) * 100).toFixed(1) : 0;
              return `${ctx.label}: ${new Intl.NumberFormat('vi-VN').format(val)} kWh (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

// 4. Biểu đồ Công Nợ: Đã thu vs Nợ đọng (Stacked Bar)
function renderDebtChart() {
  if (!debtCanvasRef.value || !statsData.value) return;
  if (debtChartInstance) {
    debtChartInstance.destroy();
    debtChartInstance = null;
  }

  const monthly = statsData.value.monthly || [];
  if (monthly.length === 0) return;

  const labels = monthly.map((m) => m.period);
  const paidAmounts = monthly.map((m) => m.paid_amount);
  const unpaidAmounts = monthly.map((m) => m.unpaid_amount);

  const ctx = debtCanvasRef.value.getContext('2d');
  debtChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Đã thanh toán (VNĐ)',
          data: paidAmounts,
          backgroundColor: '#245E2A',
          stack: 'stack1',
          borderRadius: 2,
        },
        {
          label: 'Nợ đọng cước (VNĐ)',
          data: unpaidAmounts,
          backgroundColor: '#D97706',
          stack: 'stack1',
          borderRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: { family: 'Geist, sans-serif', size: 11, weight: '500' },
            color: '#737373',
          },
        },
        tooltip: {
          backgroundColor: '#171717',
          padding: 8,
          cornerRadius: 4,
          callbacks: {
            label(ctx) {
              return `${ctx.dataset.label}: ${formatVND(ctx.raw)}`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { font: { family: 'JetBrains Mono, monospace', size: 10 }, color: '#737373' },
          border: { color: '#EAEAEA' },
        },
        y: {
          stacked: true,
          grid: { color: '#F0F0F0' },
          ticks: {
            callback: (val) => `${(val / 1000000).toLocaleString('vi-VN')}Tr`,
            font: { family: 'JetBrains Mono, monospace', size: 10 },
            color: '#737373',
          },
          border: { dash: [4, 4], color: '#EAEAEA' },
        },
      },
    },
  });
}

function renderAllCharts() {
  renderTrendChart();
  renderGrowthChart();
  renderTierChart();
  renderDebtChart();
}

watch(trendMode, () => {
  renderTrendChart();
});

onMounted(() => {
  fetchStats('ALL');
});

onBeforeUnmount(() => {
  if (trendChartInstance) trendChartInstance.destroy();
  if (growthChartInstance) growthChartInstance.destroy();
  if (tierChartInstance) tierChartInstance.destroy();
  if (debtChartInstance) debtChartInstance.destroy();
});
</script>

<template>
  <div class="space-y-5">
    <!-- Header Bộ Lọc & Điều Hành -->
    <div class="bg-white rounded-lg border border-[#EAEAEA] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-base font-semibold text-[#171717] tracking-tight">
            Dashboard Điều Hành & Giám Sát Điện Lực
          </h2>
          <span class="px-2 py-0.5 rounded bg-[#F5F5F5] text-[#171717] font-mono text-[11px] border border-[#EAEAEA]">
            EVN Analytics
          </span>
        </div>
        <p class="text-xs text-[#737373] mt-0.5">
          Giám sát sản lượng tiêu thụ, doanh thu cước, tỷ lệ thu hồi và phụ tải bậc thang
        </p>
      </div>

      <!-- Bộ chọn năm & Refresh -->
      <div class="flex items-center gap-2 flex-wrap">
        <div class="flex items-center gap-1 bg-[#FAFAFA] p-1 rounded-md border border-[#EAEAEA]">
          <button
            @click="selectYear('ALL')"
            :class="selectedYear === 'ALL' ? 'bg-[#171717] text-white font-medium' : 'text-[#737373] hover:text-[#171717]'"
            class="px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
          >
            Tất cả
          </button>
          <button
            v-for="yr in statsData?.years || []"
            :key="yr"
            @click="selectYear(yr)"
            :class="selectedYear === yr ? 'bg-[#171717] text-white font-medium' : 'text-[#737373] hover:text-[#171717]'"
            class="px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer"
          >
            {{ yr }}
          </button>
        </div>

        <button
          @click="fetchStats(selectedYear)"
          :disabled="loading"
          class="p-2 rounded-md border border-[#EAEAEA] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] transition-colors cursor-pointer disabled:opacity-50"
          title="Tải lại dữ liệu"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Thanh Tra Cứu & Xem Hồ Sơ Từng Cá Nhân (Dành cho Admin) -->
    <div class="bg-white rounded-lg border border-[#EAEAEA] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-md bg-[#F5F5F5] text-[#171717] flex items-center justify-center border border-[#EAEAEA] shrink-0">
          <Users class="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h3 class="font-semibold text-[#171717] text-xs">Phân Tích Chi Tiết Từng Cá Nhân</h3>
          <p class="text-[11px] text-[#737373]">Xem hồ sơ dùng điện, biểu đồ tiêu thụ 2022-2026 và hóa đơn từng tháng của từng hộ</p>
        </div>
      </div>

      <form @submit.prevent="handleDirectCustomerLookup" class="flex items-center gap-2 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <input
            v-model="searchCustomerCode"
            type="text"
            placeholder="Nhập Mã KH (VD: KH0001, KH0015)..."
            class="w-full pl-8 pr-3 py-1.5 rounded-md border border-[#EAEAEA] text-xs font-mono bg-white uppercase text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#171717] focus:outline-none"
          />
          <Search class="w-3.5 h-3.5 text-[#A3A3A3] absolute left-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
        </div>
        <button
          type="submit"
          class="px-3 py-1.5 rounded-md bg-[#171717] hover:bg-[#262626] text-white text-xs font-medium shrink-0 transition-colors cursor-pointer"
        >
          Xem cá nhân
        </button>
      </form>
    </div>

    <!-- Thông báo lỗi nếu có -->
    <div
      v-if="errorMsg"
      role="alert"
      class="p-3 bg-[#FDEBEC] border border-[#F8D0D0] text-[#9F2F2D] text-xs rounded-lg flex items-center gap-2"
    >
      <AlertCircle class="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{{ errorMsg }}</span>
    </div>

    <!-- Bento KPIs Ngành Điện (5 thẻ thông số quan trọng) -->
    <div v-if="statsData" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <!-- KPI 1: Tổng sản lượng điện -->
      <div class="bg-white rounded-lg border border-[#EAEAEA] p-4 space-y-1">
        <div class="flex items-center justify-between text-[#737373]">
          <span class="text-[11px] font-medium uppercase tracking-wider">Tổng sản lượng</span>
          <Zap class="w-4 h-4 text-[#171717]" aria-hidden="true" />
        </div>
        <div class="text-xl font-bold font-mono text-[#171717] tabular-nums">
          {{ formatNumber(statsData.summary.total_kwh) }}
          <span class="text-xs font-normal text-[#737373]">kWh</span>
        </div>
        <div class="flex items-center gap-1 text-[11px] pt-0.5">
          <span
            :class="statsData.summary.latest_kwh_growth >= 0 ? 'text-[#245E2A]' : 'text-[#9F2F2D]'"
            class="font-mono font-medium inline-flex items-center gap-0.5"
          >
            <component
              :is="statsData.summary.latest_kwh_growth >= 0 ? TrendingUp : TrendingDown"
              class="w-3 h-3"
              aria-hidden="true"
            />
            {{ statsData.summary.latest_kwh_growth > 0 ? '+' : '' }}{{ statsData.summary.latest_kwh_growth }}%
          </span>
          <span class="text-[#A3A3A3]">kỳ gần nhất</span>
        </div>
      </div>

      <!-- KPI 2: Tổng doanh thu cước -->
      <div class="bg-white rounded-lg border border-[#EAEAEA] p-4 space-y-1">
        <div class="flex items-center justify-between text-[#737373]">
          <span class="text-[11px] font-medium uppercase tracking-wider">Tổng doanh thu</span>
          <DollarSign class="w-4 h-4 text-[#B45309]" aria-hidden="true" />
        </div>
        <div class="text-xl font-bold font-mono text-[#171717] tabular-nums">
          {{ formatVND(statsData.summary.total_revenue) }}
        </div>
        <div class="flex items-center gap-1 text-[11px] pt-0.5">
          <span
            :class="statsData.summary.latest_revenue_growth >= 0 ? 'text-[#245E2A]' : 'text-[#9F2F2D]'"
            class="font-mono font-medium inline-flex items-center gap-0.5"
          >
            <component
              :is="statsData.summary.latest_revenue_growth >= 0 ? TrendingUp : TrendingDown"
              class="w-3 h-3"
              aria-hidden="true"
            />
            {{ statsData.summary.latest_revenue_growth > 0 ? '+' : '' }}{{ statsData.summary.latest_revenue_growth }}%
          </span>
          <span class="text-[#A3A3A3]">MoM</span>
        </div>
      </div>

      <!-- KPI 3: Tỷ lệ thu hồi cước -->
      <div class="bg-white rounded-lg border border-[#EAEAEA] p-4 space-y-1">
        <div class="flex items-center justify-between text-[#737373]">
          <span class="text-[11px] font-medium uppercase tracking-wider">Tỷ lệ thu cước</span>
          <CheckCircle2 class="w-4 h-4 text-[#245E2A]" aria-hidden="true" />
        </div>
        <div class="text-xl font-bold font-mono text-[#245E2A] tabular-nums">
          {{ statsData.summary.collection_rate }}%
        </div>
        <p class="text-[11px] text-[#737373] truncate" :title="`Đã thu: ${formatVND(statsData.summary.total_paid)}`">
          Đã thu: <span class="font-mono text-[#171717] font-medium">{{ formatVND(statsData.summary.total_paid) }}</span>
        </p>
      </div>

      <!-- KPI 4: Nợ đọng cước -->
      <div class="bg-white rounded-lg border border-[#EAEAEA] p-4 space-y-1">
        <div class="flex items-center justify-between text-[#737373]">
          <span class="text-[11px] font-medium uppercase tracking-wider">Nợ đọng chưa thu</span>
          <AlertCircle class="w-4 h-4 text-[#946300]" aria-hidden="true" />
        </div>
        <div class="text-xl font-bold font-mono text-[#946300] tabular-nums">
          {{ formatVND(statsData.summary.total_unpaid) }}
        </div>
        <p class="text-[11px] text-[#737373]">
          Cần đôn đốc thanh toán
        </p>
      </div>

      <!-- KPI 5: Phụ tải bình quân / khách hàng -->
      <div class="bg-white rounded-lg border border-[#EAEAEA] p-4 space-y-1">
        <div class="flex items-center justify-between text-[#737373]">
          <span class="text-[11px] font-medium uppercase tracking-wider">Bình quân / Khách</span>
          <Users class="w-4 h-4 text-[#171717]" aria-hidden="true" />
        </div>
        <div class="text-xl font-bold font-mono text-[#171717] tabular-nums">
          {{ formatNumber(statsData.summary.avg_kwh_per_customer) }}
          <span class="text-xs font-normal text-[#737373]">kWh/hộ</span>
        </div>
        <p class="text-[11px] text-[#737373]">
          Quản lý <span class="font-mono text-[#171717] font-medium">{{ statsData.summary.active_customers }}</span> công tơ
        </p>
      </div>
    </div>

    <!-- Hàng Biểu Đồ 1: Xu Hướng & Tăng Trưởng -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Biểu đồ 1: Xu hướng Doanh Thu & Sản Lượng (Combo Chart) -->
      <div class="lg:col-span-2 bg-white rounded-lg border border-[#EAEAEA] p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAEAEA] pb-3">
          <div>
            <h3 class="font-semibold text-[#171717] text-sm">
              Xu Hướng Sản Lượng & Doanh Thu Qua Các Kỳ
            </h3>
            <p class="text-[11px] text-[#737373]">
              Nhấp chuột trực tiếp vào cột biểu đồ để mở hồ sơ phân tích kỳ tương ứng
            </p>
          </div>

          <!-- Chế độ xem -->
          <div class="flex items-center gap-1 bg-[#FAFAFA] p-0.5 rounded-md border border-[#EAEAEA] text-xs">
            <button
              @click="trendMode = 'all'"
              :class="trendMode === 'all' ? 'bg-[#171717] text-white font-medium' : 'text-[#737373]'"
              class="px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer"
            >
              Cả hai
            </button>
            <button
              @click="trendMode = 'kwh'"
              :class="trendMode === 'kwh' ? 'bg-[#171717] text-white font-medium' : 'text-[#737373]'"
              class="px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer"
            >
              Chỉ kWh
            </button>
            <button
              @click="trendMode = 'revenue'"
              :class="trendMode === 'revenue' ? 'bg-[#171717] text-white font-medium' : 'text-[#737373]'"
              class="px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer"
            >
              Chỉ Tiền
            </button>
          </div>
        </div>

        <div class="w-full h-72 relative">
          <canvas ref="trendCanvasRef"></canvas>
        </div>
      </div>

      <!-- Biểu đồ 2: Cơ Cấu 6 Bậc Thang EVN (Doughnut) -->
      <div class="bg-white rounded-lg border border-[#EAEAEA] p-5 space-y-4">
        <div class="border-b border-[#EAEAEA] pb-3">
          <h3 class="font-semibold text-[#171717] text-sm">
            Cơ Cấu Tiêu Thụ 6 Bậc Thang
          </h3>
          <p class="text-[11px] text-[#737373]">
            Tỷ trọng sản lượng kWh rơi vào các bậc thang giá
          </p>
        </div>

        <div class="w-full h-72 relative flex items-center justify-center">
          <canvas ref="tierCanvasRef"></canvas>
        </div>
      </div>
    </div>

    <!-- Hàng Biểu Đồ 2: Tốc Độ Tăng Trưởng & Giám Sát Công Nợ -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Biểu đồ 3: Tốc độ tăng trưởng MoM (%) -->
      <div class="bg-white rounded-lg border border-[#EAEAEA] p-5 space-y-4">
        <div class="border-b border-[#EAEAEA] pb-3">
          <h3 class="font-semibold text-[#171717] text-sm">
            Biến Động Tăng Trưởng Sản Lượng & Tiền (% MoM)
          </h3>
          <p class="text-[11px] text-[#737373]">
            Theo dõi dao động phụ tải mùa hè và sự tăng giảm nhu cầu sinh hoạt
          </p>
        </div>

        <div class="w-full h-64 relative">
          <canvas ref="growthCanvasRef"></canvas>
        </div>
      </div>

      <!-- Biểu đồ 4: Giám sát công nợ đã thu vs nợ đọng -->
      <div class="bg-white rounded-lg border border-[#EAEAEA] p-5 space-y-4">
        <div class="border-b border-[#EAEAEA] pb-3">
          <h3 class="font-semibold text-[#171717] text-sm">
            Tiến Độ Thu Cước & Nợ Đọng Theo Kỳ
          </h3>
          <p class="text-[11px] text-[#737373]">
            So sánh tiền điện đã thu hồi (PAID) và nợ đọng cần xử lý (UNPAID)
          </p>
        </div>

        <div class="w-full h-64 relative">
          <canvas ref="debtCanvasRef"></canvas>
        </div>
      </div>
    </div>

    <!-- Bảng Chi Tiết Theo Từng Kỳ -->
    <div class="bg-white rounded-lg border border-[#EAEAEA] p-5 space-y-4">
      <div class="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
        <div>
          <h3 class="font-semibold text-[#171717] text-sm">
            Bảng Tổng Hợp Chi Tiết Chuỗi Thời Gian
          </h3>
          <p class="text-[11px] text-[#737373]">
            Bấm "Xem chi tiết" để drill-down danh sách hộ tiêu thụ lớn và khách hàng nợ cước
          </p>
        </div>
        <span class="text-xs text-[#737373] font-mono">
          {{ statsData?.monthly?.length || 0 }} kỳ
        </span>
      </div>

      <div class="overflow-x-auto rounded-lg border border-[#EAEAEA]">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#FAFAFA] border-b border-[#EAEAEA] text-[#737373] text-[11px] font-medium uppercase tracking-wider">
            <tr>
              <th class="px-4 py-2.5 font-medium">Kỳ hóa đơn</th>
              <th class="px-3 py-2.5 text-right font-medium">Sản lượng (kWh)</th>
              <th class="px-3 py-2.5 text-right font-medium">Doanh thu (VNĐ)</th>
              <th class="px-3 py-2.5 text-right font-medium">Đã thu (VNĐ)</th>
              <th class="px-3 py-2.5 text-right font-medium">Nợ cước (VNĐ)</th>
              <th class="px-3 py-2.5 text-center font-medium">Tỷ lệ thu</th>
              <th class="px-3 py-2.5 text-right font-medium">Tăng trưởng kWh</th>
              <th class="px-4 py-2.5 text-center font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F0F0F0]">
            <tr
              v-for="m in [...(statsData?.monthly || [])].reverse()"
              :key="m.period"
              class="hover:bg-[#FAFAFA] transition-colors"
            >
              <td class="px-4 py-2.5 font-mono font-medium text-[#171717]">
                Kỳ {{ m.period }}
              </td>
              <td class="px-3 py-2.5 text-right font-mono tabular-nums text-[#171717]">
                {{ formatNumber(m.total_kwh) }}
              </td>
              <td class="px-3 py-2.5 text-right font-mono font-medium tabular-nums text-[#171717]">
                {{ formatVND(m.total_amount) }}
              </td>
              <td class="px-3 py-2.5 text-right font-mono tabular-nums text-[#245E2A]">
                {{ formatVND(m.paid_amount) }}
              </td>
              <td class="px-3 py-2.5 text-right font-mono tabular-nums" :class="m.unpaid_amount > 0 ? 'text-[#946300] font-medium' : 'text-[#737373]'">
                {{ formatVND(m.unpaid_amount) }}
              </td>
              <td class="px-3 py-2.5 text-center">
                <span
                  class="px-1.5 py-0.2 rounded text-[11px] font-mono font-medium"
                  :class="m.collection_rate >= 90 ? 'bg-[#EDF3EC] text-[#245E2A] border border-[#D3E2D1]' : 'bg-[#FDF6E7] text-[#946300] border border-[#FAECC8]'"
                >
                  {{ m.collection_rate }}%
                </span>
              </td>
              <td class="px-3 py-2.5 text-right font-mono tabular-nums">
                <span :class="m.kwh_growth_pct >= 0 ? 'text-[#245E2A]' : 'text-[#9F2F2D]'">
                  {{ m.kwh_growth_pct > 0 ? '+' : '' }}{{ m.kwh_growth_pct }}%
                </span>
              </td>
              <td class="px-4 py-2.5 text-center">
                <button
                  @click="openPeriodDetail(m.period)"
                  class="px-2.5 py-1 rounded border border-[#EAEAEA] hover:bg-[#F5F5F5] text-[#171717] font-medium flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                >
                  <Eye class="w-3 h-3 text-[#737373]" aria-hidden="true" />
                  <span>Chi tiết</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Drill-down Chi Tiết Kỳ -->
    <div
      v-if="showPeriodModal"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      @click.self="showPeriodModal = false"
    >
      <div class="bg-white rounded-lg border border-[#EAEAEA] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5">
        <div class="flex items-center justify-between border-b border-[#EAEAEA] pb-3 sticky top-0 bg-white z-10">
          <div>
            <h3 class="font-semibold text-[#171717] text-base">
              Hồ Sơ Vận Hành Kỳ {{ selectedPeriod }}
            </h3>
            <p class="text-xs text-[#737373]">
              Phân tích cơ cấu tiêu thụ và danh sách khách hàng nợ cước cần đôn đốc
            </p>
          </div>
          <button
            @click="showPeriodModal = false"
            aria-label="Đóng"
            class="p-1.5 text-[#737373] hover:text-[#171717] rounded hover:bg-[#F5F5F5] cursor-pointer"
          >
            <X class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div v-if="loadingPeriodDetail" class="py-12 text-center text-xs text-[#737373]">
          Đang tính toán số liệu chi tiết kỳ {{ selectedPeriod }}...
        </div>

        <div v-else-if="periodDetail" class="space-y-5">
          <!-- 4 Khối Chỉ Số Nhanh của Kỳ -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FAFAFA] p-3.5 rounded-lg border border-[#EAEAEA] text-center text-xs">
            <div>
              <span class="block text-[10px] uppercase tracking-wider text-[#737373] font-medium">Sản lượng kỳ</span>
              <strong class="font-mono text-sm text-[#171717]">{{ formatNumber(periodDetail.total_kwh) }} kWh</strong>
            </div>
            <div>
              <span class="block text-[10px] uppercase tracking-wider text-[#737373] font-medium">Doanh thu cước</span>
              <strong class="font-mono text-sm text-[#171717]">{{ formatVND(periodDetail.total_revenue) }}</strong>
            </div>
            <div>
              <span class="block text-[10px] uppercase tracking-wider text-[#737373] font-medium">Đã thu cước</span>
              <strong class="font-mono text-sm text-[#245E2A]">{{ formatVND(periodDetail.paid_amount) }}</strong>
            </div>
            <div>
              <span class="block text-[10px] uppercase tracking-wider text-[#737373] font-medium">Còn nợ ({{ periodDetail.unpaid_count }} hộ)</span>
              <strong class="font-mono text-sm text-[#946300]">{{ formatVND(periodDetail.unpaid_amount) }}</strong>
            </div>
          </div>

          <!-- Phân Phối Hộ Gia Đình Theo Nhóm Phụ Tải -->
          <div class="border border-[#EAEAEA] rounded-lg p-4 space-y-2">
            <span class="block text-xs font-semibold text-[#171717] uppercase tracking-wider">
              Phân loại hộ gia đình theo mức tiêu thụ:
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div class="p-2.5 rounded bg-[#FAFAFA] border border-[#EAEAEA]">
                <span class="block text-[11px] text-[#737373]">Tiết kiệm (≤ 100 kWh)</span>
                <strong class="font-mono text-sm text-[#171717]">{{ periodDetail.consumption_brackets?.low || 0 }}</strong>
                <span class="text-[11px] text-[#A3A3A3]"> hộ</span>
              </div>
              <div class="p-2.5 rounded bg-[#FAFAFA] border border-[#EAEAEA]">
                <span class="block text-[11px] text-[#737373]">Trung bình (101 - 300 kWh)</span>
                <strong class="font-mono text-sm text-[#171717]">{{ periodDetail.consumption_brackets?.mid || 0 }}</strong>
                <span class="text-[11px] text-[#A3A3A3]"> hộ</span>
              </div>
              <div class="p-2.5 rounded bg-[#FAFAFA] border border-[#EAEAEA]">
                <span class="block text-[11px] text-[#737373]">Cao (> 300 kWh)</span>
                <strong class="font-mono text-sm text-[#B45309]">{{ periodDetail.consumption_brackets?.high || 0 }}</strong>
                <span class="text-[11px] text-[#A3A3A3]"> hộ</span>
              </div>
            </div>
          </div>

          <!-- Danh Sách Khách Hàng Nợ Cước Cần Đôn Đốc -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-[#171717] uppercase tracking-wider">
                Top Khách Hàng Nợ Cước Kỳ {{ selectedPeriod }}
              </span>
              <span class="text-[11px] text-[#737373] font-mono">
                {{ periodDetail.top_unpaid?.length || 0 }} khách hàng
              </span>
            </div>

            <div v-if="periodDetail.top_unpaid?.length === 0" class="p-4 text-center rounded-lg border border-[#EAEAEA] text-xs text-[#245E2A] bg-[#EDF3EC]">
              Tất cả khách hàng trong kỳ này đã hoàn tất thanh toán cước!
            </div>

            <div v-else class="overflow-x-auto rounded-lg border border-[#EAEAEA] max-h-60 overflow-y-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#FAFAFA] border-b border-[#EAEAEA] text-[#737373] text-[10px] font-medium uppercase tracking-wider sticky top-0">
                  <tr>
                    <th class="px-3 py-2 font-medium">Mã KH</th>
                    <th class="px-3 py-2 font-medium">Họ và tên</th>
                    <th class="px-3 py-2 font-medium">Số điện thoại</th>
                    <th class="px-3 py-2 text-right font-medium">Sản lượng</th>
                    <th class="px-3 py-2 text-right font-medium">Tiền nợ</th>
                    <th class="px-3 py-2 text-center font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#F0F0F0]">
                  <tr
                    v-for="u in periodDetail.top_unpaid"
                    :key="u.id"
                    class="hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td class="px-3 py-2 font-mono font-medium text-[#171717]">
                      {{ u.customer_code }}
                    </td>
                    <td class="px-3 py-2 font-medium text-[#171717]">
                      {{ u.full_name }}
                    </td>
                    <td class="px-3 py-2 font-mono text-[#737373]">
                      {{ u.phone || '-' }}
                    </td>
                    <td class="px-3 py-2 text-right font-mono tabular-nums text-[#171717]">
                      {{ formatNumber(u.kwh) }}&nbsp;kWh
                    </td>
                    <td class="px-3 py-2 text-right font-mono font-semibold tabular-nums text-[#946300]">
                      {{ formatVND(u.total_amount) }}
                    </td>
                    <td class="px-3 py-2 text-center">
                      <button
                        @click="showPeriodModal = false; $emit('inspect-customer', u.customer_code)"
                        class="px-2 py-0.5 rounded border border-[#EAEAEA] text-[#171717] hover:bg-[#F5F5F5] text-[11px] font-medium flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                      >
                        <ExternalLink class="w-3 h-3 text-[#737373]" aria-hidden="true" />
                        <span>Tra cứu</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-2 border-t border-[#EAEAEA]">
          <button
            type="button"
            @click="showPeriodModal = false"
            class="px-3.5 py-1.5 rounded-md border border-[#EAEAEA] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] text-xs font-medium cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
