<script setup>
import { ref } from 'vue';
import { X, CreditCard, ExternalLink, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-vue-next';
import { api, formatVND, formatNumber } from '../api';

const props = defineProps({
  isOpen: Boolean,
  reading: Object,
  customer: Object,
});

const emit = defineEmits(['close', 'payment-success']);

const loadingPayos = ref(false);
const loadingVnpay = ref(false);
const loadingSimulate = ref(false);
const errorMsg = ref('');

async function handlePayPayos() {
  if (!props.reading) return;
  loadingPayos.value = true;
  errorMsg.value = '';

  try {
    const currentOrigin = window.location.origin;
    const returnUrl = `${currentOrigin}/?payos_status=PAID&paid_reading_id=${props.reading.id}`;
    const cancelUrl = `${currentOrigin}/?payos_status=CANCEL&paid_reading_id=${props.reading.id}`;
    const res = await api.createPayosUrl(props.reading.id, returnUrl, cancelUrl);

    if (res.checkoutUrl) {
      window.location.href = res.checkoutUrl;
    } else {
      throw new Error(res.error || 'Không nhận được đường dẫn thanh toán từ PayOS');
    }
  } catch (err) {
    errorMsg.value = err.message || 'Lỗi khi tạo liên kết thanh toán PayOS';
    loadingPayos.value = false;
  }
}

async function handlePayVnpay() {
  if (!props.reading) return;
  loadingVnpay.value = true;
  errorMsg.value = '';

  try {
    const currentOrigin = window.location.origin;
    const returnUrl = `${currentOrigin}/?paid_reading_id=${props.reading.id}`;
    const res = await api.createVnpayUrl(props.reading.id, returnUrl);

    if (res.paymentUrl) {
      window.location.href = res.paymentUrl;
    }
  } catch (err) {
    errorMsg.value = err.message || 'Lỗi khi tạo liên kết thanh toán VNPAY';
    loadingVnpay.value = false;
  }
}

async function handleSimulate() {
  if (!props.reading) return;
  loadingSimulate.value = true;
  errorMsg.value = '';

  try {
    const res = await api.simulatePayment(props.reading.id);
    if (res.success) {
      emit('payment-success', {
        readingId: props.reading.id,
        transactionId: res.transaction_id,
      });
    }
  } catch (err) {
    errorMsg.value = err.message || 'Lỗi khi mô phỏng thanh toán';
  } finally {
    loadingSimulate.value = false;
  }
}
</script>

<template>
  <div
    v-if="isOpen && reading"
    role="dialog"
    aria-modal="true"
    aria-labelledby="payment-modal-title"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg border border-[#EAEAEA] w-full max-w-md overflow-hidden">
      <!-- Modal Header -->
      <div class="px-5 py-4 border-b border-[#EAEAEA] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-md bg-[#F5F5F5] text-[#171717] flex items-center justify-center border border-[#EAEAEA]">
            <CreditCard class="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 id="payment-modal-title" class="font-semibold text-[#171717] text-sm">
              Thanh Toán Tiền Điện
            </h3>
            <p class="text-[11px] text-[#737373] font-mono">Kỳ {{ reading.period }} • {{ customer?.customer_code }}</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          aria-label="Đóng cửa sổ"
          class="p-1 rounded text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div class="p-5 space-y-4">
        <div v-if="errorMsg" role="alert" class="p-2.5 bg-[#FDEBEC] border border-[#F8D0D0] text-[#9F2F2D] text-xs rounded-md">
          {{ errorMsg }}
        </div>

        <!-- Khối Số Tiền Flat -->
        <div class="bg-[#FAFAFA] rounded-md p-4 border border-[#EAEAEA] text-center space-y-0.5">
          <span class="text-[11px] text-[#737373] font-medium uppercase tracking-wider block">
            Tổng tiền thanh toán
          </span>
          <div class="text-2xl font-bold text-[#171717] font-mono tabular-nums">
            {{ formatVND(reading.total_amount) }}
          </div>
          <p class="text-xs text-[#737373]">
            Sản lượng: <strong class="text-[#171717] font-mono font-medium">{{ formatNumber(reading.kwh) }}&nbsp;kWh</strong>
          </p>
        </div>

        <!-- Các Kênh Thanh Toán -->
        <div class="space-y-2.5">
          <!-- Cổng PayOS VietQR -->
          <button
            type="button"
            @click="handlePayPayos"
            :disabled="loadingPayos || loadingVnpay || loadingSimulate"
            class="w-full p-3.5 rounded-md border border-[#EAEAEA] hover:border-[#171717] bg-white hover:bg-[#FAFAFA] text-left flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded bg-[#171717] text-white flex items-center justify-center font-bold text-[11px] font-mono">
                QR
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-medium text-[#171717] text-xs">
                    Cổng PayOS (VietQR)
                  </span>
                  <span class="px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#EDF3EC] text-[#245E2A] border border-[#D3E2D1]">
                    Khuyên dùng
                  </span>
                </div>
                <span class="text-[11px] text-[#737373] block">
                  Quét mã QR chuyển khoản liên ngân hàng tự động
                </span>
              </div>
            </div>
            <ExternalLink class="w-3.5 h-3.5 text-[#737373] group-hover:text-[#171717] shrink-0" aria-hidden="true" />
          </button>

          <!-- Cổng VNPAY -->
          <button
            type="button"
            @click="handlePayVnpay"
            :disabled="loadingPayos || loadingVnpay || loadingSimulate"
            class="w-full p-3.5 rounded-md border border-[#EAEAEA] hover:border-[#171717] bg-white hover:bg-[#FAFAFA] text-left flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded bg-[#F5F5F5] text-[#171717] border border-[#EAEAEA] flex items-center justify-center font-bold text-[10px] font-mono">
                VN
              </div>
              <div>
                <span class="font-medium text-[#171717] text-xs block">
                  Cổng VNPAY Sandbox
                </span>
                <span class="text-[11px] text-[#737373] block">
                  Thẻ ATM nội địa, Quét mã QR, Visa/Mastercard
                </span>
              </div>
            </div>
            <ExternalLink class="w-3.5 h-3.5 text-[#737373] group-hover:text-[#171717] shrink-0" aria-hidden="true" />
          </button>

          <!-- Mô Phỏng Nhanh -->
          <button
            type="button"
            @click="handleSimulate"
            :disabled="loadingVnpay || loadingSimulate"
            class="w-full p-3 rounded-md border border-dashed border-[#EAEAEA] hover:border-[#A3A3A3] hover:bg-[#FAFAFA] text-left flex items-center justify-between group transition-colors cursor-pointer text-xs"
          >
            <div class="flex items-center gap-2.5">
              <CheckCircle2 class="w-4 h-4 text-[#737373]" aria-hidden="true" />
              <div>
                <span class="font-medium text-[#737373] group-hover:text-[#171717] block">
                  Mô phỏng thanh toán nhanh (Test Bypass)
                </span>
                <span class="text-[11px] text-[#A3A3A3] block">
                  Gạch nợ tức thì không cần qua cổng ngân hàng
                </span>
              </div>
            </div>
          </button>
        </div>

        <div class="flex items-center justify-center gap-1.5 text-[11px] text-[#A3A3A3] pt-1">
          <ShieldCheck class="w-3.5 h-3.5 text-[#A3A3A3]" aria-hidden="true" />
          <span>Thanh toán bảo mật chuẩn SSL / TLS</span>
        </div>
      </div>
    </div>
  </div>
</template>
