<script setup>
import { ref, computed } from 'vue';
import {
  User,
  MapPin,
  Phone,
  Gauge,
  LogOut,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Eye,
  BarChart3,
  List,
  ArrowUpRight,
  Lock,
  ShieldCheck,
  X,
} from 'lucide-vue-next';
import { formatVND, formatNumber } from '../api';
import TierBreakdownTable from './TierBreakdownTable.vue';
import ReadingDetailModal from './ReadingDetailModal.vue';
import PaymentModal from './PaymentModal.vue';
import ElectricityChart from './ElectricityChart.vue';

const props = defineProps({
  customerData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['logout', 'refresh', 'verify-phone']);

const activeTab = ref('history');
const selectedYear = ref('ALL');

const showPhoneModal = ref(false);
const inputPhone = ref('');
const phoneError = ref('');
const verifyingPhone = ref(false);

const showDetailModal = ref(false);
const selectedReading = ref(null);

const showPaymentModal = ref(false);
const payingReading = ref(null);

const isAuthenticated = computed(() => Boolean(props.customerData.is_authenticated));
const customer = computed(() => props.customerData.customer || {});
const summary = computed(() => props.customerData.summary || {});
const readings = computed(() => props.customerData.readings || []);

function openPhoneModal() {
  inputPhone.value = '';
  phoneError.value = '';
  showPhoneModal.value = true;
}

function handleVerifyPhone() {
  if (!inputPhone.value.trim()) {
    phoneError.value = 'Vui lòng nhập số điện thoại';
    return;
  }
  emit('verify-phone', {
    phone: inputPhone.value.trim(),
    onSuccess: () => {
      showPhoneModal.value = false;
    },
    onError: (msg) => {
      phoneError.value = msg || 'Số điện thoại không khớp với hồ sơ khách hàng';
    },
  });
}

const unpaidReadings = computed(() => {
  return readings.value.filter((r) => r.payment_status === 'UNPAID');
});

const availableYears = computed(() => {
  const years = new Set();
  readings.value.forEach((r) => {
    if (r.period) years.add(r.period.substring(0, 4));
  });
  return Array.from(years).sort().reverse();
});

const chartData = computed(() => {
  let list = [...readings.value].reverse();
  if (selectedYear.value !== 'ALL') {
    list = list.filter((r) => r.period.startsWith(selectedYear.value));
  }
  return list.map((r) => ({
    period: r.period,
    total_kwh: r.kwh,
    total_amount: r.total_amount,
  }));
});

function openDetail(item) {
  selectedReading.value = item;
  showDetailModal.value = true;
}

function openPay(item) {
  payingReading.value = item;
  showPaymentModal.value = true;
}

function handlePaymentSuccess() {
  showPaymentModal.value = false;
  emit('refresh');
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Thông Tin Khách Hàng (Clean Modern Card) -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div class="flex items-start sm:items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
          <User class="w-6 h-6" aria-hidden="true" />
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2.5 flex-wrap">
            <h2 class="text-xl font-bold text-slate-900 tracking-tight">
              {{ customer.full_name }}
            </h2>
            <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs border border-slate-200">
              {{ customer.customer_code }}
            </span>
            <span
              v-if="customer.status === 'TERMINATED'"
              class="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200"
            >
              Hợp đồng: Đã chấm dứt
            </span>
            <span
              v-else
              class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200"
            >
              Hợp đồng: Đang hiệu lực
            </span>
          </div>

          <!-- Thông tin cá nhân chi tiết (Chỉ hiển thị khi đã xác thực SĐT) -->
          <div v-if="isAuthenticated" class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
            <span class="flex items-center gap-1.5">
              <Gauge class="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              Công tơ: <strong class="text-slate-800 font-mono">{{ customer.meter_code || 'Chưa cập nhật' }}</strong>
            </span>
            <span v-if="customer.phone" class="flex items-center gap-1.5">
              <Phone class="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              {{ customer.phone }}
            </span>
            <span v-if="customer.address" class="flex items-center gap-1.5">
              <MapPin class="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              {{ customer.address }}
            </span>
          </div>

          <!-- Thông báo chế độ tra cứu nhanh bảo vệ quyền riêng tư -->
          <div v-else class="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold border border-amber-200/80">
              <Lock class="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              Chế độ bảo mật: Đang ẩn địa chỉ, số công tơ và lịch sử tiền điện
            </span>
            <button
              @click="openPhoneModal"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0099ff]/10 hover:bg-[#0099ff]/20 text-[#0099ff] font-bold text-xs transition-colors cursor-pointer"
            >
              <Phone class="w-3 h-3" aria-hidden="true" />
              <span>Xác thực SĐT để mở khóa</span>
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2.5 self-end sm:self-auto">
        <button
          v-if="!isAuthenticated"
          @click="openPhoneModal"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0099ff] hover:bg-[#0088ee] text-white text-xs font-bold transition-all shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
        >
          <Phone class="w-4 h-4" aria-hidden="true" />
          <span>Nhập SĐT xem lịch sử</span>
        </button>

        <button
          @click="$emit('logout')"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
        >
          <LogOut class="w-4 h-4 text-slate-400" aria-hidden="true" />
          <span>Đổi mã tra cứu</span>
        </button>
      </div>
    </div>

    <!-- Thẻ Thông Báo Thanh Toán Nổi Bật -->
    <div
      v-if="unpaidReadings.length > 0"
      role="alert"
      class="bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm"
    >
      <div class="space-y-1">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <AlertCircle class="w-3.5 h-3.5" aria-hidden="true" />
          <span>{{ unpaidReadings.length }} kỳ cần thanh toán</span>
        </div>
        <h3 class="text-base font-bold tracking-tight">
          Hóa đơn tiền điện kỳ {{ unpaidReadings.map((r) => r.period).join(', ') }}
        </h3>
        <p class="text-xs text-slate-400">
          Vui lòng hoàn tất thanh toán để duy trì nguồn điện sinh hoạt ổn định
        </p>
      </div>

      <div class="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-800 relative z-10">
        <div class="text-right">
          <span class="block text-[11px] text-slate-400 uppercase font-semibold">Tổng tiền thanh toán</span>
          <span class="text-2xl sm:text-3xl font-extrabold text-[#0099ff] font-mono tabular-nums tracking-tight">
            {{ formatVND(summary.unpaid_total_amount) }}
          </span>
        </div>
        <button
          @click="openPay(unpaidReadings[0])"
          class="px-5 py-3 rounded-2xl bg-[#0099ff] hover:bg-[#0088ee] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-[#0099ff]/30 shrink-0 cursor-pointer focus-visible:ring-3 focus-visible:ring-[#0099ff]/50 focus-visible:outline-none"
        >
          <CreditCard class="w-4 h-4" aria-hidden="true" />
          <span>Thanh toán ngay</span>
        </button>
      </div>
    </div>

    <!-- Thông Báo Đã Thanh Toán Đầy Đủ -->
    <div
      v-else
      class="bg-white rounded-3xl border border-slate-200/80 p-5 flex items-center justify-between gap-4 shadow-xs"
    >
      <div class="flex items-center gap-3.5">
        <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
          <CheckCircle2 class="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <h4 class="font-bold text-slate-900 text-sm">
            Tất cả hóa đơn đã được thanh toán
          </h4>
          <p class="text-xs text-slate-500">
            Quý khách không có khoản nợ tiền điện nào chưa thanh toán. Cảm ơn quý khách!
          </p>
        </div>
      </div>
    </div>

    <!-- Điều Hướng Tabs Hiện Đại -->
    <div class="flex border-b border-slate-200 gap-6">
      <button
        @click="activeTab = 'history'"
        :class="activeTab === 'history' ? 'border-[#0099ff] text-[#0099ff] font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'"
        class="pb-3 text-sm border-b-2 flex items-center gap-2 transition-colors cursor-pointer"
      >
        <List class="w-4 h-4" aria-hidden="true" />
        <span>{{ isAuthenticated ? 'Lịch sử tiền điện' : 'Hóa đơn kỳ này' }}</span>
        <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-bold">{{ readings.length }}</span>
      </button>

      <button
        @click="isAuthenticated ? (activeTab = 'chart') : openPhoneModal()"
        :class="activeTab === 'chart' ? 'border-[#0099ff] text-[#0099ff] font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'"
        class="pb-3 text-sm border-b-2 flex items-center gap-2 transition-colors cursor-pointer"
      >
        <BarChart3 class="w-4 h-4" aria-hidden="true" />
        <span>Biểu đồ tiêu thụ</span>
        <span v-if="!isAuthenticated" class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <Lock class="w-3 h-3" aria-hidden="true" />
          Khóa
        </span>
      </button>
    </div>

    <!-- Tab 1: Lịch Sử Tiền Điện -->
    <div v-if="activeTab === 'history'" class="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4">Kỳ hóa đơn</th>
              <th class="px-4 py-4 text-right">Chỉ số cũ</th>
              <th class="px-4 py-4 text-right">Chỉ số mới</th>
              <th class="px-4 py-4 text-right">Sản lượng (kWh)</th>
              <th class="px-4 py-4 text-right">Tổng tiền (VNĐ)</th>
              <th class="px-4 py-4 text-center">Trạng thái</th>
              <th class="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="r in readings"
              :key="r.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="px-6 py-4">
                <span class="font-bold text-slate-900 font-mono text-base block">Kỳ {{ r.period }}</span>
                <span class="text-xs text-slate-400">Ngày chốt: {{ r.reading_date }}</span>
              </td>
              <td class="px-4 py-4 text-right font-mono text-slate-500 tabular-nums">
                {{ formatNumber(r.prev_index) }}
              </td>
              <td class="px-4 py-4 text-right font-mono font-bold text-slate-800 tabular-nums">
                {{ formatNumber(r.current_index) }}
              </td>
              <td class="px-4 py-4 text-right font-mono font-bold text-[#0099ff] text-base tabular-nums">
                {{ formatNumber(r.kwh) }}&nbsp;kWh
              </td>
              <td class="px-4 py-4 text-right font-mono font-extrabold text-slate-900 text-base tabular-nums">
                {{ formatVND(r.total_amount) }}
              </td>
              <td class="px-4 py-4 text-center">
                <span
                  v-if="r.payment_status === 'PAID'"
                  class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                >
                  <CheckCircle2 class="w-3.5 h-3.5" aria-hidden="true" />
                  Đã thanh toán
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60"
                >
                  <AlertCircle class="w-3.5 h-3.5" aria-hidden="true" />
                  Chưa đóng
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="openDetail(r)"
                    title="Xem chi tiết hóa đơn"
                    class="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
                  >
                    <Eye class="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    <span>Chi tiết</span>
                  </button>

                  <button
                    v-if="r.payment_status === 'UNPAID'"
                    @click="openPay(r)"
                    class="px-3 py-1.5 rounded-xl bg-[#0099ff] text-white hover:bg-[#0088ee] active:scale-[0.98] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
                  >
                    <CreditCard class="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Đóng tiền</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Banner mời nhập SĐT để xem trọn bộ lịch sử khi chưa xác thực -->
      <div
        v-if="!isAuthenticated"
        class="p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
      >
        <div class="space-y-0.5">
          <p class="text-xs font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
            <Lock class="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            Bạn muốn xem toàn bộ lịch sử các tháng trước và biểu đồ xu hướng?
          </p>
          <p class="text-[11px] text-slate-500">
            Vì lý do bảo mật thông tin khách hàng, vui lòng nhập số điện thoại đã đăng ký với EVN để mở khóa.
          </p>
        </div>
        <button
          @click="openPhoneModal"
          class="px-4 py-2 rounded-xl bg-[#0099ff] hover:bg-[#0088ee] active:scale-[0.98] text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
        >
          Nhập số điện thoại ngay
        </button>
      </div>
    </div>

    <!-- Tab 2: Biểu Đồ Giám Sát Tiêu Thụ -->
    <div v-if="activeTab === 'chart' && isAuthenticated" class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 class="font-extrabold text-slate-900 text-base">
            Biểu Đồ Xu Hướng Tiêu Thụ & Chi Phí (2022 – 2026)
          </h3>
          <p class="text-xs text-slate-500">
            Theo dõi sản lượng điện năng tiêu thụ (kWh) và số tiền thanh toán tương ứng
          </p>
        </div>

        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            @click="selectedYear = 'ALL'"
            :class="selectedYear === 'ALL' ? 'bg-[#0099ff] text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            class="px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
          >
            Tất cả
          </button>
          <button
            v-for="yr in availableYears"
            :key="yr"
            @click="selectedYear = yr"
            :class="selectedYear === yr ? 'bg-[#0099ff] text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            class="px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
          >
            Năm {{ yr }}
          </button>
        </div>
      </div>

      <ElectricityChart :monthly-data="chartData" />
    </div>

    <!-- Modals -->
    <ReadingDetailModal
      :is-open="showDetailModal"
      :reading="selectedReading"
      :meter-name="customer.meter_code"
      @close="showDetailModal = false"
    />

    <PaymentModal
      :is-open="showPaymentModal"
      :reading="payingReading"
      :customer="customer"
      @close="showPaymentModal = false"
      @payment-success="handlePaymentSuccess"
    />

    <!-- Modal Nhập Số Điện Thoại Để Mở Khóa Lịch Sử & Thông Tin Cá Nhân -->
    <div
      v-if="showPhoneModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      @click.self="showPhoneModal = false"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-slate-100 space-y-5">
        <button
          @click="showPhoneModal = false"
          class="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" aria-hidden="true" />
        </button>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#0099ff]/10 text-[#0099ff] flex items-center justify-center shrink-0 border border-[#0099ff]/20">
            <ShieldCheck class="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 class="font-extrabold text-slate-900 text-base">
              Xác Thực Số Điện Thoại
            </h3>
            <p class="text-xs text-slate-500">
              Mã khách hàng: <strong class="font-mono text-slate-800">{{ customer.customer_code }}</strong>
            </p>
          </div>
        </div>

        <p class="text-xs text-slate-500 leading-relaxed">
          Để xem toàn bộ lịch sử dùng điện qua các kỳ, biểu đồ xu hướng và thông tin địa chỉ/công tơ, vui lòng nhập chính xác số điện thoại đã đăng ký hợp đồng với EVN.
        </p>

        <div
          v-if="phoneError"
          role="alert"
          class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2"
        >
          <AlertCircle class="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />
          <span>{{ phoneError }}</span>
        </div>

        <form @submit.prevent="handleVerifyPhone" class="space-y-4">
          <div class="space-y-1.5">
            <label for="verify-phone-input" class="block text-xs font-bold text-slate-700">
              Số điện thoại chính chủ
            </label>
            <div class="relative">
              <input
                id="verify-phone-input"
                v-model="inputPhone"
                type="tel"
                placeholder="Ví dụ: 0901234567..."
                class="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-mono bg-slate-50/60 focus:bg-white focus-visible:ring-3 focus-visible:ring-[#0099ff]/20 focus-visible:border-[#0099ff] focus-visible:outline-none transition-all"
                autofocus
              />
              <Phone class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              @click="showPhoneModal = false"
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-xl bg-[#0099ff] hover:bg-[#0088ee] active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md shadow-[#0099ff]/20 cursor-pointer"
            >
              Xác thực & Mở khóa
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
