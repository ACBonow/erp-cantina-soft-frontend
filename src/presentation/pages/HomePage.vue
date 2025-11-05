<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="text-h4 text-center py-8">
              Bem-vindo ao CantinaSoft
            </v-card-title>
            <v-card-text class="text-center">
              <p class="text-h6 mb-4">Sistema de Gerenciamento de Cantinas e Bares Escolares</p>
              <v-icon size="120" color="primary">mdi-food</v-icon>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col v-for="feature in features" :key="feature.title" cols="12" md="4">
          <v-card height="100%">
            <v-card-text class="text-center">
              <v-icon size="64" :color="feature.color">{{ feature.icon }}</v-icon>
              <h3 class="mt-4">{{ feature.title }}</h3>
              <p class="mt-2">{{ feature.description }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'

const { t } = useI18n()
const { isDark, toggleTheme } = useTheme()
const { toggleLocale } = useLocale()

const features = [
  {
    title: 'Gestão de Vendas',
    description: 'Controle completo de vendas e faturamento',
    icon: 'mdi-cash-register',
    color: 'success',
  },
  {
    title: 'Controle de Estoque',
    description: 'Gerencie produtos e inventário em tempo real',
    icon: 'mdi-package-variant',
    color: 'info',
  },
  {
    title: 'Relatórios',
    description: 'Relatórios detalhados e análises de desempenho',
    icon: 'mdi-chart-line',
    color: 'warning',
  },
]
</script>

<style scoped lang="scss">
.v-card {
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
}
</style>
