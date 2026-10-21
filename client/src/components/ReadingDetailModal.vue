<script setup>
import { computed } from 'vue';
import { X, Printer } from 'lucide-vue-next';
import { formatNumber } from '../api';
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
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 print:p-0 print:bg-white"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg border border-[#EAEAEA] w-full max-w-2xl max-h-[92vh] overflow-y-auto print:border-none print:max-h-full">
      <!-- Header -->
      <div class="px-5 py-3.5 border-b border-[#EAEAEA] flex items-center justify-between sticky top-0 bg-white z-10 print:hidden">
        <div>
          <h3 id="detail-invoice-title" class="font-semibold text-[#171717] text-sm">
            Chi Tiết Hóa Đơn Kỳ {{ reading.period }}
          </h3>
          <p class="text-[11px] text-[#737373]">Công tơ: <strong class="text-[#171717] font-mono">{{ meterName || 'CT-01' }}</strong></p>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            @click="handlePrint"
            aria-label="In phiếu"
            class="p-1.5 rounded border border-[#EAEAEA] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
          >
            <Printer class="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            @click="$emit('close')"
            aria-label="Đóng"
            class="p-1.5 rounded text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div class="p-5 sm:p-6 space-y-5">
        <!-- Tóm tắt chỉ số -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FAFAFA] p-3.5 rounded-lg border border-[#EAEAEA] text-center text-xs">
          <div>
            <span class="block font-medium text-[#737373] text-[10px] uppercase tracking-wider">Ngày chốt</span>
            <span class="font-mono font-medium text-[#171717] text-xs">{{ reading.reading_date }}</span>
          </div>
          <div>
            <span class="block font-medium text-[#737373] text-[10px] uppercase tracking-wider">Chỉ số cũ</span>
            <span class="font-mono text-[#737373] text-xs tabular-nums">{{ formatNumber(reading.prev_index) }}</span>
          </div>
          <div>
            <span class="block font-medium text-[#737373] text-[10px] uppercase tracking-wider">Chỉ số mới</span>
            <span class="font-mono font-medium text-[#171717] text-xs tabular-nums">{{ formatNumber(reading.current_index) }}</span>
          </div>
          <div>
            <span class="block font-medium text-[#171717] text-[10px] uppercase tracking-wider">Điện tiêu thụ</span>
            <span class="font-mono font-semibold text-[#171717] text-xs tabular-nums">{{ formatNumber(reading.kwh) }}&nbsp;kWh</span>
          </div>
        </div>

        <!-- Bảng 6 Bậc -->
        <div v-if="calculationObj">
          <span class="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-2">
            Bảng kê chi phí theo biểu giá 6 bậc EVN
          </span>
          <TierBreakdownTable :calculation="calculationObj" />
        </div>

        <div class="pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-xs text-[#737373]">
          <span>Hóa đơn điện tử EVN định dạng chuẩn</span>
          <span class="font-mono text-xs">
            Trạng thái:
            <strong
              :class="reading.payment_status === 'PAID' ? 'text-[#245E2A]' : 'text-[#946300]'"
            >
              {{ reading.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán' }}
            </strong>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
