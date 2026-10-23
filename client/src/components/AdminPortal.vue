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
  X,
  BarChart3,
} from 'lucide-vue-next';
import { api, formatVND, formatNumber } from '../api';
import TariffModal from './TariffModal.vue';
import AdminDashboard from './AdminDashboard.vue';

const emit = defineEmits(['logout', 'inspect-customer']);

const activeAdminTab = ref('dashboard');
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

const showPayosModal = ref(false);
const payosConfig = ref({
  clientId: '',
  apiKey: '',
  checksumKey: '',
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

async function openPayosConfig() {
  try {
    payosConfig.value = await api.getPayosConfig();
    showPayosModal.value = true;
  } catch (err) {
    alert(err.message);
  }
}

async function handleSavePayos() {
  try {
    await api.updatePayosConfig(payosConfig.value);
    showPayosModal.value = false;
    alert('Đã cập nhật cấu hình PayOS thành công!');
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
  <div class="space-y-5">
    <!-- Header Admin Flat Minimal -->
    <div class="bg-white rounded-lg border border-[#EAEAEA] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded bg-[#171717] text-white flex items-center justify-center font-bold text-xs font-mono">
          AD
        </div>
        <div>
          <h2 class="text-base font-semibold text-[#171717] tracking-tight">Quản Trị Hệ Thống</h2>
          <p class="text-xs text-[#737373]">Quản lý {{ pagination.total }} khách hàng, cấu hình biểu giá và cổng thanh toán</p>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <button
          @click="openPayosConfig"
          class="px-3 py-1.5 rounded-md border border-[#EAEAEA] text-[#171717] hover:bg-[#F5F5F5] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <CreditCard class="w-3.5 h-3.5 text-[#737373]" aria-hidden="true" />
          <span>Cổng PayOS</span>
        </button>

        <button
          @click="openTariffs"
          class="px-3 py-1.5 rounded-md border border-[#EAEAEA] text-[#171717] hover:bg-[#F5F5F5] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sliders class="w-3.5 h-3.5 text-[#737373]" aria-hidden="true" />
          <span>Biểu giá EVN</span>
        </button>

        <button
          @click="$emit('logout')"
          class="px-3 py-1.5 rounded-md border border-[#EAEAEA] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut class="w-3.5 h-3.5 text-[#A3A3A3]" aria-hidden="true" />
          <span>Thoát</span>
        </button>
      </div>
    </div>

    <!-- Tabs Điều Hướng Admin (Flat UI) -->
    <div class="flex border-b border-[#EAEAEA] gap-6">
      <button
        @click="activeAdminTab = 'dashboard'"
        :class="activeAdminTab === 'dashboard' ? 'border-[#171717] text-[#171717] font-semibold' : 'border-transparent text-[#737373] hover:text-[#171717] font-normal'"
        class="pb-2.5 text-xs border-b-2 flex items-center gap-2 transition-colors cursor-pointer"
      >
        <BarChart3 class="w-3.5 h-3.5" aria-hidden="true" />
        <span>Dashboard Giám Sát & Điều Hành</span>
      </button>

      <button
        @click="activeAdminTab = 'customers'"
        :class="activeAdminTab === 'customers' ? 'border-[#171717] text-[#171717] font-semibold' : 'border-transparent text-[#737373] hover:text-[#171717] font-normal'"
        class="pb-2.5 text-xs border-b-2 flex items-center gap-2 transition-colors cursor-pointer"
      >
        <Users class="w-3.5 h-3.5" aria-hidden="true" />
        <span>Hồ Sơ Khách Hàng</span>
        <span class="px-1.5 py-0.2 rounded bg-[#F5F5F5] text-[#737373] text-[11px] font-mono">{{ pagination.total }}</span>
      </button>
    </div>

    <!-- View 1: Dashboard Giám Sát -->
    <AdminDashboard
      v-if="activeAdminTab === 'dashboard'"
      @inspect-customer="(code) => $emit('inspect-customer', code)"
    />

    <!-- View 2: Danh Sách Khách Hàng -->
    <div v-else-if="activeAdminTab === 'customers'" class="bg-white rounded-lg border border-[#EAEAEA] p-5 space-y-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative w-full sm:w-80">
          <label for="admin-search-input" class="sr-only">Tìm kiếm khách hàng</label>
          <input
            id="admin-search-input"
            v-model="searchQuery"
            @input="handleSearchInput"
            type="text"
            placeholder="Tìm Mã KH, Tên, Số ĐT, Công tơ..."
            class="w-full pl-9 pr-3 py-1.5 rounded-md border border-[#EAEAEA] text-xs bg-white text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#171717] focus:outline-none transition-colors font-mono"
          />
          <Search class="w-3.5 h-3.5 text-[#A3A3A3] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
        </div>

        <button
          @click="openAddCustomer"
          class="w-full sm:w-auto px-3.5 py-1.5 rounded-md bg-[#171717] hover:bg-[#262626] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus class="w-3.5 h-3.5" aria-hidden="true" />
          <span>Thêm khách hàng</span>
        </button>
      </div>

      <!-- Bảng Minimalist -->
      <div class="overflow-x-auto rounded-lg border border-[#EAEAEA]">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#FAFAFA] border-b border-[#EAEAEA] text-[#737373] text-[11px] font-medium uppercase tracking-wider">
            <tr>
              <th class="px-4 py-2.5 font-medium">Mã KH</th>
              <th class="px-3 py-2.5 font-medium">Họ và tên</th>
              <th class="px-3 py-2.5 font-medium">Số điện thoại</th>
              <th class="px-3 py-2.5 font-medium">Mã công tơ</th>
              <th class="px-3 py-2.5 font-medium">Địa chỉ</th>
              <th class="px-3 py-2.5 text-center font-medium">Hồ sơ</th>
              <th class="px-4 py-2.5 text-center font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F0F0F0]">
            <tr v-if="customers.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-[#A3A3A3]">
                Không tìm thấy khách hàng nào phù hợp
              </td>
            </tr>
            <tr
              v-for="c in customers"
              :key="c.id"
              class="hover:bg-[#FAFAFA] transition-colors"
            >
              <td class="px-4 py-2.5 font-mono font-medium text-[#171717]">
                {{ c.customer_code }}
              </td>
              <td class="px-3 py-2.5 font-medium text-[#171717]">
                {{ c.full_name }}
              </td>
              <td class="px-3 py-2.5 font-mono text-[#737373]">
                {{ c.phone || '-' }}
              </td>
              <td class="px-3 py-2.5 font-mono text-[#171717]">
                {{ c.meter_code || '-' }}
              </td>
              <td class="px-3 py-2.5 text-[#737373] truncate max-w-xs" :title="c.address">
                {{ c.address || '-' }}
              </td>
              <td class="px-3 py-2.5 text-center">
                <span class="px-1.5 py-0.2 rounded bg-[#F5F5F5] font-mono text-[#737373] text-[11px]">
                  {{ c.total_readings }}&nbsp;kỳ
                </span>
                <span
                  v-if="c.unpaid_count > 0"
                  class="ml-1 px-1.5 py-0.2 rounded bg-[#FDF6E7] text-[#946300] border border-[#FAECC8] text-[10px] font-medium"
                >
                  nợ {{ c.unpaid_count }}
                </span>
                <span
                  v-if="c.status === 'TERMINATED'"
                  class="block mt-0.5 text-[10px] text-[#9F2F2D] font-medium"
                >
                  Đã chấm dứt
                </span>
              </td>
              <td class="px-4 py-2.5 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button
                    @click="$emit('inspect-customer', c.customer_code)"
                    class="px-2 py-0.5 rounded border border-[#EAEAEA] text-[#171717] hover:bg-[#F5F5F5] text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ExternalLink class="w-3 h-3 text-[#737373]" aria-hidden="true" />
                    <span>Tra cứu</span>
                  </button>

                  <button
                    @click="openEditCustomer(c)"
                    aria-label="Sửa thông tin khách hàng"
                    class="p-1 rounded text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] cursor-pointer transition-colors"
                  >
                    <Edit class="w-3.5 h-3.5" aria-hidden="true" />
                  </button>

                  <button
                    @click="handleDeleteCustomer(c)"
                    aria-label="Xóa khách hàng"
                    class="p-1 rounded text-[#737373] hover:text-[#9F2F2D] hover:bg-[#FDEBEC] cursor-pointer transition-colors"
                  >
                    <Trash2 class="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân Trang Minimalist -->
      <div class="flex items-center justify-between text-xs text-[#737373] pt-1">
        <span>
          Trang <strong class="text-[#171717] font-mono">{{ pagination.page }}</strong> / {{ pagination.totalPages }} ({{ pagination.total }} khách hàng)
        </span>
        <div class="flex items-center gap-1">
          <button
            @click="fetchCustomers(pagination.page - 1)"
            :disabled="pagination.page <= 1"
            class="p-1.5 rounded border border-[#EAEAEA] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] disabled:opacity-30 cursor-pointer transition-colors"
          >
            <ChevronLeft class="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            @click="fetchCustomers(pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages"
            class="p-1.5 rounded border border-[#EAEAEA] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] disabled:opacity-30 cursor-pointer transition-colors"
          >
            <ChevronRight class="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Thêm/Sửa Khách Hàng -->
    <div
      v-if="showCustomerModal"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      @click.self="showCustomerModal = false"
    >
      <div class="bg-white rounded-lg border border-[#EAEAEA] w-full max-w-md overflow-hidden p-5 space-y-4">
        <div class="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
          <h3 class="font-semibold text-[#171717] text-sm">
            {{ editingCustomer ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng mới' }}
          </h3>
          <button @click="showCustomerModal = false" aria-label="Đóng" class="p-1 text-[#737373] hover:text-[#171717] rounded hover:bg-[#F5F5F5]">
            <X class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form @submit.prevent="handleSaveCustomer" class="space-y-3 text-xs">
          <div>
            <label for="cust-code" class="block font-medium text-[#171717] mb-1">Mã khách hàng</label>
            <input
              id="cust-code"
              v-model="customerForm.customer_code"
              type="text"
              required
              class="w-full px-3 py-1.5 rounded-md border border-[#EAEAEA] font-mono uppercase bg-white text-[#171717] focus:border-[#171717] focus:outline-none"
            />
          </div>

          <div>
            <label for="cust-name" class="block font-medium text-[#171717] mb-1">Họ và tên</label>
            <input
              id="cust-name"
              v-model="customerForm.full_name"
              type="text"
              required
              placeholder="Nguyễn Văn A"
              class="w-full px-3 py-1.5 rounded-md border border-[#EAEAEA] bg-white text-[#171717] focus:border-[#171717] focus:outline-none"
            />
          </div>

          <div>
            <label for="cust-phone" class="block font-medium text-[#171717] mb-1">Số điện thoại</label>
            <input
              id="cust-phone"
              v-model="customerForm.phone"
              type="text"
              placeholder="0912345678"
              class="w-full px-3 py-1.5 rounded-md border border-[#EAEAEA] font-mono bg-white text-[#171717] focus:border-[#171717] focus:outline-none"
            />
          </div>

          <div>
            <label for="cust-meter" class="block font-medium text-[#171717] mb-1">Mã công tơ</label>
            <input
              id="cust-meter"
              v-model="customerForm.meter_code"
              type="text"
              placeholder="CT0001"
              class="w-full px-3 py-1.5 rounded-md border border-[#EAEAEA] font-mono uppercase bg-white text-[#171717] focus:border-[#171717] focus:outline-none"
            />
          </div>

          <div>
            <label for="cust-addr" class="block font-medium text-[#171717] mb-1">Địa chỉ</label>
            <textarea
              id="cust-addr"
              v-model="customerForm.address"
              rows="2"
              placeholder="Số nhà, Đường, Quận/Huyện, Tỉnh/TP"
              class="w-full px-3 py-1.5 rounded-md border border-[#EAEAEA] bg-white text-[#171717] focus:border-[#171717] focus:outline-none"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-1">
            <button
              type="button"
              @click="showCustomerModal = false"
              class="px-3 py-1.5 rounded-md border border-[#EAEAEA] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] font-medium cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 rounded-md bg-[#171717] hover:bg-[#262626] text-white font-medium cursor-pointer"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Cấu hình PayOS (VietQR) -->
    <div
      v-if="showPayosModal"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      @click.self="showPayosModal = false"
    >
      <div class="bg-white rounded-lg border border-[#EAEAEA] w-full max-w-lg overflow-hidden p-5 space-y-4">
        <div class="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
          <div class="flex items-center gap-2">
            <CreditCard class="w-4 h-4 text-[#171717]" aria-hidden="true" />
            <h3 class="font-semibold text-[#171717] text-sm">Cấu hình Cổng PayOS (VietQR)</h3>
          </div>
          <button @click="showPayosModal = false" aria-label="Đóng" class="p-1 text-[#737373] hover:text-[#171717] rounded hover:bg-[#F5F5F5]">
            <X class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form @submit.prevent="handleSavePayos" class="space-y-3 text-xs">
          <div>
            <label for="payos-client" class="block font-medium text-[#171717] mb-1">PAYOS CLIENT ID</label>
            <input
              id="payos-client"
              v-model="payosConfig.clientId"
              type="text"
              class="w-full px-3 py-1.5 rounded-md border border-[#EAEAEA] font-mono bg-white text-[#171717] focus:border-[#171717] focus:outline-none"
            />
          </div>

          <div>
            <label for="payos-api-key" class="block font-medium text-[#171717] mb-1">PAYOS API KEY</label>
            <input
              id="payos-api-key"
              v-model="payosConfig.apiKey"
              type="password"
              class="w-full px-3 py-1.5 rounded-md border border-[#EAEAEA] font-mono bg-white text-[#171717] focus:border-[#171717] focus:outline-none"
            />
          </div>

          <div>
            <label for="payos-checksum" class="block font-medium text-[#171717] mb-1">PAYOS CHECKSUM KEY</label>
            <input
              id="payos-checksum"
              v-model="payosConfig.checksumKey"
              type="password"
              class="w-full px-3 py-1.5 rounded-md border border-[#EAEAEA] font-mono bg-white text-[#171717] focus:border-[#171717] focus:outline-none"
            />
          </div>

          <div class="flex justify-end gap-2 pt-1">
            <button
              type="button"
              @click="showPayosModal = false"
              class="px-3 py-1.5 rounded-md border border-[#EAEAEA] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F5] font-medium cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 rounded-md bg-[#171717] hover:bg-[#262626] text-white font-medium cursor-pointer"
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
