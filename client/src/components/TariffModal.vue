<script setup>
import { ref, watch } from 'vue';
import { X, RotateCcw } from 'lucide-vue-next';

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
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg border border-[#EAEAEA] w-full max-w-xl max-h-[90vh] overflow-y-auto">
      <div class="px-5 py-3.5 border-b border-[#EAEAEA] flex items-center justify-between sticky top-0 bg-white z-10">
        <div>
          <h3 id="tariff-modal-title" class="font-semibold text-[#171717] text-sm">
            Biểu Giá Điện Sinh Hoạt 6 Bậc
          </h3>
          <p class="text-xs text-[#737373]">
            Cấu hình đơn giá từng bậc và thuế GTGT
          </p>
        </div>
        <button
          @click="$emit('close')"
          aria-label="Đóng"
          class="p-1 rounded text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div class="p-5 space-y-4 text-xs">
        <!-- Thuế GTGT -->
        <div class="bg-[#FAFAFA] p-3.5 rounded-lg border border-[#EAEAEA] flex items-center justify-between">
          <div>
            <label for="vat-input" class="block font-medium text-[#171717]">
              Thuế Suất GTGT (VAT)
            </label>
            <p class="text-[11px] text-[#737373]">Tỷ lệ thuế tính trên tổng tiền điện trước thuế</p>
          </div>
          <div class="flex items-center gap-1.5">
            <input
              id="vat-input"
              v-model.number="localVat"
              type="number"
              min="0"
              max="20"
              step="1"
              class="w-16 px-2 py-1 rounded-md border border-[#EAEAEA] font-mono text-center font-medium text-xs bg-white text-[#171717] focus:border-[#171717] focus:outline-none"
            />
            <span class="font-medium text-[#737373]">%</span>
          </div>
        </div>

        <!-- Bảng 6 Bậc -->
        <div class="space-y-2.5">
          <span class="block font-medium text-[#171717] uppercase tracking-wider text-[11px]">
            Đơn giá từng bậc (VNĐ / kWh):
          </span>
          <div class="space-y-1.5">
            <div
              v-for="tier in localTariffs"
              :key="tier.tier"
              class="flex items-center justify-between gap-3 p-3 rounded-lg border border-[#EAEAEA] bg-white hover:bg-[#FAFAFA] transition-colors"
            >
              <div class="flex-1">
                <strong class="block text-[#171717] font-medium text-xs">{{ tier.name }}</strong>
                <span class="text-[11px] text-[#737373] font-mono">
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
                  class="w-24 px-2.5 py-1 rounded-md border border-[#EAEAEA] font-mono text-right font-medium text-xs bg-white text-[#171717] focus:border-[#171717] focus:outline-none"
                />
                <span class="text-[#737373]">đ/kWh</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-1">
          <button
            type="button"
            @click="resetToDefault"
            class="inline-flex items-center gap-1 text-xs text-[#737373] hover:text-[#171717] transition-colors cursor-pointer"
          >
            <RotateCcw class="w-3 h-3" aria-hidden="true" />
            <span>Khôi phục biểu giá chuẩn EVN</span>
          </button>
        </div>
      </div>

      <div class="px-5 py-3 border-t border-[#EAEAEA] flex justify-end gap-2 sticky bottom-0 bg-white">
        <button
          type="button"
          @click="$emit('close')"
          class="px-3 py-1.5 rounded-md border border-[#EAEAEA] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] text-xs font-medium cursor-pointer"
        >
          Hủy
        </button>
        <button
          type="button"
          @click="handleSave"
          :disabled="isSubmitting"
          class="px-4 py-1.5 rounded-md bg-[#171717] hover:bg-[#262626] text-white text-xs font-medium cursor-pointer"
        >
          Lưu biểu giá
        </button>
      </div>
    </div>
  </div>
</template>
