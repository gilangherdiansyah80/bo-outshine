<script setup lang="ts">
import MobileLayout from "@/features/Layout/MobileLayout/MobileLayout.vue";
import Card from "@/shared/ui/Card.vue";
</script>

<template>
  <MobileLayout>
    <div class="px-6 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-black text-[#0F172A] tracking-tight">Dashboard</h1>
        <p class="text-gray-500 font-medium">Welcome back to Outshine Management.</p>
      </div>

      <!-- Quick Stats / Cards -->
      <div class="grid grid-cols-2 gap-4">
        <div class="p-6 rounded-3xl shadow-lg bg-blue-600 text-white flex flex-col justify-between min-h-[140px] transform hover:scale-[1.02] transition-all">
          <div>
            <div class="text-[11px] font-black uppercase tracking-[2px] opacity-80 mb-2">TOTAL SALES</div>
            <div class="text-2xl font-black tracking-tight">$42,580</div>
          </div>
          <div class="text-[11px] bg-white/20 w-fit px-3 py-1 rounded-full font-bold backdrop-blur-md">+12.5%</div>
        </div>
        
        <Card class="p-2 border-none shadow-sm bg-white rounded-3xl flex flex-col justify-between min-h-[140px] transform hover:scale-[1.02] transition-all">
          <div>
            <div class="text-[11px] font-black uppercase tracking-[2px] text-gray-400 mb-2">ACTIVE ITEMS</div>
            <div class="text-2xl font-black text-[#0F172A] tracking-tight">842</div>
          </div>
          <div class="text-[11px] bg-green-50 text-green-600 w-fit px-3 py-1 rounded-full font-bold">STABLE</div>
        </Card>
      </div>
    </div>
  </MobileLayout>
</template>

