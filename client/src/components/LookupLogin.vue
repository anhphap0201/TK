<script setup>
import { ref } from 'vue';
import { Search, Lock, AlertCircle, ArrowRight } from 'lucide-vue-next';
import { api } from '../api';

const emit = defineEmits(['login-success']);

const code = ref('');
const password = ref('');
const showPasswordInput = ref(false);
const errorMsg = ref('');
const loading = ref(false);

const quickCodes = [
  { code: 'KH0001', label: 'KH0001' },
  { code: 'KH0002', label: 'KH0002' },
  { code: 'KH0015', label: 'KH0015' },
  { code: 'KH0100', label: 'KH0100' },
];

function handleCodeInput() {
  errorMsg.value = '';
  if (code.value.trim().toLowerCase() === 'admin') {
    showPasswordInput.value = true;
  } else {
    showPasswordInput.value = false;
    password.value = '';
  }
}

function selectQuickCode(c) {
  code.value = c;
  handleCodeInput();
  if (c !== 'admin') {
    handleLookup();
  }
}

async function handleLookup() {
  if (!code.value.trim()) {
    errorMsg.value = 'Vui lòng nhập Mã khách hàng';
    return;
  }

  loading.value = true;
  errorMsg.value = '';

  try {
    const res = await api.login(code.value.trim(), password.value);
    if (res.requirePassword) {
      showPasswordInput.value = true;
      errorMsg.value = res.message;
      return;
    }

    emit('login-success', res);
  } catch (err) {
    errorMsg.value = err.message || 'Lỗi khi tra cứu thông tin';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto py-12 px-4 space-y-6">
    <!-- Thẻ Tra Cứu Tối Giản, Hiện Đại -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 space-y-6">
      <!-- Tiêu đề trang trọng, gọn gàng -->
      <div class="space-y-1.5 border-b border-slate-100 pb-5">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight">
          Tra cứu & đóng tiền điện
        </h2>
        <p class="text-xs text-slate-500">
          Nhập mã khách hàng để xem lịch sử tiêu thụ và thanh toán trực tuyến
        </p>
      </div>

      <!-- Thông báo lỗi nếu có -->
      <div
        v-if="errorMsg"
        role="alert"
        aria-live="polite"
        class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5"
      >
        <AlertCircle class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
        <span class="font-medium">{{ errorMsg }}</span>
      </div>

      <!-- Form tra cứu -->
      <form @submit.prevent="handleLookup" class="space-y-4">
        <div class="space-y-1.5">
          <label for="customer-code-input" class="block text-xs font-semibold text-slate-700">
            Mã khách hàng
          </label>
          <div class="relative">
            <input
              id="customer-code-input"
              v-model="code"
              @input="handleCodeInput"
              type="text"
              name="customerCode"
              autocomplete="off"
              spellcheck="false"
              placeholder="Ví dụ: KH0001, KH0002…"
              class="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 font-mono text-sm font-bold text-slate-900 bg-white focus-visible:border-[#0099ff] focus-visible:ring-2 focus-visible:ring-[#0099ff]/20 focus-visible:outline-none transition-all uppercase"
              required
            />
            <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Search class="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <p class="text-[11px] text-slate-400">
            Mã định danh in trên hóa đơn tiền điện hoặc hợp đồng dùng điện
          </p>
        </div>

        <!-- Mật khẩu Quản trị (Hiện khi gõ 'admin') -->
        <div v-if="showPasswordInput" class="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <label for="admin-password-input" class="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <Lock class="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            Mật khẩu Quản trị viên
          </label>
          <input
            id="admin-password-input"
            v-model="password"
            type="password"
            name="adminPassword"
            autocomplete="current-password"
            placeholder="Nhập mật khẩu (Mặc định: admin123)"
            class="w-full px-3.5 py-2 rounded-lg border border-slate-200 font-mono text-xs font-semibold bg-white focus-visible:border-[#0099ff] focus-visible:ring-2 focus-visible:ring-[#0099ff]/20 focus-visible:outline-none"
          />
        </div>

        <!-- Nút Tra Cứu -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 px-4 rounded-xl bg-[#0099ff] hover:bg-[#0088ee] active:scale-[0.99] text-white font-semibold text-xs tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff]/40 focus-visible:outline-none shadow-xs"
        >
          <span>{{ loading ? 'Đang kiểm tra…' : (showPasswordInput ? 'Đăng nhập Quản trị' : 'Tra cứu hóa đơn') }}</span>
          <ArrowRight class="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </form>

      <!-- Mã Mẫu Thử Nghiệm -->
      <div class="pt-4 border-t border-slate-100 space-y-2">
        <span class="block text-[11px] font-semibold text-slate-400">
          Mã thử nghiệm nhanh:
        </span>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="item in quickCodes"
            :key="item.code"
            type="button"
            @click="selectQuickCode(item.code)"
            class="px-2.5 py-1 rounded-lg border text-xs font-mono font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none bg-slate-50 text-slate-600 border-slate-200 hover:bg-[#0099ff]/10 hover:border-[#0099ff]/30 hover:text-[#0099ff]"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
