<script setup>
import { ref, onMounted } from 'vue';
import { Gauge, CheckCircle2, AlertCircle, Settings, Calculator, X } from 'lucide-vue-next';
import { api } from './api';
import LookupLogin from './components/LookupLogin.vue';
import CustomerPortal from './components/CustomerPortal.vue';
import AdminPortal from './components/AdminPortal.vue';
import TariffModal from './components/TariffModal.vue';
import QuickCalculator from './components/QuickCalculator.vue';

const currentView = ref('LOGIN');
const customerData = ref(null);
const customerPhone = ref('');
const adminToken = ref('');
const notification = ref(null);

const showTariffModal = ref(false);
const tariffsData = ref(null);
const showQuickCalcModal = ref(false);

async function handleLoginSuccess(res) {
  if (res.role === 'admin') {
    adminToken.value = res.token;
    currentView.value = 'ADMIN';
  } else if (res.role === 'customer') {
    customerPhone.value = ''; // Reset khi tra cứu mới bằng Mã KH
    await loadCustomer(res.customer.customer_code, null);
  }
}

async function loadCustomer(code, phone = null) {
  try {
    const data = await api.getCustomerData(code, phone);
    customerData.value = data;
    currentView.value = 'CUSTOMER';
  } catch (err) {
    notification.value = {
      type: 'error',
      message: err.message || 'Không thể tải thông tin khách hàng',
    };
  }
}

async function handleVerifyPhoneCustomer({ phone, onSuccess, onError }) {
  if (!customerData.value || !customerData.value.customer) return;
  const code = customerData.value.customer.customer_code;
  try {
    const data = await api.getCustomerData(code, phone);
    if (!data.is_authenticated) {
      if (onError) onError('Số điện thoại không chính xác. Vui lòng kiểm tra lại!');
      return;
    }
    customerPhone.value = phone;
    customerData.value = data;
    if (onSuccess) onSuccess();
    notification.value = {
      type: 'success',
      message: 'Xác thực số điện thoại thành công! Đã mở khóa toàn bộ lịch sử và thông tin.',
    };
  } catch (err) {
    if (onError) onError(err.message || 'Lỗi khi xác thực số điện thoại');
  }
}

function handleLogout() {
  currentView.value = 'LOGIN';
  customerData.value = null;
  customerPhone.value = '';
  adminToken.value = '';
}

function handleInspectCustomer(code) {
  loadCustomer(code);
}

async function openTariffModal() {
  try {
    tariffsData.value = await api.getTariffs();
    showTariffModal.value = true;
  } catch (err) {
    alert(err.message);
  }
}

async function handleSaveTariff(data) {
  try {
    await api.updateTariffs(data);
    showTariffModal.value = false;
    notification.value = { type: 'success', message: 'Đã cập nhật biểu giá tiền điện thành công' };
  } catch (err) {
    alert(err.message);
  }
}

async function checkVnpayReturn() {
  const urlParams = new URLSearchParams(window.location.search);
  const responseCode = urlParams.get('vnp_ResponseCode');
  const paidReadingId = urlParams.get('paid_reading_id');

  if (responseCode) {
    const paramsObj = {};
    for (const [k, v] of urlParams.entries()) {
      paramsObj[k] = v;
    }

    try {
      const res = await api.verifyVnpayReturn(paramsObj);
      if (res.success) {
        notification.value = {
          type: 'success',
          message: 'Thanh toán thành công qua cổng VNPAY!',
        };
      } else {
        notification.value = {
          type: 'error',
          message: res.error || 'Giao dịch VNPAY không thành công',
        };
      }
    } catch (err) {
      notification.value = {
        type: 'error',
        message: err.message || 'Lỗi khi xác minh giao dịch VNPAY',
      };
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (paidReadingId) {
    notification.value = {
      type: 'success',
      message: 'Giao dịch thanh toán hoàn tất!',
    };
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

onMounted(() => {
  checkVnpayReturn();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <!-- Navbar Hiện Đại -->
    <header class="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-18">
          <!-- Logo & Tiêu đề -->
          <button
            type="button"
            @click="handleLogout"
            class="flex items-center gap-3 text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none p-1 rounded-xl"
          >
            <div class="w-9 h-9 rounded-xl bg-[#0099ff] flex items-center justify-center text-white shadow-sm shrink-0">
              <Gauge class="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-slate-900 text-base tracking-tight block">
                  Tra Cứu Tiền Điện
                </span>
                <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-bold text-[10px] tracking-wide">
                  EVN
                </span>
              </div>
              <span class="text-[11px] text-slate-400 font-medium hidden sm:block">
                Hóa đơn và thanh toán trực tuyến
              </span>
            </div>
          </button>

          <!-- Thao tác nhanh -->
          <div class="flex items-center gap-2.5">
            <button
              @click="showQuickCalcModal = true"
              class="px-3.5 py-2 rounded-xl bg-[#0099ff]/10 hover:bg-[#0099ff]/20 text-[#0099ff] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
            >
              <Calculator class="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tính tiền điện</span>
            </button>

            <button
              @click="openTariffModal"
              class="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none shadow-2xs"
            >
              <Settings class="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Biểu giá EVN</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hộp Thông Báo Toast -->
    <div
      v-if="notification"
      role="alert"
      aria-live="polite"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4"
    >
      <div
        class="p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold shadow-xs"
        :class="notification.type === 'success' 
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
          : 'bg-rose-50 text-rose-800 border-rose-200'"
      >
        <div class="flex items-center gap-2.5">
          <CheckCircle2 v-if="notification.type === 'success'" class="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <AlertCircle v-else class="w-4 h-4 text-rose-600" aria-hidden="true" />
          <span>{{ notification.message }}</span>
        </div>
        <button
          @click="notification = null"
          class="text-xs uppercase tracking-wider font-bold cursor-pointer hover:underline"
        >
          Đóng
        </button>
      </div>
    </div>

    <!-- Nội dung chính -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <LookupLogin
        v-if="currentView === 'LOGIN'"
        @login-success="handleLoginSuccess"
      />

      <CustomerPortal
        v-else-if="currentView === 'CUSTOMER' && customerData"
        :customer-data="customerData"
        @logout="handleLogout"
        @refresh="loadCustomer(customerData.customer.customer_code, customerPhone)"
        @verify-phone="handleVerifyPhoneCustomer"
      />

      <AdminPortal
        v-else-if="currentView === 'ADMIN'"
        @logout="handleLogout"
        @inspect-customer="handleInspectCustomer"
      />
    </main>

    <!-- Footer Tinh Tế & Hiện Đại -->
    <footer class="bg-white border-t border-slate-200/80 py-6 text-xs text-slate-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div>
          <span class="font-bold text-slate-700">Tra Cứu Tiền Điện</span> • Cổng tra cứu và thanh toán tiền điện trực tuyến
        </div>
        <div class="text-[11px] text-slate-400">
          Tích hợp cổng VNPAY Sandbox • Biểu giá 6 bậc lũy kế EVN
        </div>
      </div>
    </footer>

    <!-- Modal Biểu Giá -->
    <TariffModal
      :is-open="showTariffModal"
      :tariffs-data="tariffsData"
      @close="showTariffModal = false"
      @save="handleSaveTariff"
    />

    <!-- Modal Tính Nhanh Tiền Điện Toàn Cục -->
    <div
      v-if="showQuickCalcModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      @click.self="showQuickCalcModal = false"
    >
      <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-100">
        <button
          @click="showQuickCalcModal = false"
          class="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" aria-hidden="true" />
        </button>
        <QuickCalculator />
      </div>
    </div>
  </div>
</template>
