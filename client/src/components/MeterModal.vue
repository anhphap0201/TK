<script setup>
import { ref, watch } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  meter: Object,
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  name: '',
  code: '',
  location: '',
  description: '',
});

const isSubmitting = ref(false);
const errorMsg = ref('');

watch(
  () => props.meter,
  (val) => {
    if (val) {
      form.value = {
        name: val.name || '',
        code: val.code || '',
        location: val.location || '',
        description: val.description || '',
      };
    } else {
      form.value = {
        name: '',
        code: '',
        location: '',
        description: '',
      };
    }
    errorMsg.value = '';
  },
  { immediate: true }
);

function handleSubmit() {
  if (!form.value.name.trim()) {
    errorMsg.value = 'Vui lòng nhập tên công tơ';
    return;
  }
  emit('save', { ...form.value });
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-bold text-slate-800 text-lg">
          {{ meter ? 'Sửa thông tin công tơ' : 'Thêm công tơ mới' }}
        </h3>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div v-if="errorMsg" class="p-3 text-xs text-rose-700 bg-rose-50 rounded-lg border border-rose-200">
          {{ errorMsg }}
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Tên công tơ <span class="text-rose-500">*</span></label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Ví dụ: Công tơ tổng, Phòng 101, Tầng 2"
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Mã công tơ (tuỳ chọn)</label>
          <input
            v-model="form.code"
            type="text"
            placeholder="Ví dụ: CT-01, PB0298"
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Vị trí lắp đặt</label>
          <input
            v-model="form.location"
            type="text"
            placeholder="Ví dụ: Hộp kỹ thuật tầng 1, Cột ngoài cổng"
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Ghi chú</label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Ghi chú thêm về mục đích sử dụng..."
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          ></textarea>
        </div>

        <div class="pt-2 flex justify-end gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-colors"
          >
            {{ meter ? 'Lưu thay đổi' : 'Thêm công tơ' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
