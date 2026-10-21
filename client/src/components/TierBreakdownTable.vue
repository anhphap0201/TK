<script setup>
import { computed } from 'vue';
import { formatVND, formatNumber } from '../api';

const props = defineProps({
  calculation: {
    type: Object,
    required: true,
  },
});

const tierColors = [
  'bg-[#EDF3EC] text-[#245E2A] border-[#D3E2D1]',
  'bg-[#EDF5FD] text-[#1E4E8C] border-[#CCE0F8]',
  'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]',
  'bg-[#FDF6E7] text-[#946300] border-[#FAECC8]',
  'bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]',
  'bg-[#FDEBEC] text-[#9F2F2D] border-[#F8D0D0]',
];
</script>

<template>
  <div v-if="calculation && calculation.tiers" class="space-y-3">
    <!-- Bảng Phân Tích 6 Bậc Minimalist -->
    <div class="overflow-x-auto rounded-lg border border-[#EAEAEA] bg-white">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#FAFAFA] border-b border-[#EAEAEA] text-[#737373] text-[11px] font-medium uppercase tracking-wider">
          <tr>
            <th class="px-4 py-2.5 font-medium">Bậc giá</th>
            <th class="px-3 py-2.5 text-right font-medium">Đơn giá (đ/kWh)</th>
            <th class="px-3 py-2.5 text-right font-medium">Sản lượng (kWh)</th>
            <th class="px-4 py-2.5 text-right font-medium">Thành tiền (VNĐ)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#F0F0F0]">
          <tr
            v-for="(tier, idx) in calculation.tiers"
            :key="tier.tier"
            :class="tier.kwh > 0 ? 'bg-white' : 'text-[#A3A3A3]'"
            class="hover:bg-[#FAFAFA] transition-colors"
          >
            <td class="px-4 py-2.5">
              <span
                class="inline-flex items-center px-1.5 py-0.2 rounded text-[11px] font-medium border"
                :class="tierColors[idx] || 'bg-[#F5F5F5] text-[#171717] border-[#EAEAEA]'"
              >
                {{ tier.name }}
              </span>
            </td>
            <td class="px-3 py-2.5 text-right font-mono text-[#737373] tabular-nums">
              {{ formatNumber(tier.rate) }}&nbsp;đ
            </td>
            <td class="px-3 py-2.5 text-right font-mono tabular-nums" :class="tier.kwh > 0 ? 'font-medium text-[#171717]' : 'text-[#A3A3A3]'">
              {{ formatNumber(tier.kwh) }}
            </td>
            <td class="px-4 py-2.5 text-right font-mono tabular-nums" :class="tier.amount > 0 ? 'font-medium text-[#171717]' : 'text-[#A3A3A3]'">
              {{ formatVND(tier.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Khối Tổng Tiền & Thuế VAT -->
    <div class="bg-[#FAFAFA] rounded-lg p-4 border border-[#EAEAEA] space-y-2 text-xs">
      <div class="flex justify-between items-center text-[#737373]">
        <span>Tổng điện năng tiêu thụ:</span>
        <strong class="text-[#171717] font-mono tabular-nums">{{ formatNumber(calculation.kwh) }}&nbsp;kWh</strong>
      </div>
      <div class="flex justify-between items-center text-[#737373]">
        <span>Tiền điện trước thuế:</span>
        <strong class="text-[#171717] font-mono tabular-nums">{{ formatVND(calculation.subtotal) }}</strong>
      </div>
      <div class="flex justify-between items-center text-[#737373]">
        <span>Thuế GTGT (VAT {{ calculation.vatRate }}%):</span>
        <strong class="text-[#171717] font-mono tabular-nums">{{ formatVND(calculation.vatAmount) }}</strong>
      </div>
      <div class="pt-2.5 border-t border-[#EAEAEA] flex justify-between items-center text-xs">
        <span class="font-semibold text-[#171717]">Tổng cộng thanh toán:</span>
        <span class="font-bold text-[#171717] text-lg font-mono tabular-nums">{{ formatVND(calculation.total) }}</span>
      </div>
    </div>
  </div>
</template>
