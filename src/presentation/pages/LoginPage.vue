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
              <!-- Error Alert -->
              <v-alert
                v-if="authStore.error"
                type="error"
                variant="tonal"
                closable
                class="mb-4"
                @click:close="authStore.error = null"
              >
                {{ authStore.error }}
              </v-alert>

              <v-form ref="formRef" @submit.prevent="handleLogin">
                <v-text-field
                  v-model="email"
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  required
                  :disabled="authStore.loading"
                  :rules="[rules.required, rules.email]"
                  class="mb-4"
                />

                <v-text-field
                  v-model="password"
                  label="Senha"
                  prepend-inner-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  required
                  :disabled="authStore.loading"
                  :rules="[rules.required, rules.minLength]"
                  @click:append-inner="showPassword = !showPassword"
                />

                <v-btn
                  type="submit"
                  block
                  size="large"
                  class="mt-6"
                  color="primary"
                  :loading="authStore.loading"
                  :disabled="authStore.loading"
                >
                  <v-icon start>mdi-login</v-icon>
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
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formRef = ref()
const email = ref('')
const password = ref('')
const showPassword = ref(false)

// Validation rules
const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
  minLength: (v: string) => v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres',
}

const handleLogin = async () => {
  // Validate form
  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    // Call login action from store
    await authStore.login({
      email: email.value,
      password: password.value,
    })

    // Redirect to the page user was trying to access or dashboard
    const redirectTo = (route.query.redirect as string) || '/dashboard'
    await router.push(redirectTo)
  } catch (error: any) {
    // Error is already handled in the store and displayed in the alert
    console.error('Login error:', error)
  }
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
