<template>
  <v-card
    :to="count > 0 ? '/inventory' : undefined"
    :class="{ 'cursor-pointer': count > 0 }"
    elevation="2"
    hover
  >
    <v-card-text class="d-flex align-center">
      <v-avatar :color="count > 0 ? 'warning' : 'success'" size="56" class="mr-4">
        <v-icon size="32">
          {{ count > 0 ? 'mdi-alert' : 'mdi-check-circle' }}
        </v-icon>
      </v-avatar>

      <div class="flex-grow-1">
        <div class="text-caption text-medium-emphasis text-uppercase">
          Produtos com Estoque Baixo
        </div>
        <div :class="['text-h4 font-weight-bold', count > 0 ? 'text-warning' : 'text-success']">
          {{ loading ? '...' : count }}
        </div>
        <div class="text-caption text-medium-emphasis">
          {{ count === 0 ? 'Tudo OK!' : count === 1 ? '1 produto precisa de reposição' : `${count} produtos precisam de reposição` }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productRepository } from '@/infrastructure/repositories/ProductRepository'

const count = ref(0)
const loading = ref(true)

onMounted(async () => {
  try {
    loading.value = true
    const products = await productRepository.getProductsNeedingReorder()
    count.value = products.length
  } catch (error) {
    console.error('Erro ao carregar produtos com estoque baixo:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
