<template>
  <div class="login-wrapper">
    <v-container fluid fill-height class="login-container">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card elevation="8" class="mx-auto">
            <v-card-title class="text-h4 text-center py-6 bg-primary">
              <v-icon size="48" class="mr-2">mdi-food</v-icon>
              CantinaSoft
            </v-card-title>

            <v-card-text class="pa-8">
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="email"
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  required
                  class="mb-4"
                />

                <v-text-field
                  v-model="password"
                  label="Senha"
                  prepend-inner-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  required
                  @click:append-inner="showPassword = !showPassword"
                />

                <v-btn type="submit" block size="large" class="mt-6" color="primary">
                  Entrar
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = () => {
  // Lógica de login será implementada posteriormente
  console.log('Login:', { email: email.value, password: password.value })
  router.push('/')
}
</script>

<style scoped lang="scss">
.login-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.login-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.v-card-title {
  color: white;
}
</style>
