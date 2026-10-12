<script setup>
import { ref, computed } from 'vue';
import { Calculator } from 'lucide-vue-next';
import { formatVND, formatNumber } from '../api';
import TierBreakdownTable from './TierBreakdownTable.vue';

const DEFAULT_TARIFFS = [
  { tier: 1, min_kwh: 0, max_kwh: 50, rate: 1893, name: "Bậc 1 (0 - 50 kWh)" },
  { tier: 2, min_kwh: 50, max_kwh: 100, rate: 1956, name: "Bậc 2 (51 - 100 kWh)" },
  { tier: 3, min_kwh: 100, max_kwh: 200, rate: 2271, name: "Bậc 3 (101 - 200 kWh)" },
  { tier: 4, min_kwh: 200, max_kwh: 300, rate: 2860, name: "Bậc 4 (201 - 300 kWh)" },
  { tier: 5, min_kwh: 300, max_kwh: 400, rate: 3197, name: "Bậc 5 (301 - 400 kWh)" },
  { tier: 6, min_kwh: 400, max_kwh: null, rate: 3302, name: "Bậc 6 (Từ 401 kWh trở lên)" },
];

const kwhInput = ref(200);
const quickPresets = [50, 100, 150, 200, 300, 450];

const calculation = computed(() => {
  const safeKwh = Math.max(0, parseFloat(kwhInput.value) || 0);
  let remaining = safeKwh;
  let subtotal = 0;

  const tiers = DEFAULT_TARIFFS.map((t) => {
    let tierKwh = 0;
    if (remaining > 0) {
      if (t.max_kwh === null || t.max_kwh === undefined) {
        tierKwh = remaining;
      } else {
        const cap = t.max_kwh - t.min_kwh;
        tierKwh = Math.min(remaining, cap);
      }
      remaining -= tierKwh;
    }
    const amount = Math.round(tierKwh * t.rate);
    subtotal += amount;
    return {
      tier: t.tier,
      name: t.name,
      min_kwh: t.min_kwh,
      max_kwh: t.max_kwh,
      rate: t.rate,
      kwh: Number(tierKwh.toFixed(2)),
      amount,
    };
  });

  const vatRate = 8;
  const vatAmount = Math.round((subtotal * vatRate) / 100);
  const total = subtotal + vatAmount;

  return {
    kwh: safeKwh,
    subtotal,
    vatRate,
    vatAmount,
    total,
    tiers,
  };
});
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-100 pb-4">
      <h3 class="font-extrabold text-slate-900 text-base">
        Công Cụ Tính Nhanh Tiền Điện Bậc Thang
      </h3>
      <p class="text-xs text-slate-400 mt-0.5">
        Ước tính số tiền thanh toán tức thì theo biểu giá 6 bậc lũy kế EVN hiện hành (VAT 8%)
      </p>
    </div>

    <!-- Thẻ Tổng Tiền Nổi Bật Tức Thì -->
    <div class="bg-[#0099ff]/10 border border-[#0099ff]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Ước tính thành tiền</span>
        <span class="text-xs text-slate-500">Đã bao gồm tiền điện sinh hoạt và 8% thuế VAT</span>
      </div>
      <div class="text-right">
        <span class="text-3xl font-black text-[#0099ff] font-mono tabular-nums tracking-tight block">
          {{ formatVND(calculation.total) }}
        </span>
      </div>
    </div>

    <!-- Ô nhập kWh và presets -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
      <div>
        <label for="quick-kwh-input" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Nhập điện năng tiêu thụ (kWh)
        </label>
        <div class="relative">
          <input
            id="quick-kwh-input"
            v-model.number="kwhInput"
            type="number"
            min="0"
            step="1"
            class="w-full pl-4 pr-16 py-3 rounded-2xl border border-slate-200 font-mono text-2xl font-black text-slate-900 bg-white focus-visible:ring-3 focus-visible:ring-[#0099ff]/20 focus-visible:border-[#0099ff] focus-visible:outline-none tabular-nums"
            placeholder="0"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
            kWh
          </span>
        </div>
      </div>

      <div>
        <span class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Mức tiêu thụ phổ biến:
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in quickPresets"
            :key="preset"
            type="button"
            @click="kwhInput = preset"
            :class="kwhInput === preset ? 'bg-[#0099ff] text-white font-bold shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'"
            class="px-3.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
          >
            {{ preset }}&nbsp;kWh
          </button>
        </div>
      </div>
    </div>

    <!-- Bảng phân rã 6 bậc -->
    <div class="pt-2">
      <TierBreakdownTable :calculation="calculation" />
    </div>
  </div>
</template>
