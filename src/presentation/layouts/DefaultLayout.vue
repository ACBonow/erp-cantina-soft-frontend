<template>
  <v-app>
    <AppBar @toggle-drawer="drawer = !drawer" />
    <NavigationDrawer v-model="drawer" />

    <v-main>
      <v-container fluid class="pa-4">
        <router-view />
      </v-container>
    </v-main>

    <NotificationContainer />
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppBar from '../components/AppBar.vue'
import NavigationDrawer from '../components/NavigationDrawer.vue'
import NotificationContainer from '../components/NotificationContainer.vue'

const drawer = ref(true)
</script>
