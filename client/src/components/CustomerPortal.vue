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
  Lock,
  ShieldCheck,
  X,
} from 'lucide-vue-next';
import { formatVND, formatNumber } from '../api';
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
  <div class="space-y-5">
    <!-- Header Thông Tin Khách Hàng (Flat Minimal Card) -->
    <div class="bg-white rounded-lg border border-[#EAEAEA] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      <div class="flex items-start sm:items-center gap-4">
        <div class="w-10 h-10 rounded-md bg-[#F5F5F5] text-[#171717] flex items-center justify-center shrink-0 border border-[#EAEAEA]">
          <User class="w-5 h-5" aria-hidden="true" />
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-lg font-semibold text-[#171717] tracking-tight">
              {{ customer.full_name }}
            </h2>
            <span class="px-2 py-0.5 rounded bg-[#F5F5F5] text-[#171717] font-mono text-xs border border-[#EAEAEA]">
              {{ customer.customer_code }}
            </span>
            <span
              v-if="customer.status === 'TERMINATED'"
              class="px-2 py-0.5 rounded text-xs font-medium bg-[#FDEBEC] text-[#9F2F2D] border border-[#F8D0D0]"
            >
              Hợp đồng: Đã chấm dứt
            </span>
            <span
              v-else
              class="px-2 py-0.5 rounded text-xs font-medium bg-[#EDF3EC] text-[#245E2A] border border-[#D3E2D1]"
            >
              Hợp đồng: Hiệu lực
            </span>
          </div>

          <!-- Thông tin cá nhân chi tiết (Chỉ hiển thị khi đã xác thực SĐT) -->
          <div v-if="isAuthenticated" class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#737373]">
            <span class="flex items-center gap-1.5">
              <Gauge class="w-3.5 h-3.5 text-[#A3A3A3]" aria-hidden="true" />
              Công tơ: <strong class="text-[#171717] font-mono font-medium">{{ customer.meter_code || 'Chưa cập nhật' }}</strong>
            </span>
            <span v-if="customer.phone" class="flex items-center gap-1.5">
              <Phone class="w-3.5 h-3.5 text-[#A3A3A3]" aria-hidden="true" />
              <span class="font-mono">{{ customer.phone }}</span>
            </span>
            <span v-if="customer.address" class="flex items-center gap-1.5">
              <MapPin class="w-3.5 h-3.5 text-[#A3A3A3]" aria-hidden="true" />
              {{ customer.address }}
            </span>
          </div>

          <!-- Thông báo chế độ tra cứu nhanh bảo vệ quyền riêng tư -->
          <div v-else class="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#737373]">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FDF6E7] text-[#946300] border border-[#FAECC8] text-xs font-medium">
              <Lock class="w-3 h-3 text-[#946300]" aria-hidden="true" />
              Chế độ bảo mật: Đang ẩn địa chỉ, số công tơ và lịch sử tiền điện
            </span>
            <button
              @click="openPhoneModal"
              type="button"
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-[#EAEAEA] bg-white hover:bg-[#F5F5F5] text-[#171717] font-medium text-xs transition-colors cursor-pointer"
            >
              <Phone class="w-3 h-3 text-[#737373]" aria-hidden="true" />
              <span>Xác thực SĐT</span>
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          v-if="!isAuthenticated"
          @click="openPhoneModal"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717] hover:bg-[#262626] text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Phone class="w-3.5 h-3.5" aria-hidden="true" />
          <span>Nhập SĐT mở khóa</span>
        </button>

        <button
          @click="$emit('logout')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#EAEAEA] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] text-xs font-medium transition-colors cursor-pointer"
        >
          <LogOut class="w-3.5 h-3.5 text-[#A3A3A3]" aria-hidden="true" />
          <span>Đổi mã tra cứu</span>
        </button>
      </div>
    </div>

    <!-- Thẻ Thông Báo Thanh Toán Nổi Bật (Flat Minimal Style) -->
    <div
      v-if="unpaidReadings.length > 0"
      role="alert"
      class="bg-white rounded-lg border border-[#EAEAEA] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden"
    >
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-[#D97706]"></div>
      <div class="space-y-1 pl-2">
        <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FDF6E7] text-[#946300] text-xs font-medium border border-[#FAECC8]">
          <AlertCircle class="w-3.5 h-3.5" aria-hidden="true" />
          <span>{{ unpaidReadings.length }} kỳ cần thanh toán</span>
        </div>
        <h3 class="text-sm font-semibold text-[#171717]">
          Hóa đơn tiền điện kỳ {{ unpaidReadings.map((r) => r.period).join(', ') }}
        </h3>
        <p class="text-xs text-[#737373]">
          Vui lòng hoàn tất thanh toán để duy trì nguồn điện sinh hoạt ổn định.
        </p>
      </div>

      <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#EAEAEA]">
        <div class="text-right">
          <span class="block text-[11px] text-[#737373] uppercase tracking-wider font-medium">Tổng tiền nợ</span>
          <span class="text-2xl font-bold text-[#171717] font-mono tabular-nums">
            {{ formatVND(summary.unpaid_total_amount) }}
          </span>
        </div>
        <button
          @click="openPay(unpaidReadings[0])"
          class="px-4 py-2 rounded-md bg-[#171717] hover:bg-[#262626] active:scale-[0.99] text-white font-medium text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <CreditCard class="w-4 h-4" aria-hidden="true" />
          <span>Thanh toán ngay</span>
        </button>
      </div>
    </div>

    <!-- Thông Báo Đã Thanh Toán Đầy Đủ -->
    <div
      v-else
      class="bg-white rounded-lg border border-[#EAEAEA] p-4 flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-md bg-[#EDF3EC] text-[#245E2A] flex items-center justify-center shrink-0 border border-[#D3E2D1]">
          <CheckCircle2 class="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h4 class="font-semibold text-[#171717] text-xs">
            Tất cả hóa đơn đã được thanh toán
          </h4>
          <p class="text-xs text-[#737373]">
            Quý khách không có khoản nợ tiền điện nào chưa thanh toán. Cảm ơn quý khách!
          </p>
        </div>
      </div>
    </div>

    <!-- Điều Hướng Tabs Minimalist -->
    <div class="flex border-b border-[#EAEAEA] gap-6">
      <button
        @click="activeTab = 'history'"
        :class="activeTab === 'history' ? 'border-[#171717] text-[#171717] font-semibold' : 'border-transparent text-[#737373] hover:text-[#171717] font-normal'"
        class="pb-2.5 text-xs border-b-2 flex items-center gap-2 transition-colors cursor-pointer"
      >
        <List class="w-3.5 h-3.5" aria-hidden="true" />
        <span>{{ isAuthenticated ? 'Lịch sử tiền điện' : 'Hóa đơn kỳ này' }}</span>
        <span class="px-1.5 py-0.2 rounded bg-[#F5F5F5] text-[#737373] text-[11px] font-mono">{{ readings.length }}</span>
      </button>

      <button
        @click="isAuthenticated ? (activeTab = 'chart') : openPhoneModal()"
        :class="activeTab === 'chart' ? 'border-[#171717] text-[#171717] font-semibold' : 'border-transparent text-[#737373] hover:text-[#171717] font-normal'"
        class="pb-2.5 text-xs border-b-2 flex items-center gap-2 transition-colors cursor-pointer"
      >
        <BarChart3 class="w-3.5 h-3.5" aria-hidden="true" />
        <span>Biểu đồ tiêu thụ</span>
        <span v-if="!isAuthenticated" class="inline-flex items-center gap-1 text-[10px] font-medium text-[#946300] bg-[#FDF6E7] px-1.5 py-0.2 rounded border border-[#FAECC8]">
          <Lock class="w-2.5 h-2.5" aria-hidden="true" />
          Khóa
        </span>
      </button>
    </div>

    <!-- Tab 1: Lịch Sử Tiền Điện -->
    <div v-if="activeTab === 'history'" class="bg-white rounded-lg border border-[#EAEAEA] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#FAFAFA] border-b border-[#EAEAEA] text-[11px] font-medium text-[#737373] uppercase tracking-wider">
            <tr>
              <th class="px-5 py-3 font-medium">Kỳ hóa đơn</th>
              <th class="px-4 py-3 text-right font-medium">Chỉ số cũ</th>
              <th class="px-4 py-3 text-right font-medium">Chỉ số mới</th>
              <th class="px-4 py-3 text-right font-medium">Sản lượng</th>
              <th class="px-4 py-3 text-right font-medium">Tổng tiền</th>
              <th class="px-4 py-3 text-center font-medium">Trạng thái</th>
              <th class="px-5 py-3 text-center font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F0F0F0]">
            <tr
              v-for="r in readings"
              :key="r.id"
              class="hover:bg-[#FAFAFA] transition-colors"
            >
              <td class="px-5 py-3.5">
                <span class="font-mono font-semibold text-[#171717] text-xs block">Kỳ {{ r.period }}</span>
                <span class="text-[11px] text-[#A3A3A3]">Ngày chốt: {{ r.reading_date }}</span>
              </td>
              <td class="px-4 py-3.5 text-right font-mono text-[#737373] tabular-nums">
                {{ formatNumber(r.prev_index) }}
              </td>
              <td class="px-4 py-3.5 text-right font-mono font-medium text-[#171717] tabular-nums">
                {{ formatNumber(r.current_index) }}
              </td>
              <td class="px-4 py-3.5 text-right font-mono font-medium text-[#171717] tabular-nums">
                {{ formatNumber(r.kwh) }}&nbsp;kWh
              </td>
              <td class="px-4 py-3.5 text-right font-mono font-semibold text-[#171717] tabular-nums">
                {{ formatVND(r.total_amount) }}
              </td>
              <td class="px-4 py-3.5 text-center">
                <span
                  v-if="r.payment_status === 'PAID'"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#EDF3EC] text-[#245E2A] border border-[#D3E2D1]"
                >
                  <CheckCircle2 class="w-3 h-3" aria-hidden="true" />
                  Đã thanh toán
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#FDF6E7] text-[#946300] border border-[#FAECC8]"
                >
                  <AlertCircle class="w-3 h-3" aria-hidden="true" />
                  Chưa đóng
                </span>
              </td>
              <td class="px-5 py-3.5 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    @click="openDetail(r)"
                    title="Xem chi tiết hóa đơn"
                    class="px-2.5 py-1 rounded border border-[#EAEAEA] text-[#171717] hover:bg-[#F5F5F5] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye class="w-3.5 h-3.5 text-[#737373]" aria-hidden="true" />
                    <span>Chi tiết</span>
                  </button>

                  <button
                    v-if="r.payment_status === 'UNPAID'"
                    @click="openPay(r)"
                    class="px-2.5 py-1 rounded bg-[#171717] text-white hover:bg-[#262626] active:scale-[0.99] text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <CreditCard class="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Thanh toán</span>
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
        class="p-4 bg-[#FAFAFA] border-t border-[#EAEAEA] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs"
      >
        <div class="space-y-0.5">
          <p class="font-medium text-[#171717] flex items-center justify-center sm:justify-start gap-1.5">
            <Lock class="w-3 h-3 text-[#946300]" aria-hidden="true" />
            Bạn muốn xem toàn bộ lịch sử các tháng trước và biểu đồ xu hướng?
          </p>
          <p class="text-[11px] text-[#737373]">
            Vì lý do bảo mật, vui lòng xác thực số điện thoại đã đăng ký với EVN để mở khóa.
          </p>
        </div>
        <button
          @click="openPhoneModal"
          class="px-3 py-1.5 rounded-md bg-[#171717] hover:bg-[#262626] text-white text-xs font-medium transition-colors shrink-0 cursor-pointer"
        >
          Xác thực số điện thoại
        </button>
      </div>
    </div>

    <!-- Tab 2: Biểu Đồ Giám Sát Tiêu Thụ -->
    <div v-if="activeTab === 'chart' && isAuthenticated" class="bg-white rounded-lg border border-[#EAEAEA] p-5 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAEAEA] pb-3">
        <div>
          <h3 class="font-semibold text-[#171717] text-sm">
            Biểu Đồ Xu Hướng Tiêu Thụ & Chi Phí
          </h3>
          <p class="text-xs text-[#737373]">
            Theo dõi sản lượng điện năng tiêu thụ (kWh) và số tiền thanh toán tương ứng
          </p>
        </div>

        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            @click="selectedYear = 'ALL'"
            :class="selectedYear === 'ALL' ? 'bg-[#171717] text-white font-medium' : 'bg-[#F5F5F5] text-[#737373] hover:text-[#171717] hover:bg-[#EAEAEA]'"
            class="px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
          >
            Tất cả
          </button>
          <button
            v-for="yr in availableYears"
            :key="yr"
            @click="selectedYear = yr"
            :class="selectedYear === yr ? 'bg-[#171717] text-white font-medium' : 'bg-[#F5F5F5] text-[#737373] hover:text-[#171717] hover:bg-[#EAEAEA]'"
            class="px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer"
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
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      @click.self="showPhoneModal = false"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-5 relative border border-[#EAEAEA] space-y-4">
        <button
          @click="showPhoneModal = false"
          class="absolute top-4 right-4 p-1 text-[#737373] hover:text-[#171717] rounded hover:bg-[#F5F5F5] transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" aria-hidden="true" />
        </button>

        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-md bg-[#F5F5F5] text-[#171717] flex items-center justify-center shrink-0 border border-[#EAEAEA]">
            <ShieldCheck class="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 class="font-semibold text-[#171717] text-sm">
              Xác Thực Số Điện Thoại
            </h3>
            <p class="text-xs text-[#737373]">
              Mã khách hàng: <strong class="font-mono text-[#171717]">{{ customer.customer_code }}</strong>
            </p>
          </div>
        </div>

        <p class="text-xs text-[#737373] leading-relaxed">
          Để xem toàn bộ lịch sử dùng điện qua các kỳ, biểu đồ xu hướng và thông tin địa chỉ/công tơ, vui lòng nhập chính xác số điện thoại đã đăng ký hợp đồng với EVN.
        </p>

        <div
          v-if="phoneError"
          role="alert"
          class="p-2.5 rounded bg-[#FDEBEC] border border-[#F8D0D0] text-[#9F2F2D] text-xs flex items-center gap-2"
        >
          <AlertCircle class="w-3.5 h-3.5 text-[#9F2F2D] shrink-0" aria-hidden="true" />
          <span>{{ phoneError }}</span>
        </div>

        <form @submit.prevent="handleVerifyPhone" class="space-y-3">
          <div class="space-y-1">
            <label for="verify-phone-input" class="block text-xs font-medium text-[#171717]">
              Số điện thoại chính chủ
            </label>
            <div class="relative">
              <input
                id="verify-phone-input"
                v-model="inputPhone"
                type="tel"
                placeholder="Ví dụ: 0901234567"
                class="w-full pl-9 pr-3 py-2 rounded-md border border-[#EAEAEA] text-xs font-mono bg-white text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#171717] focus:outline-none transition-colors"
                autofocus
              />
              <Phone class="w-3.5 h-3.5 text-[#A3A3A3] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              @click="showPhoneModal = false"
              class="px-3 py-1.5 rounded-md border border-[#EAEAEA] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] text-xs font-medium transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 rounded-md bg-[#171717] hover:bg-[#262626] active:scale-[0.99] text-white text-xs font-medium transition-all cursor-pointer"
            >
              Xác thực & Mở khóa
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
