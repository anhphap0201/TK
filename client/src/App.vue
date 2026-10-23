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

async function loadCustomer(code, phone = null, isAdmin = false) {
  try {
    const data = await api.getCustomerData(code, phone, isAdmin || Boolean(adminToken.value));
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

function handleCustomerLogout() {
  if (adminToken.value) {
    currentView.value = 'ADMIN';
    customerData.value = null;
  } else {
    handleLogout();
  }
}

function handleInspectCustomer(code) {
  loadCustomer(code, null, true);
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

async function checkPaymentReturn() {
  const urlParams = new URLSearchParams(window.location.search);
  const payosStatus = urlParams.get('payos_status');
  const paidReadingId = urlParams.get('paid_reading_id');
  const orderCode = urlParams.get('orderCode');

  if (payosStatus === 'PAID' || (payosStatus && payosStatus !== 'CANCEL')) {
    try {
      const res = await api.verifyPayosPayment(orderCode ? Number(orderCode) : null, paidReadingId ? Number(paidReadingId) : null);
      if (res.success) {
        notification.value = {
          type: 'success',
          message: 'Thanh toán thành công qua cổng PayOS (VietQR)!',
        };
        if (customerData.value?.customer) {
          await loadCustomer(customerData.value.customer.customer_code, customerPhone.value);
        }
      }
    } catch (err) {
      notification.value = {
        type: 'error',
        message: err.message || 'Lỗi khi xác minh giao dịch PayOS',
      };
    }
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }

  if (payosStatus === 'CANCEL') {
    notification.value = {
      type: 'error',
      message: 'Bạn đã hủy giao dịch thanh toán PayOS',
    };
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }

  if (paidReadingId) {
    notification.value = {
      type: 'success',
      message: 'Giao dịch thanh toán PayOS hoàn tất!',
    };
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

onMounted(() => {
  checkPaymentReturn();
});
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] text-[#171717] flex flex-col font-sans">
    <!-- Navbar Flat UI / Modern Minimal -->
    <header class="bg-white border-b border-[#EAEAEA] sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-14">
          <!-- Logo & Tiêu đề -->
          <button
            type="button"
            @click="handleLogout"
            class="flex items-center gap-2.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 rounded p-1"
          >
            <div class="w-7 h-7 rounded-md bg-[#171717] flex items-center justify-center text-white shrink-0">
              <Gauge class="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <div class="flex items-center gap-2">
              <span class="font-semibold text-neutral-900 text-sm tracking-tight">
                EVN Portal
              </span>
              <span class="text-neutral-400">/</span>
              <span class="text-xs text-neutral-500 font-normal">
                Tra cứu tiền điện
              </span>
            </div>
          </button>

          <!-- Thao tác nhanh -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="showQuickCalcModal = true"
              class="px-2.5 py-1.5 rounded-md border border-[#EAEAEA] bg-white hover:bg-[#F5F5F4] text-neutral-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calculator class="w-3.5 h-3.5 text-neutral-500" aria-hidden="true" />
              <span>Tính nhanh</span>
            </button>

            <!-- Nút Mở Trung Tâm Trực Quan Hóa Test Cases -->
            <a
              href="/testcases.html"
              target="_blank"
              class="px-2.5 py-1.5 rounded-md border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Mở Trung Tâm Trực Quan Hóa 41 Ca Kiểm Thử (EVN TestLab Visualizer)"
            >
              <span>⚡</span>
              <span>Visualizer 41 Test</span>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Hộp Thông Báo Toast (Flat Muted Pastels) -->
    <div
      v-if="notification"
      role="alert"
      aria-live="polite"
      class="max-w-6xl mx-auto px-4 sm:px-6 w-full mt-3"
    >
      <div
        class="p-3 rounded-lg border flex items-center justify-between gap-3 text-xs font-medium"
        :class="notification.type === 'success' 
          ? 'bg-[#EDF3EC] text-[#245E2A] border-[#D3E2D1]' 
          : 'bg-[#FDEBEC] text-[#9F2F2D] border-[#F8D0D0]'"
      >
        <div class="flex items-center gap-2">
          <CheckCircle2 v-if="notification.type === 'success'" class="w-4 h-4 text-[#245E2A] shrink-0" aria-hidden="true" />
          <AlertCircle v-else class="w-4 h-4 text-[#9F2F2D] shrink-0" aria-hidden="true" />
          <span>{{ notification.message }}</span>
        </div>
        <button
          @click="notification = null"
          class="text-xs uppercase tracking-wider font-semibold cursor-pointer hover:opacity-75"
        >
          Đóng
        </button>
      </div>
    </div>

    <!-- Banner Chế độ Quản trị viên xem hồ sơ cá nhân -->
    <div
      v-if="adminToken && currentView === 'CUSTOMER' && customerData?.customer"
      class="bg-[#171717] text-white border-b border-[#262626] px-4 py-2.5 text-xs"
    >
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px] font-bold">
            QUẢN TRỊ VIÊN
          </span>
          <span class="text-neutral-200">
            Đang phân tích dữ liệu cá nhân: <strong class="text-white font-mono">{{ customerData.customer.customer_code }} - {{ customerData.customer.full_name }}</strong>
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="openTariffModal"
            class="px-2.5 py-1 rounded border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            title="Cấu hình biểu giá EVN"
          >
            <Settings class="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
            <span>Biểu giá EVN</span>
          </button>
          <button
            type="button"
            @click="currentView = 'ADMIN'"
            class="px-2.5 py-1 rounded bg-white text-[#171717] hover:bg-[#F5F5F5] font-medium text-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>← Quay lại Admin Dashboard</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Nội dung chính -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
      <LookupLogin
        v-if="currentView === 'LOGIN'"
        @login-success="handleLoginSuccess"
      />

      <CustomerPortal
        v-else-if="currentView === 'CUSTOMER' && customerData"
        :customer-data="customerData"
        @logout="handleCustomerLogout"
        @refresh="loadCustomer(customerData.customer.customer_code, customerPhone, Boolean(adminToken))"
        @verify-phone="handleVerifyPhoneCustomer"
      />

      <AdminPortal
        v-else-if="currentView === 'ADMIN'"
        @logout="handleLogout"
        @inspect-customer="handleInspectCustomer"
      />
    </main>

    <!-- Footer Flat UI -->
    <footer class="bg-white border-t border-[#EAEAEA] py-4 text-xs text-neutral-500">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div>
          <span class="font-medium text-neutral-800">Hệ Thống Tra Cứu Tiền Điện</span> • Đại học Phenikaa
        </div>
        <div class="text-[11px] text-neutral-400 font-mono">
          Cổng thanh toán PayOS (VietQR) • EVN 6 Bậc
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
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      @click.self="showQuickCalcModal = false"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto border border-[#EAEAEA]">
        <button
          @click="showQuickCalcModal = false"
          class="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" aria-hidden="true" />
        </button>
        <QuickCalculator />
      </div>
    </div>
  </div>
</template>
