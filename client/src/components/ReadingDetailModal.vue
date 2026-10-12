<script setup>
import { computed } from 'vue';
import { X, Printer, ShieldCheck, CheckCircle2 } from 'lucide-vue-next';
import { formatVND, formatNumber } from '../api';
import TierBreakdownTable from './TierBreakdownTable.vue';

const props = defineProps({
  isOpen: Boolean,
  reading: Object,
  meterName: String,
});

defineEmits(['close']);

const calculationObj = computed(() => {
  if (!props.reading) return null;
  return {
    kwh: props.reading.kwh,
    subtotal: props.reading.subtotal,
    vatRate: props.reading.vat_rate,
    vatAmount: props.reading.vat_amount,
    total: props.reading.total_amount,
    tiers: props.reading.tier_details || [],
  };
});

function handlePrint() {
  window.print();
}
</script>

<template>
  <div
    v-if="isOpen && reading"
    role="dialog"
    aria-modal="true"
    aria-labelledby="detail-invoice-title"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs print:p-0 print:bg-white"
  >
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-slate-100 print:border-none print:shadow-none print:max-h-full">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 print:hidden">
        <div>
          <h3 id="detail-invoice-title" class="font-extrabold text-slate-900 text-base">
            Chi Tiết Hóa Đơn Kỳ {{ reading.period }}
          </h3>
          <p class="text-xs text-slate-400">Công tơ: <strong class="text-slate-700 font-mono">{{ meterName || 'CT-01' }}</strong></p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="handlePrint"
            aria-label="In phiếu"
            class="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
          >
            <Printer class="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            @click="$emit('close')"
            aria-label="Đóng"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
          >
            <X class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div class="p-6 sm:p-8 space-y-6">
        <!-- Tóm tắt chỉ số -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-center text-xs">
          <div>
            <span class="block font-semibold text-slate-400 text-[11px] uppercase">Ngày chốt</span>
            <span class="font-bold text-slate-800 font-mono text-sm">{{ reading.reading_date }}</span>
          </div>
          <div>
            <span class="block font-semibold text-slate-400 text-[11px] uppercase">Chỉ số cũ</span>
            <span class="font-bold text-slate-800 font-mono text-sm tabular-nums">{{ formatNumber(reading.prev_index) }}</span>
          </div>
          <div>
            <span class="block font-semibold text-slate-400 text-[11px] uppercase">Chỉ số mới</span>
            <span class="font-bold text-slate-800 font-mono text-sm tabular-nums">{{ formatNumber(reading.current_index) }}</span>
          </div>
          <div>
            <span class="block font-bold text-[#0099ff] text-[11px] uppercase">Điện tiêu thụ</span>
            <span class="font-extrabold text-[#0099ff] font-mono text-sm tabular-nums">{{ formatNumber(reading.kwh) }}&nbsp;kWh</span>
          </div>
        </div>

        <!-- Bảng 6 Bậc -->
        <div v-if="calculationObj">
          <span class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Bảng kê chi phí theo biểu giá 6 bậc EVN
          </span>
          <TierBreakdownTable :calculation="calculationObj" />
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Hóa đơn điện tử định dạng chuẩn</span>
          <span class="font-mono">
            Trạng thái: <strong :class="reading.payment_status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'">{{ reading.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán' }}</strong>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
