import { ref, watch } from 'vue'
import { useTheme as useVuetifyTheme } from 'vuetify'

const isDark = ref(localStorage.getItem('theme') === 'dark')

export function useTheme() {
  const vuetifyTheme = useVuetifyTheme()

  // Inicializar tema
  vuetifyTheme.global.name.value = isDark.value ? 'dark' : 'light'

  // Observar mudanças
  watch(isDark, (newValue) => {
    vuetifyTheme.global.name.value = newValue ? 'dark' : 'light'
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
  })

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function setTheme(theme: 'light' | 'dark') {
    isDark.value = theme === 'dark'
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
  }
}
