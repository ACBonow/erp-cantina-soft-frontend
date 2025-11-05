import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const currentLocale = ref(localStorage.getItem('locale') || 'pt-BR')

export function useLocale() {
  const { locale } = useI18n()

  // Inicializar locale
  locale.value = currentLocale.value

  // Observar mudanças
  watch(currentLocale, (newValue) => {
    locale.value = newValue
    localStorage.setItem('locale', newValue)
  })

  function setLocale(newLocale: 'pt-BR' | 'en-US') {
    currentLocale.value = newLocale
  }

  function toggleLocale() {
    currentLocale.value = currentLocale.value === 'pt-BR' ? 'en-US' : 'pt-BR'
  }

  return {
    currentLocale,
    setLocale,
    toggleLocale,
  }
}
