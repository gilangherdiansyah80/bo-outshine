<script setup lang="ts">
import { ref, computed } from "vue";
import Card from "@/shared/ui/Card.vue";
import { useGetStats } from "@/services/Dashboard/useGetStats";
import { useGetOrderChart } from "@/services/Dashboard/useGetOrderChart";

const { stats, isLoading: isStatsLoading } = useGetStats();
const {
  chartData,
  isLoading: isChartLoading,
  params: chartParams,
} = useGetOrderChart({
  status: "",
  month: "",
  year: "",
});

const activeBarIndex = ref<number | null>(null);

const toggleBar = (idx: number) => {
  if (activeBarIndex.value === idx) {
    activeBarIndex.value = null;
  } else {
    activeBarIndex.value = idx;
  }
};

const maxOrders = computed(() => {
  if (!chartData.value.length) return 0;
  return Math.max(...chartData.value.map((d) => d.orderCount));
});

const yAxisLabels = computed(() => {
  const max = maxOrders.value;
  if (max === 0) return [0];
  // Calculate whole number steps for orders
  return [
    max,
    Math.round(max * 0.75),
    Math.round(max * 0.5),
    Math.round(max * 0.25),
    0,
  ];
});

const formatYAxis = (val: number) => {
  return Math.round(val).toString();
};

const months = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const years = ["2024", "2025", "2026"];
const statuses = [
  "all",
  "pending",
  "processing",
  "shipping",
  "completed",
  "cancelled",
];

/**
 * Defines styling (icons and color gradients) for different statistics cards.
 */
// ... (rest of getStatConfig)
const getStatConfig = (label: string) => {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("product")) {
    return {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
      color: "from-blue-600 to-indigo-500",
      badge: "bg-blue-50 text-blue-600",
    };
  }
  if (normalizedLabel.includes("order")) {
    return {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
      color: "from-orange-500 to-amber-500",
      badge: "bg-orange-50 text-orange-600",
    };
  }
  if (normalizedLabel.includes("users")) {
    if (normalizedLabel.includes("active")) {
      return {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/></svg>`,
        color: "from-emerald-600 to-teal-500",
        badge: "bg-emerald-50 text-emerald-600",
      };
    }
    return {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      color: "from-purple-600 to-pink-500",
      badge: "bg-purple-50 text-purple-600",
    };
  }
  if (normalizedLabel.includes("categor")) {
    return {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>`,
      color: "from-indigo-600 to-blue-500",
      badge: "bg-indigo-50 text-indigo-600",
    };
  }

  return {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    color: "from-gray-600 to-gray-500",
    badge: "bg-gray-50 text-gray-600",
  };
};
</script>

<template>
  <div class="px-6 mt-2 pb-24">
    <!-- Welcome Section -->
    <div class="mb-6">
      <h1 class="text-3xl font-black text-[#0F172A] tracking-tight">
        Dashboard
      </h1>
      <p class="text-gray-500 font-medium">
        Welcome back to Outshine Management.
      </p>
    </div>

    <!-- Stats Cards Container (Horizontal Scroll) -->
    <div class="flex overflow-x-auto gap-4 -mx-6 px-6 pb-6 scrollbar-hide">
      <!-- Skeleton State -->
      <template v-if="isStatsLoading">
        <Card
          v-for="i in 4"
          :key="'skeleton-' + i"
          class="p-5 border-none shadow-sm bg-white rounded-[2rem] flex flex-col justify-between min-h-[160px] min-w-[170px] animate-pulse"
        >
          <div class="w-10 h-10 bg-gray-100 rounded-2xl mb-4"></div>
          <div>
            <div class="h-8 w-16 bg-gray-100 rounded mb-2"></div>
            <div class="h-3 w-24 bg-gray-100 rounded"></div>
          </div>
        </Card>
      </template>

      <!-- Actual Data Cards -->
      <template v-else>
        <Card
          v-for="stat in stats"
          :key="stat.label"
          class="p-5 border-none shadow-[0_4px_25px_rgba(0,0,0,0.03)] bg-white rounded-[2.2rem] flex flex-col justify-between min-h-[160px] min-w-[170px] transform hover:scale-[1.02] transition-all group active:scale-95"
        >
          <div class="relative">
            <!-- Icon Container (Gradient background) -->
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br text-white mb-5 shadow-lg shadow-black/5"
              :class="getStatConfig(stat.label).color"
              v-html="getStatConfig(stat.label).icon"
            ></div>

            <!-- Value and Label -->
            <div
              class="text-3xl font-black text-slate-800 tracking-tighter mb-0.5"
            >
              {{ stat.count.toLocaleString() }}
            </div>
            <div
              class="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none"
            >
              {{ stat.label }}
            </div>
          </div>

          <!-- Stability Indicator -->
          <div
            :class="[
              'w-fit px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mt-auto',
              getStatConfig(stat.label).badge,
            ]"
          >
            Stable
          </div>
        </Card>
      </template>
    </div>

    <!-- Order Chart Section -->
    <div class="mt-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-black text-slate-800 tracking-tight">
          Order Trends
        </h2>
        <div class="flex gap-2 text-[10px] font-bold uppercase tracking-wider">
          <div class="flex items-center gap-1.5">
            <div class="w-2.5 h-2.5 rounded-sm bg-blue-500"></div>
            <span class="text-slate-400">Revenue</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-2.5 h-2.5 rounded-sm bg-indigo-300"></div>
            <span class="text-slate-400">Orders</span>
          </div>
        </div>
      </div>

      <!-- Chart Filters -->
      <div class="flex flex-wrap gap-2 mb-6">
        <select
          v-model="chartParams.status"
          class="bg-slate-50 border-none rounded-xl px-3 py-2 text-[11px] font-bold text-slate-600 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All Status</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>

        <select
          v-model="chartParams.month"
          class="bg-slate-50 border-none rounded-xl px-3 py-2 text-[11px] font-bold text-slate-600 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All Months</option>
          <option v-for="m in months" :key="m.value" :value="m.value">
            {{ m.label }}
          </option>
        </select>

        <select
          v-model="chartParams.year"
          class="bg-slate-50 border-none rounded-xl px-3 py-2 text-[11px] font-bold text-slate-600 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All Years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <!-- SVG Chart Container -->
      <Card
        class="p-6 border-none shadow-[0_4px_25px_rgba(0,0,0,0.02)] bg-white rounded-[2.2rem] min-h-[300px] flex flex-col"
      >
        <template v-if="isChartLoading">
          <div class="flex-1 flex items-center justify-center">
            <div
              class="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"
            ></div>
          </div>
        </template>
        <template v-else-if="!chartData.length">
          <div
            class="flex-1 flex flex-col items-center justify-center text-slate-400"
          >
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mb-2 opacity-20"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span class="text-xs font-bold uppercase tracking-widest"
              >No data available</span
            >
          </div>
        </template>
        <template v-else>
          <!-- Chart Container with Y-Axis -->
          <div class="flex-1 flex gap-4 h-[240px] mt-4">
            <!-- Y-Axis Labels -->
            <div
              class="flex flex-col justify-between text-[8px] font-black text-slate-300 uppercase h-[200px] py-0.5 text-right min-w-[32px] pointer-events-none"
            >
              <span v-for="(label, i) in yAxisLabels" :key="i">
                {{ formatYAxis(label) }}
              </span>
            </div>

            <!-- Chart Area -->
            <div
              class="flex-1 flex items-end justify-between gap-3 h-[200px] relative mt-0.5"
            >
              <!-- Horizontal Grid Lines -->
              <div
                class="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0.5"
              >
                <div
                  v-for="i in 5"
                  :key="i"
                  class="border-t border-slate-50 w-full"
                ></div>
              </div>

              <!-- Bars Container -->
              <div
                v-for="(item, idx) in chartData"
                :key="idx"
                class="flex-1 flex flex-col items-center group relative h-full z-10 mx-1 cursor-pointer select-none"
                @click="toggleBar(idx)"
              >
                <!-- Revenue Bar (Secondary - light indigo) -->
                <div
                  class="w-full bg-indigo-100/50 rounded-t-md transition-all duration-700 absolute bottom-0 z-0"
                  :style="{
                    height: `${(item.totalRevenue / Math.max(...chartData.map((d) => d.totalRevenue), 1)) * 100}%`,
                  }"
                ></div>

                <!-- Order Count Bar (Primary - blue gradient) -->
                <div
                  class="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-700 absolute bottom-0 z-10 shadow-sm"
                  :style="{
                    height: `${(item.orderCount / Math.max(maxOrders, 1)) * 100}%`,
                  }"
                >
                  <!-- Premium Interactive Tooltip -->
                  <div
                    class="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 text-white p-2.5 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 shadow-2xl z-[100] border border-white/10 pointer-events-none"
                    :class="[
                      activeBarIndex === idx
                        ? 'opacity-100 scale-100 translate-y-0 visible'
                        : 'opacity-0 scale-95 translate-y-2 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:visible',
                    ]"
                  >
                    <!-- Order Count -->
                    <div
                      class="text-[10px] font-black text-blue-400 leading-none uppercase tracking-wider"
                    >
                      {{ item.orderCount }} Orders
                    </div>
                    <!-- Revenue Label -->
                    <div
                      class="text-[9px] font-bold text-slate-300 leading-none whitespace-nowrap"
                    >
                      {{
                        new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(item.totalRevenue)
                      }}
                    </div>
                    <!-- Tooltip Arrow -->
                    <div
                      class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-800 rotate-45"
                    ></div>
                  </div>
                </div>

                <!-- Date Label -->
                <div class="absolute -bottom-8 left-0 right-0 text-center">
                  <span
                    class="text-[8px] font-black text-slate-400 uppercase tracking-tighter truncate block px-1"
                  >
                    {{
                      new Date(item.period).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
