<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/" />
        <v-list-item prepend-icon="mdi-food" title="Produtos" to="/produtos" />
        <v-list-item prepend-icon="mdi-cart" title="Vendas" to="/vendas" />
        <v-list-item prepend-icon="mdi-account-group" title="Clientes" to="/clientes" />
        <v-list-item prepend-icon="mdi-chart-bar" title="Relatórios" to="/relatorios" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>CantinaSoft</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="handleLogout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(true)

const handleLogout = () => {
  router.push('/login')
}
</script>

<style scoped lang="scss">
// Estilos do layout
</style>
