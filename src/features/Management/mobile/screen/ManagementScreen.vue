<script setup lang="ts">
import { ref } from "vue";
import ManagementTabs from "../components/ManagementTabs.vue";

/**
 * ManagementScreen - Central management dashboard for mobile
 */
const activeTab = ref("Product");
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-safe">
    <!-- Header -->
    <div class="bg-white px-6 pt-5 pb-4">
      <h1 class="text-2xl font-black text-[#0F172A] tracking-tight">Management</h1>
      <p class="text-[13px] text-slate-500 font-medium">Manage your store resources.</p>
    </div>

    <!-- Tabs Container -->
    <div class="sticky top-16 z-[60]">
      <ManagementTabs v-model="activeTab" />
    </div>

    <!-- Content Area (Placeholders) -->
    <div class="p-5 mt-2">
      <div 
        class="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center"
      >
        <div class="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-300">
           <svg 
             viewBox="0 0 24 24" 
             width="40" 
             height="40" 
             fill="none" 
             stroke="currentColor" 
             stroke-width="2"
             stroke-linecap="round"
             stroke-linejoin="round"
            >
             <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
             <line x1="3" y1="9" x2="21" y2="9"/>
             <line x1="9" y1="21" x2="9" y2="9"/>
           </svg>
        </div>
        
        <h3 class="text-xl font-black text-slate-800 tracking-tight mb-2 uppercase">
          {{ activeTab }} Section
        </h3>
        
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[2px] px-4 leading-relaxed">
          The {{ activeTab.toLowerCase() }} management module is currently being optimized for mobile experience.
        </p>
        
        <button class="mt-8 px-8 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-black/10 active:scale-95 transition-all">
          Coming Soon
        </button>
      </div>
    </div>
  </div>
</template>
