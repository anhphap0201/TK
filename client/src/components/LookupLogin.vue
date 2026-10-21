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
  <div class="max-w-md mx-auto py-10 px-4 space-y-4">
    <!-- Card Flat UI -->
    <div class="bg-white rounded-lg border border-[#EAEAEA] p-6 sm:p-7 space-y-5">
      <!-- Tiêu đề Flat Minimal -->
      <div class="space-y-1 border-b border-[#EAEAEA] pb-4">
        <h2 class="text-base font-semibold text-neutral-900 tracking-tight">
          Tra cứu & thanh toán tiền điện
        </h2>
        <p class="text-xs text-neutral-500">
          Nhập mã định danh khách hàng trên hóa đơn để xem chi tiết
        </p>
      </div>

      <!-- Thông báo lỗi nếu có -->
      <div
        v-if="errorMsg"
        role="alert"
        aria-live="polite"
        class="p-3 rounded-md bg-[#FDEBEC] border border-[#F8D0D0] text-[#9F2F2D] text-xs flex items-start gap-2"
      >
        <AlertCircle class="w-4 h-4 text-[#9F2F2D] shrink-0 mt-0.5" aria-hidden="true" />
        <span class="font-medium">{{ errorMsg }}</span>
      </div>

      <!-- Form tra cứu -->
      <form @submit.prevent="handleLookup" class="space-y-4">
        <div class="space-y-1.5">
          <label for="customer-code-input" class="block text-xs font-medium text-neutral-700">
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
              placeholder="VD: KH0001, KH0002..."
              class="w-full pl-3 pr-9 py-2 rounded-md border border-[#EAEAEA] font-mono text-xs font-medium text-neutral-900 bg-white placeholder:text-neutral-400 focus-visible:border-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none transition-colors uppercase"
              required
            />
            <div class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              <Search class="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </div>
          <p class="text-[11px] text-neutral-400">
            Nhập "admin" nếu muốn chuyển sang chế độ quản trị viên
          </p>
        </div>

        <!-- Mật khẩu Quản trị (Hiện khi gõ 'admin') -->
        <div v-if="showPasswordInput" class="space-y-1.5 p-3 rounded-md bg-[#FBFBFA] border border-[#EAEAEA]">
          <label for="admin-password-input" class="block text-xs font-medium text-neutral-800 flex items-center gap-1.5">
            <Lock class="w-3 h-3 text-neutral-500" aria-hidden="true" />
            <span>Mật khẩu Quản trị viên</span>
          </label>
          <input
            id="admin-password-input"
            v-model="password"
            type="password"
            name="adminPassword"
            autocomplete="current-password"
            placeholder="Nhập mật khẩu (Mặc định: admin123)"
            class="w-full px-3 py-1.5 rounded-md border border-[#EAEAEA] font-mono text-xs bg-white focus-visible:border-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none"
          />
        </div>

        <!-- Nút Tra Cứu -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 px-4 rounded-md bg-[#171717] hover:bg-neutral-800 active:scale-[0.99] text-white font-medium text-xs tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none"
        >
          <span>{{ loading ? 'Đang kiểm tra...' : (showPasswordInput ? 'Đăng nhập Quản trị' : 'Tra cứu hóa đơn') }}</span>
          <ArrowRight class="w-3.5 h-3.5 text-neutral-300" aria-hidden="true" />
        </button>
      </form>

      <!-- Mã Mẫu Thử Nghiệm -->
      <div class="pt-3 border-t border-[#EAEAEA] space-y-2">
        <span class="block text-[11px] font-medium text-neutral-400">
          Mã gợi ý tra cứu nhanh:
        </span>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="item in quickCodes"
            :key="item.code"
            type="button"
            @click="selectQuickCode(item.code)"
            class="px-2 py-0.5 rounded border border-[#EAEAEA] bg-[#FBFBFA] hover:bg-neutral-100 hover:border-neutral-300 text-neutral-600 text-xs font-mono transition-colors cursor-pointer"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
