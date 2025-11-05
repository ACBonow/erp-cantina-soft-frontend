import { createI18n } from 'vue-i18n'
import ptBR from './locales/pt-BR.json'
import enUS from './locales/en-US.json'

export type MessageSchema = typeof ptBR

const i18n = createI18n<[MessageSchema], 'pt-BR' | 'en-US'>({
  legacy: false,
  locale: localStorage.getItem('locale') || 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages: {
    'pt-BR': ptBR,
    'en-US': enUS,
  },
})

export default i18n
