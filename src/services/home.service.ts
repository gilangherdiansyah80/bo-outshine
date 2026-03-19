import { ref, onMounted } from 'vue'
import { HOME_MOCK } from '@/mocks/home.mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export interface HomeItem {
  id: string
  title: string
}

export const getHome = async (): Promise<HomeItem[]> => {
  if (USE_MOCK) return HOME_MOCK

  const res = await fetch('/api/home')
  return res.json()
}

export const useHome = () => {
  const data = ref<HomeItem[] | null>(null)
  const isLoading = ref(true)
  const error = ref<Error | null>(null)

  onMounted(async () => {
    try {
      data.value = await getHome()
    } catch (e) {
      error.value = e as Error
    } finally {
      isLoading.value = false
    }
  })

  return { data, isLoading, error }
}
