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
              <h2 class="text-h6 mb-2">Esqueceu a senha?</h2>
              <p class="text-body-2 text-medium-emphasis mb-6">
                Informe seu e-mail cadastrado e enviaremos um link para criar uma nova senha.
              </p>

              <v-alert
                v-if="success"
                type="success"
                variant="tonal"
                class="mb-4"
              >
                {{ success }}
              </v-alert>

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

              <v-form v-if="!success" ref="formRef" @submit.prevent="handleSubmit">
                <v-text-field
                  v-model="email"
                  label="E-mail"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  required
                  :disabled="authStore.loading"
                  :rules="[rules.required, rules.email]"
                  class="mb-4"
                />

                <v-btn
                  type="submit"
                  block
                  size="large"
                  color="primary"
                  :loading="authStore.loading"
                  :disabled="authStore.loading"
                >
                  <v-icon start>mdi-email-send</v-icon>
                  Enviar link de redefinição
                </v-btn>
              </v-form>

              <v-btn
                variant="text"
                block
                class="mt-4"
                prepend-icon="mdi-arrow-left"
                @click="router.push('/login')"
              >
                Voltar ao login
              </v-btn>
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
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref()
const email = ref('')
const success = ref<string | null>(null)

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido',
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    await authStore.forgotPassword(email.value)
    success.value = 'Se este e-mail estiver cadastrado, você receberá as instruções em breve. Verifique sua caixa de entrada.'
  } catch {
    // erro já está na store
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
