<script setup>
import { ref, watch } from 'vue';
import { X, RotateCcw, Sliders } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  tariffsData: Object,
});

const emit = defineEmits(['close', 'save']);

const localTariffs = ref([]);
const localVat = ref(8);
const isSubmitting = ref(false);

const DEFAULT_EVN_PRESETS = [
  { tier: 1, min_kwh: 0, max_kwh: 50, rate: 1893, name: "Bậc 1: Cho kWh từ 0 - 50" },
  { tier: 2, min_kwh: 50, max_kwh: 100, rate: 1956, name: "Bậc 2: Cho kWh từ 51 - 100" },
  { tier: 3, min_kwh: 100, max_kwh: 200, rate: 2271, name: "Bậc 3: Cho kWh từ 101 - 200" },
  { tier: 4, min_kwh: 200, max_kwh: 300, rate: 2860, name: "Bậc 4: Cho kWh từ 201 - 300" },
  { tier: 5, min_kwh: 300, max_kwh: 400, rate: 3197, name: "Bậc 5: Cho kWh từ 301 - 400" },
  { tier: 6, min_kwh: 400, max_kwh: null, rate: 3302, name: "Bậc 6: Cho kWh từ 401 trở lên" },
];

watch(
  () => props.tariffsData,
  (val) => {
    if (val && val.tariffs) {
      localTariffs.value = JSON.parse(JSON.stringify(val.tariffs));
      localVat.value = val.vat_rate !== undefined ? val.vat_rate : 8;
    }
  },
  { immediate: true, deep: true }
);

function resetToDefault() {
  if (confirm('Khôi phục biểu giá chuẩn 6 bậc EVN hiện hành?')) {
    localTariffs.value = JSON.parse(JSON.stringify(DEFAULT_EVN_PRESETS));
    localVat.value = 8;
  }
}

function handleSave() {
  emit('save', {
    tariffs: localTariffs.value,
    vat_rate: Number(localVat.value),
  });
}
</script>

<template>
  <div
    v-if="isOpen"
    role="dialog"
    aria-modal="true"
    aria-labelledby="tariff-modal-title"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
  >
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div>
          <h3 id="tariff-modal-title" class="font-extrabold text-slate-900 text-base">
            Biểu Giá Điện Sinh Hoạt 6 Bậc
          </h3>
          <p class="text-xs text-slate-400 font-medium">
            Cấu hình đơn giá từng bậc và thuế GTGT
          </p>
        </div>
        <button
          @click="$emit('close')"
          aria-label="Đóng"
          class="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
        >
          <X class="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div class="p-6 space-y-5 text-xs">
        <!-- Thuế GTGT -->
        <div class="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <label for="vat-input" class="block font-bold text-slate-800">
              Thuế Suất GTGT (VAT)
            </label>
            <p class="text-[11px] text-slate-400">Tỷ lệ thuế tính trên tổng tiền điện trước thuế</p>
          </div>
          <div class="flex items-center gap-1.5">
            <input
              id="vat-input"
              v-model.number="localVat"
              type="number"
              min="0"
              max="20"
              step="1"
              class="w-16 px-2.5 py-1.5 rounded-xl border border-slate-200 font-mono text-center font-bold text-sm bg-white focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
            />
            <span class="font-bold text-slate-600">%</span>
          </div>
        </div>

        <!-- Bảng 6 Bậc -->
        <div class="space-y-3">
          <span class="block font-bold text-slate-700 uppercase tracking-wider">
            Đơn giá từng bậc (VNĐ / kWh):
          </span>
          <div class="space-y-2">
            <div
              v-for="tier in localTariffs"
              :key="tier.tier"
              class="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div class="flex-1">
                <strong class="block text-slate-800 font-bold">{{ tier.name }}</strong>
                <span class="text-[11px] text-slate-400">
                  {{ tier.min_kwh }} - {{ tier.max_kwh ? tier.max_kwh + ' kWh' : 'trở lên' }}
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <label :for="'tier-rate-' + tier.tier" class="sr-only">Đơn giá bậc {{ tier.tier }}</label>
                <input
                  :id="'tier-rate-' + tier.tier"
                  v-model.number="tier.rate"
                  type="number"
                  min="0"
                  step="1"
                  class="w-24 px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-right font-bold text-xs bg-white focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
                />
                <span class="text-slate-400 font-medium">đ/kWh</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <button
            type="button"
            @click="resetToDefault"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0099ff] hover:text-[#0088ee] transition-colors cursor-pointer"
          >
            <RotateCcw class="w-3.5 h-3.5" aria-hidden="true" />
            <span>Khôi phục biểu giá chuẩn EVN</span>
          </button>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 sticky bottom-0 bg-white">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer"
        >
          Hủy
        </button>
        <button
          type="button"
          @click="handleSave"
          :disabled="isSubmitting"
          class="px-5 py-2 rounded-xl bg-[#0099ff] hover:bg-[#0088ee] text-white text-xs font-bold shadow-md shadow-[#0099ff]/20 cursor-pointer"
        >
          Lưu biểu giá
        </button>
      </div>
    </div>
  </div>
</template>
