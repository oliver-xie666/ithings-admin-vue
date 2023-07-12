import { computed } from 'vue'
import { useThemeStore } from '@/store'

export function useDesignSetting() {
  const designStore = useThemeStore()

  const getDarkTheme = computed(() => designStore.naiveTheme)

  return {
    getDarkTheme,
  }
}
