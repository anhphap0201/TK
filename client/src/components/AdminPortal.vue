<script setup>
import { ref, onMounted } from 'vue';
import {
  Users,
  Search,
  Plus,
  CreditCard,
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sliders,
  Shield,
  X,
} from 'lucide-vue-next';
import { api, formatVND, formatNumber } from '../api';
import TariffModal from './TariffModal.vue';

const emit = defineEmits(['logout', 'inspect-customer']);

const customers = ref([]);
const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 1 });
const searchQuery = ref('');
const loading = ref(false);

const showCustomerModal = ref(false);
const editingCustomer = ref(null);
const customerForm = ref({
  customer_code: '',
  full_name: '',
  phone: '',
  address: '',
  meter_code: '',
});

const showTariffModal = ref(false);
const tariffsData = ref(null);

const showVnpayModal = ref(false);
const vnpayConfig = ref({
  vnp_TmnCode: '',
  vnp_HashSecret: '',
  vnp_Url: '',
});

async function fetchCustomers(page = 1) {
  loading.value = true;
  try {
    const res = await api.getCustomers({
      q: searchQuery.value,
      page,
      limit: 20,
    });
    customers.value = res.data;
    pagination.value = res.pagination;
  } catch (err) {
    alert(err.message);
  } finally {
    loading.value = false;
  }
}

let searchTimeout = null;
function handleSearchInput() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchCustomers(1);
  }, 300);
}

function openAddCustomer() {
  editingCustomer.value = null;
  customerForm.value = {
    customer_code: `KH${String(pagination.value.total + 1).padStart(4, '0')}`,
    full_name: '',
    phone: '',
    address: '',
    meter_code: `CT${String(pagination.value.total + 1).padStart(4, '0')}`,
  };
  showCustomerModal.value = true;
}

function openEditCustomer(item) {
  editingCustomer.value = item;
  customerForm.value = {
    customer_code: item.customer_code,
    full_name: item.full_name,
    phone: item.phone || '',
    address: item.address || '',
    meter_code: item.meter_code || '',
  };
  showCustomerModal.value = true;
}

async function handleSaveCustomer() {
  try {
    if (editingCustomer.value) {
      await api.updateCustomer(editingCustomer.value.id, customerForm.value);
    } else {
      await api.createCustomer(customerForm.value);
    }
    showCustomerModal.value = false;
    fetchCustomers(pagination.value.page);
  } catch (err) {
    alert(err.message);
  }
}

async function handleDeleteCustomer(item) {
  if (!confirm(`Xác nhận xóa hồ sơ "${item.full_name}" (${item.customer_code})?`)) {
    return;
  }
  try {
    await api.deleteCustomer(item.id);
    fetchCustomers(pagination.value.page);
  } catch (err) {
    alert(err.message);
  }
}

async function openVnpayConfig() {
  try {
    vnpayConfig.value = await api.getPaymentConfig();
    showVnpayModal.value = true;
  } catch (err) {
    alert(err.message);
  }
}

async function handleSaveVnpay() {
  try {
    await api.updatePaymentConfig(vnpayConfig.value);
    showVnpayModal.value = false;
    alert('Đã cập nhật cấu hình VNPAY thành công!');
  } catch (err) {
    alert(err.message);
  }
}

async function openTariffs() {
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
    alert('Đã cập nhật biểu giá EVN thành công!');
  } catch (err) {
    alert(err.message);
  }
}

onMounted(() => {
  fetchCustomers(1);
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header Admin Hiện Đại -->
    <div class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="flex items-center gap-3.5">
        <div class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs tracking-wider shadow-sm">
          ADMIN
        </div>
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Hệ Thống Quản Trị Hệ Thống</h2>
          <p class="text-xs text-slate-400">Quản lý {{ pagination.total }} khách hàng, cấu hình biểu giá và cổng thanh toán</p>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <button
          @click="openVnpayConfig"
          class="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
        >
          <CreditCard class="w-4 h-4 text-[#0099ff]" aria-hidden="true" />
          <span>Cổng VNPAY</span>
        </button>

        <button
          @click="openTariffs"
          class="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
        >
          <Sliders class="w-4 h-4 text-[#0099ff]" aria-hidden="true" />
          <span>Biểu giá EVN</span>
        </button>

        <button
          @click="$emit('logout')"
          class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
        >
          <LogOut class="w-4 h-4 text-slate-400" aria-hidden="true" />
          <span>Thoát</span>
        </button>
      </div>
    </div>

    <!-- Danh Sách Khách Hàng -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:w-96">
          <label for="admin-search-input" class="sr-only">Tìm kiếm khách hàng</label>
          <input
            id="admin-search-input"
            v-model="searchQuery"
            @input="handleSearchInput"
            type="text"
            placeholder="Tìm theo Mã KH, Tên, Số điện thoại, Mã công tơ…"
            class="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs bg-slate-50/60 focus:bg-white focus-visible:ring-3 focus-visible:ring-[#0099ff]/20 focus-visible:border-[#0099ff] focus-visible:outline-none transition-all"
          />
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
        </div>

        <button
          @click="openAddCustomer"
          class="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#0099ff] hover:bg-[#0088ee] active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0099ff]/20 cursor-pointer focus-visible:ring-3 focus-visible:ring-[#0099ff]/40 focus-visible:outline-none"
        >
          <Plus class="w-4 h-4" aria-hidden="true" />
          <span>Thêm khách hàng</span>
        </button>
      </div>

      <!-- Bảng Hiện Đại -->
      <div class="overflow-x-auto rounded-2xl border border-slate-100">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th class="px-5 py-3.5">Mã KH</th>
              <th class="px-4 py-3.5">Họ và tên</th>
              <th class="px-4 py-3.5">Số điện thoại</th>
              <th class="px-4 py-3.5">Mã công tơ</th>
              <th class="px-4 py-3.5">Địa chỉ dùng điện</th>
              <th class="px-4 py-3.5 text-center">Hồ sơ</th>
              <th class="px-5 py-3.5 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="customers.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-slate-400">
                Không tìm thấy khách hàng nào phù hợp
              </td>
            </tr>
            <tr
              v-for="c in customers"
              :key="c.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="px-5 py-3.5 font-mono font-bold text-[#0099ff]">
                {{ c.customer_code }}
              </td>
              <td class="px-4 py-3.5 font-bold text-slate-900">
                {{ c.full_name }}
              </td>
              <td class="px-4 py-3.5 font-mono text-slate-500 text-xs">
                {{ c.phone || '-' }}
              </td>
              <td class="px-4 py-3.5 font-mono text-slate-700 font-semibold">
                {{ c.meter_code || '-' }}
              </td>
              <td class="px-4 py-3.5 text-slate-500 truncate max-w-xs" :title="c.address">
                {{ c.address || '-' }}
              </td>
              <td class="px-4 py-3.5 text-center">
                <span class="px-2 py-0.5 rounded-full bg-slate-100 font-mono font-bold text-slate-600 text-[11px]">
                  {{ c.total_readings }}&nbsp;kỳ
                </span>
                <span
                  v-if="c.unpaid_count > 0"
                  class="ml-1 px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold text-[10px]"
                >
                  nợ {{ c.unpaid_count }}
                </span>
                <span
                  v-if="c.status === 'TERMINATED'"
                  class="block mt-1 text-[10px] text-rose-600 font-bold"
                >
                  Đã chấm dứt
                </span>
              </td>
              <td class="px-5 py-3.5 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    @click="$emit('inspect-customer', c.customer_code)"
                    class="px-2.5 py-1.5 rounded-xl bg-[#0099ff]/10 text-[#0099ff] hover:bg-[#0099ff]/20 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
                  >
                    <ExternalLink class="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Tra cứu</span>
                  </button>

                  <button
                    @click="openEditCustomer(c)"
                    aria-label="Sửa thông tin khách hàng"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
                  >
                    <Edit class="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    @click="handleDeleteCustomer(c)"
                    aria-label="Xóa khách hàng"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                  >
                    <Trash2 class="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân Trang Hiện Đại -->
      <div class="flex items-center justify-between text-xs text-slate-500 pt-2 font-medium">
        <span>
          Trang <strong>{{ pagination.page }}</strong> / {{ pagination.totalPages }} (Tổng cộng {{ pagination.total }} khách hàng)
        </span>
        <div class="flex items-center gap-1.5">
          <button
            @click="fetchCustomers(pagination.page - 1)"
            :disabled="pagination.page <= 1"
            class="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
          >
            <ChevronLeft class="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            @click="fetchCustomers(pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages"
            class="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
          >
            <ChevronRight class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Thêm/Sửa Khách Hàng -->
    <div
      v-if="showCustomerModal"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="font-bold text-slate-900 text-sm">
            {{ editingCustomer ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng mới' }}
          </h3>
          <button @click="showCustomerModal = false" aria-label="Đóng" class="p-1 text-slate-400 hover:text-slate-600">
            <X class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form @submit.prevent="handleSaveCustomer" class="space-y-3 text-xs">
          <div>
            <label for="cust-code" class="block font-bold text-slate-700 uppercase mb-1">Mã khách hàng</label>
            <input
              id="cust-code"
              v-model="customerForm.customer_code"
              type="text"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono uppercase bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
            />
          </div>

          <div>
            <label for="cust-name" class="block font-bold text-slate-700 uppercase mb-1">Họ và tên</label>
            <input
              id="cust-name"
              v-model="customerForm.full_name"
              type="text"
              required
              placeholder="Nguyễn Văn A"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
            />
          </div>

          <div>
            <label for="cust-phone" class="block font-bold text-slate-700 uppercase mb-1">Số điện thoại</label>
            <input
              id="cust-phone"
              v-model="customerForm.phone"
              type="text"
              placeholder="0912345678"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
            />
          </div>

          <div>
            <label for="cust-meter" class="block font-bold text-slate-700 uppercase mb-1">Mã công tơ</label>
            <input
              id="cust-meter"
              v-model="customerForm.meter_code"
              type="text"
              placeholder="CT0001"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono uppercase focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
            />
          </div>

          <div>
            <label for="cust-addr" class="block font-bold text-slate-700 uppercase mb-1">Địa chỉ</label>
            <textarea
              id="cust-addr"
              v-model="customerForm.address"
              rows="2"
              placeholder="Số nhà, Đường, Quận/Huyện, Tỉnh/TP"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="showCustomerModal = false"
              class="px-4 py-2 rounded-xl border border-slate-200 font-semibold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-[#0099ff] text-white font-bold cursor-pointer"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Cấu hình VNPAY -->
    <div
      v-if="showVnpayModal"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <CreditCard class="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <h3 class="font-bold text-slate-900 text-sm">Cấu hình Cổng VNPAY Sandbox</h3>
          </div>
          <button @click="showVnpayModal = false" aria-label="Đóng" class="p-1 text-slate-400 hover:text-slate-600">
            <X class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form @submit.prevent="handleSaveVnpay" class="space-y-3 text-xs">
          <div>
            <label for="vnp-tmn" class="block font-bold text-slate-700 uppercase mb-1">VNPAY TMN CODE</label>
            <input
              id="vnp-tmn"
              v-model="vnpayConfig.vnp_TmnCode"
              type="text"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
            />
          </div>

          <div>
            <label for="vnp-secret" class="block font-bold text-slate-700 uppercase mb-1">VNPAY HASH SECRET</label>
            <input
              id="vnp-secret"
              v-model="vnpayConfig.vnp_HashSecret"
              type="password"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
            />
          </div>

          <div>
            <label for="vnp-url" class="block font-bold text-slate-700 uppercase mb-1">VNPAY PAYMENT URL</label>
            <input
              id="vnp-url"
              v-model="vnpayConfig.vnp_Url"
              type="text"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:outline-none"
            />
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="showVnpayModal = false"
              class="px-4 py-2 rounded-xl border border-slate-200 font-semibold cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-[#0099ff] text-white font-bold cursor-pointer"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Biểu Giá -->
    <TariffModal
      :is-open="showTariffModal"
      :tariffs-data="tariffsData"
      @close="showTariffModal = false"
      @save="handleSaveTariff"
    />
  </div>
</template>
