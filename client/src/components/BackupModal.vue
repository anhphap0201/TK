<script setup>
import { ref } from 'vue';
import { X, Download, Upload, AlertTriangle, CheckCircle2 } from 'lucide-vue-next';
import { api } from '../api';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'restored']);

const fileInputRef = ref(null);
const isImporting = ref(false);
const message = ref('');
const error = ref('');

function downloadBackup() {
  window.open(api.exportDataUrl(), '_blank');
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      isImporting.value = true;
      error.value = '';
      message.value = '';
      const json = JSON.parse(e.target.result);

      await api.importData(json);
      message.value = 'Khôi phục dữ liệu thành công!';
      setTimeout(() => {
        emit('restored');
      }, 1000);
    } catch (err) {
      error.value = err.message || 'Lỗi khi đọc file sao lưu';
    } finally {
      isImporting.value = false;
      if (fileInputRef.value) fileInputRef.value.value = '';
    }
  };
  reader.readAsText(file);
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-800 text-lg">Sao lưu & Khôi phục</h3>
          <p class="text-xs text-slate-500">Quản lý và chuyển đổi dữ liệu dạng file JSON</p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-5">
        <div v-if="message" class="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 shrink-0" />
          <span>{{ message }}</span>
        </div>

        <div v-if="error" class="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
          <AlertTriangle class="w-4 h-4 shrink-0" />
          <span>{{ error }}</span>
        </div>

        <!-- Xuất file -->
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
          <h4 class="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Download class="w-4 h-4 text-blue-600" />
            Sao lưu dữ liệu (Export)
          </h4>
          <p class="text-xs text-slate-500">
            Tải toàn bộ danh sách công tơ, chỉ số và lịch sử các tháng về máy tính dưới định dạng JSON.
          </p>
          <button
            @click="downloadBackup"
            class="mt-2 w-full py-2 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-2xs flex items-center justify-center gap-2"
          >
            <Download class="w-4 h-4" />
            Tải về file sao lưu (.json)
          </button>
        </div>

        <!-- Nhập file -->
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
          <h4 class="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Upload class="w-4 h-4 text-amber-600" />
            Khôi phục dữ liệu (Import)
          </h4>
          <p class="text-xs text-slate-500">
            Tải lên file JSON sao lưu trước đó để khôi phục lại toàn bộ dữ liệu.
          </p>
          <input
            ref="fileInputRef"
            type="file"
            accept=".json,application/json"
            @change="handleFileChange"
            class="hidden"
          />
          <button
            @click="fileInputRef?.click()"
            :disabled="isImporting"
            class="mt-2 w-full py-2 px-4 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors shadow-2xs flex items-center justify-center gap-2"
          >
            <Upload class="w-4 h-4" />
            {{ isImporting ? 'Đang khôi phục...' : 'Chọn file JSON để khôi phục' }}
          </button>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-slate-100 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>
