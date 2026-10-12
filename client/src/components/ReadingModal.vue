<script setup>
import { ref, watch, computed } from 'vue';
import { X, Sparkles, AlertCircle } from 'lucide-vue-next';
import { api, formatVND, formatNumber } from '../api';
import TierBreakdownTable from './TierBreakdownTable.vue';

const props = defineProps({
  isOpen: Boolean,
  reading: Object,
  meters: {
    type: Array,
    default: () => [],
  },
  defaultMeterId: [Number, String],
  lastIndex: [Number, String],
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  meter_id: '',
  reading_date: '',
  period: '',
  prev_index: '',
  current_index: '',
  note: '',
});

const preview = ref(null);
const errorMsg = ref('');
const isSubmitting = ref(false);

const computedKwh = computed(() => {
  const p = parseFloat(form.value.prev_index) || 0;
  const c = parseFloat(form.value.current_index) || 0;
  return c >= p ? c - p : 0;
});

const isInvalidIndex = computed(() => {
  if (form.value.prev_index === '' || form.value.current_index === '') return false;
  return parseFloat(form.value.current_index) < parseFloat(form.value.prev_index);
});

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      if (props.reading) {
        form.value = {
          meter_id: props.reading.meter_id,
          reading_date: props.reading.reading_date,
          period: props.reading.period,
          prev_index: props.reading.prev_index,
          current_index: props.reading.current_index,
          note: props.reading.note || '',
        };
      } else {
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = today.substring(0, 7);
        form.value = {
          meter_id: props.defaultMeterId || (props.meters[0]?.id ?? ''),
          reading_date: today,
          period: currentMonth,
          prev_index: props.lastIndex !== undefined && props.lastIndex !== null ? props.lastIndex : 0,
          current_index: '',
          note: '',
        };
      }
      errorMsg.value = '';
      fetchPreview();
    }
  }
);

watch(
  () => [form.value.prev_index, form.value.current_index],
  () => {
    fetchPreview();
  }
);

async function fetchPreview() {
  if (isInvalidIndex.value) {
    preview.value = null;
    return;
  }
  const kwh = computedKwh.value;
  try {
    const res = await api.previewCalculation({ kwh });
    preview.value = res;
  } catch (err) {
    console.error('Preview error:', err);
  }
}

function handleDateChange() {
  if (form.value.reading_date) {
    form.value.period = form.value.reading_date.substring(0, 7);
  }
}

function handleSubmit() {
  if (!form.value.meter_id) {
    errorMsg.value = 'Vui lòng chọn công tơ';
    return;
  }
  if (!form.value.reading_date) {
    errorMsg.value = 'Vui lòng chọn ngày chốt số';
    return;
  }
  if (form.value.prev_index === '' || form.value.current_index === '') {
    errorMsg.value = 'Vui lòng nhập đầy đủ chỉ số cũ và mới';
    return;
  }
  if (isInvalidIndex.value) {
    errorMsg.value = 'Chỉ số mới không được nhỏ hơn chỉ số cũ';
    return;
  }

  emit('save', { ...form.value });
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div>
          <h3 class="font-bold text-slate-800 text-lg">
            {{ reading ? 'Cập nhật chỉ số điện' : 'Ghi chỉ số điện mới' }}
          </h3>
          <p class="text-xs text-slate-500">Tự động tính toán chi phí theo bậc thang EVN</p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div v-if="errorMsg" class="p-3 text-xs text-rose-700 bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0" />
          <span>{{ errorMsg }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Công tơ <span class="text-rose-500">*</span></label>
            <select
              v-model="form.meter_id"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              required
            >
              <option disabled value="">-- Chọn công tơ --</option>
              <option v-for="m in meters" :key="m.id" :value="m.id">
                {{ m.name }} {{ m.code ? `(${m.code})` : '' }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Kỳ thanh toán</label>
            <input
              v-model="form.period"
              type="month"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Ngày chốt số <span class="text-rose-500">*</span></label>
            <input
              v-model="form.reading_date"
              @change="handleDateChange"
              type="date"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Ghi chú (tuỳ chọn)</label>
            <input
              v-model="form.note"
              type="text"
              placeholder="VD: Tháng dùng điều hoà nhiều..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            />
          </div>
        </div>

        <!-- Khối nhập chỉ số -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Chỉ số cũ</label>
              <input
                v-model.number="form.prev_index"
                type="number"
                step="any"
                min="0"
                placeholder="0"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-base font-semibold bg-white"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Chỉ số mới</label>
              <input
                v-model.number="form.current_index"
                type="number"
                step="any"
                min="0"
                placeholder="Nhập số..."
                class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-base font-semibold bg-white"
                required
              />
            </div>

            <div class="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex flex-col justify-center">
              <span class="text-xs font-medium text-blue-700">Điện năng tiêu thụ</span>
              <span class="text-xl font-bold font-mono text-blue-900">
                {{ formatNumber(computedKwh) }} <span class="text-xs font-normal text-blue-700">kWh</span>
              </span>
            </div>
          </div>

          <div v-if="isInvalidIndex" class="mt-2 text-xs text-rose-600 font-medium">
            ⚠️ Chỉ số mới phải lớn hơn hoặc bằng chỉ số cũ!
          </div>
        </div>

        <!-- Xem trước kết quả tính toán theo 6 bậc EVN -->
        <div v-if="preview" class="space-y-3">
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">
            <Sparkles class="w-4 h-4 text-amber-500" />
            <span>Chi tiết tính toán bậc thang EVN</span>
          </div>
          <TierBreakdownTable :calculation="preview" />
        </div>

        <div class="pt-2 flex justify-end gap-3 sticky bottom-0 bg-white py-2 border-t border-slate-100">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || isInvalidIndex"
            class="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 shadow-sm shadow-blue-500/20 transition-colors"
          >
            {{ reading ? 'Cập nhật' : 'Lưu chỉ số' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
