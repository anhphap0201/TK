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

const loadingVnpay = ref(false);
const loadingSimulate = ref(false);
const errorMsg = ref('');

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
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
  >
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-2xl bg-[#0099ff]/10 text-[#0099ff] flex items-center justify-center">
            <CreditCard class="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 id="payment-modal-title" class="font-extrabold text-slate-900 text-base">
              Thanh Toán Tiền Điện
            </h3>
            <p class="text-xs text-slate-400 font-mono">Kỳ {{ reading.period }} • {{ customer?.customer_code }}</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          aria-label="Đóng cửa sổ"
          class="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
        >
          <X class="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div class="p-6 space-y-5">
        <div v-if="errorMsg" role="alert" class="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl">
          {{ errorMsg }}
        </div>

        <!-- Khối Số Tiền Hiện Đại -->
        <div class="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 text-center space-y-1">
          <span class="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Tổng tiền thanh toán
          </span>
          <div class="text-3xl font-extrabold text-[#0099ff] font-mono tabular-nums tracking-tight">
            {{ formatVND(reading.total_amount) }}
          </div>
          <p class="text-xs text-slate-400">
            Điện năng tiêu thụ: <strong class="text-slate-700 font-mono">{{ formatNumber(reading.kwh) }}&nbsp;kWh</strong>
          </p>
        </div>

        <!-- Các Kênh Thanh Toán -->
        <div class="space-y-3">
          <!-- Cổng VNPAY -->
          <button
            type="button"
            @click="handlePayVnpay"
            :disabled="loadingVnpay || loadingSimulate"
            class="w-full p-4 rounded-2xl border-2 border-[#0099ff] bg-white hover:bg-[#0099ff]/5 text-left flex items-center justify-between group transition-all cursor-pointer focus-visible:ring-3 focus-visible:ring-[#0099ff]/30 focus-visible:outline-none"
          >
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-[#0099ff] text-white flex items-center justify-center font-extrabold text-xs shadow-md shadow-[#0099ff]/20">
                VNPAY
              </div>
              <div>
                <span class="block font-bold text-slate-900 text-sm group-hover:text-[#0099ff] transition-colors">
                  Cổng VNPAY Sandbox
                </span>
                <span class="text-xs text-slate-400">
                  Thẻ ATM nội địa, Quét mã QR, Visa/Mastercard
                </span>
              </div>
            </div>
            <ExternalLink class="w-4 h-4 text-[#0099ff] shrink-0" aria-hidden="true" />
          </button>

          <!-- Mô Phỏng Nhanh -->
          <button
            type="button"
            @click="handleSimulate"
            :disabled="loadingVnpay || loadingSimulate"
            class="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left flex items-center justify-between group transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" aria-hidden="true" />
              </div>
              <div>
                <span class="block font-bold text-slate-800 text-xs group-hover:text-emerald-700 transition-colors">
                  Mô phỏng thanh toán nhanh (Test Bypass)
                </span>
                <span class="text-[11px] text-slate-400">
                  Gạch nợ tức thì không cần qua cổng ngân hàng
                </span>
              </div>
            </div>
            <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </button>
        </div>

        <div class="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck class="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>Thanh toán an toàn, mã hóa 256-bit SSL</span>
        </div>
      </div>
    </div>
  </div>
</template>
