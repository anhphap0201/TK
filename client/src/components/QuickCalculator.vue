<script setup>
import { ref, computed } from 'vue';
import { formatVND } from '../api';
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
  <div class="space-y-5">
    <div class="border-b border-[#EAEAEA] pb-3">
      <h3 class="font-semibold text-[#171717] text-base">
        Công Cụ Tính Nhanh Tiền Điện Bậc Thang
      </h3>
      <p class="text-xs text-[#737373] mt-0.5">
        Ước tính số tiền thanh toán theo biểu giá 6 bậc lũy kế EVN hiện hành (VAT 8%)
      </p>
    </div>

    <!-- Thẻ Tổng Tiền Nổi Bật Tức Thì -->
    <div class="bg-white border border-[#EAEAEA] rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <span class="text-xs font-medium text-[#737373] uppercase tracking-wider block">Ước tính thành tiền</span>
        <span class="text-xs text-[#A3A3A3]">Đã bao gồm tiền điện sinh hoạt và 8% thuế VAT</span>
      </div>
      <div class="text-right">
        <span class="text-2xl font-bold text-[#171717] font-mono tabular-nums tracking-tight block">
          {{ formatVND(calculation.total) }}
        </span>
      </div>
    </div>

    <!-- Ô nhập kWh và presets -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-[#FAFAFA] p-4 rounded-lg border border-[#EAEAEA]">
      <div>
        <label for="quick-kwh-input" class="block text-xs font-medium text-[#171717] uppercase tracking-wider mb-1.5">
          Nhập sản lượng tiêu thụ (kWh)
        </label>
        <div class="relative">
          <input
            id="quick-kwh-input"
            v-model.number="kwhInput"
            type="number"
            min="0"
            step="1"
            class="w-full pl-3 pr-14 py-2 rounded-md border border-[#EAEAEA] font-mono text-xl font-bold text-[#171717] bg-white focus:border-[#171717] focus:outline-none tabular-nums"
            placeholder="0"
          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-[#737373]">
            kWh
          </span>
        </div>
      </div>

      <div>
        <span class="block text-xs font-medium text-[#171717] uppercase tracking-wider mb-2">
          Mức tiêu thụ phổ biến:
        </span>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="preset in quickPresets"
            :key="preset"
            type="button"
            @click="kwhInput = preset"
            :class="kwhInput === preset ? 'bg-[#171717] text-white font-medium border-[#171717]' : 'bg-white text-[#171717] border-[#EAEAEA] hover:bg-[#FAFAFA]'"
            class="px-2.5 py-1 rounded-md border text-xs font-mono transition-colors cursor-pointer"
          >
            {{ preset }}&nbsp;kWh
          </button>
        </div>
      </div>
    </div>

    <!-- Bảng phân rã 6 bậc -->
    <div class="pt-1">
      <TierBreakdownTable :calculation="calculation" />
    </div>
  </div>
</template>
