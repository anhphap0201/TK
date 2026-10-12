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
  'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  'bg-blue-50 text-blue-700 border-blue-200/60',
  'bg-cyan-50 text-cyan-700 border-cyan-200/60',
  'bg-amber-50 text-amber-700 border-amber-200/60',
  'bg-orange-50 text-orange-700 border-orange-200/60',
  'bg-rose-50 text-rose-700 border-rose-200/60',
];
</script>

<template>
  <div v-if="calculation && calculation.tiers" class="space-y-4">
    <!-- Bảng Phân Tích 6 Bậc Hiện Đại -->
    <div class="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
          <tr>
            <th class="px-5 py-3">Bậc giá</th>
            <th class="px-4 py-3 text-right">Đơn giá (đ/kWh)</th>
            <th class="px-4 py-3 text-right">Sản lượng (kWh)</th>
            <th class="px-5 py-3 text-right">Thành tiền (VNĐ)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="(tier, idx) in calculation.tiers"
            :key="tier.tier"
            :class="tier.kwh > 0 ? 'bg-[#0099ff]/3' : 'text-slate-400'"
            class="hover:bg-slate-50/80 transition-colors"
          >
            <td class="px-5 py-3">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold border"
                :class="tierColors[idx] || 'bg-slate-50 text-slate-700 border-slate-200'"
              >
                {{ tier.name }}
              </span>
            </td>
            <td class="px-4 py-3 text-right font-mono font-medium text-slate-600 tabular-nums">
              {{ formatNumber(tier.rate) }}&nbsp;đ
            </td>
            <td class="px-4 py-3 text-right font-mono font-bold tabular-nums" :class="tier.kwh > 0 ? 'text-slate-900' : 'text-slate-400'">
              {{ formatNumber(tier.kwh) }}
            </td>
            <td class="px-5 py-3 text-right font-mono font-bold tabular-nums" :class="tier.amount > 0 ? 'text-slate-900' : 'text-slate-400'">
              {{ formatVND(tier.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Khối Tổng Tiền & Thuế VAT -->
    <div class="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-2.5 text-xs">
      <div class="flex justify-between items-center text-slate-500">
        <span>Tổng điện năng tiêu thụ:</span>
        <strong class="text-slate-900 font-mono text-sm tabular-nums">{{ formatNumber(calculation.kwh) }}&nbsp;kWh</strong>
      </div>
      <div class="flex justify-between items-center text-slate-500">
        <span>Tiền điện trước thuế:</span>
        <strong class="text-slate-800 font-mono tabular-nums">{{ formatVND(calculation.subtotal) }}</strong>
      </div>
      <div class="flex justify-between items-center text-slate-500">
        <span>Thuế GTGT (VAT {{ calculation.vatRate }}%):</span>
        <strong class="text-slate-800 font-mono tabular-nums">{{ formatVND(calculation.vatAmount) }}</strong>
      </div>
      <div class="pt-3 border-t border-slate-200/80 flex justify-between items-center text-sm">
        <span class="font-extrabold text-slate-900">Tổng cộng thanh toán:</span>
        <span class="font-black text-[#0099ff] text-xl font-mono tabular-nums">{{ formatVND(calculation.total) }}</span>
      </div>
    </div>
  </div>
</template>
