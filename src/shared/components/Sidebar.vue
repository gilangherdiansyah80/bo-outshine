<script setup lang="ts">
/**
 * Sidebar Component
 * Main navigation for the admin dashboard
 */
const menuItems = [
  { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/' },
  { name: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', href: '/orders' },
  { name: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', href: '/products' },
  { name: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', href: '/customers' },
  { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', href: '/settings' },
]
</script>

<template>
  <aside class="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
    <div class="flex items-center gap-x-3 px-2">
      <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-xl">O</span>
      </div>
      <span class="text-xl font-bold text-gray-800 dark:text-white">OUTSHINE</span>
    </div>

    <div class="flex flex-col justify-between flex-1 mt-6">
      <nav class="flex-1 -mx-3 space-y-3">
        <a 
          v-for="item in menuItems" 
          :key="item.name"
          :href="item.href"
          class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :d="item.icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="mx-2 text-sm font-medium">{{ item.name }}</span>
        </a>
      </nav>

      <div class="mt-6">
        <div class="p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
          <h2 class="text-sm font-medium text-gray-800 dark:text-white">New feature available!</h2>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Check out our new inventory tracking system.</p>
          <button class="mt-2 text-xs font-semibold text-blue-600 uppercase dark:text-blue-400">View features</button>
        </div>

        <div class="flex items-center justify-between mt-6">
          <a href="#" class="flex items-center gap-x-2">
            <img class="object-cover rounded-full h-7 w-7" src="https://ui-avatars.com/api/?name=Gilang+Admin" alt="avatar" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Gilang Admin</span>
          </a>
          
          <button class="text-gray-500 transition-colors duration-200 rotate-180 dark:text-gray-400 rtl:rotate-0 hover:text-blue-500 dark:hover:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
