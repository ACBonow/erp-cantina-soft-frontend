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
              <h2 class="text-h6 mb-6">Criar nova senha</h2>

              <!-- Token inválido ou ausente -->
              <v-alert v-if="!token" type="error" variant="tonal" class="mb-4">
                Link inválido ou expirado. Solicite um novo link de redefinição.
              </v-alert>

              <!-- Sucesso -->
              <template v-else-if="success">
                <v-alert type="success" variant="tonal" class="mb-6">
                  Senha redefinida com sucesso!
                </v-alert>
                <v-btn block size="large" color="primary" @click="router.push('/login')">
                  <v-icon start>mdi-login</v-icon>
                  Ir para o login
                </v-btn>
              </template>

              <!-- Formulário -->
              <template v-else>
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

                <v-form ref="formRef" @submit.prevent="handleSubmit">
                  <v-text-field
                    v-model="password"
                    label="Nova senha"
                    prepend-inner-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    required
                    :disabled="authStore.loading"
                    :rules="[rules.required, rules.minLength]"
                    class="mb-4"
                    @click:append-inner="showPassword = !showPassword"
                  />

                  <v-text-field
                    v-model="passwordConfirm"
                    label="Confirmar nova senha"
                    prepend-inner-icon="mdi-lock-check"
                    :type="showPasswordConfirm ? 'text' : 'password'"
                    :append-inner-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                    required
                    :disabled="authStore.loading"
                    :rules="[rules.required, rules.match]"
                    @click:append-inner="showPasswordConfirm = !showPasswordConfirm"
                  />

                  <v-btn
                    type="submit"
                    block
                    size="large"
                    class="mt-4"
                    color="primary"
                    :loading="authStore.loading"
                    :disabled="authStore.loading"
                  >
                    <v-icon start>mdi-lock-reset</v-icon>
                    Redefinir senha
                  </v-btn>
                </v-form>
              </template>

              <v-btn
                v-if="!success"
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
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const token = route.query.token as string | undefined
const formRef = ref()
const password = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const success = ref(false)

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  minLength: (v: string) => v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres',
  match: (v: string) => v === password.value || 'As senhas não coincidem',
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid || !token) return

  try {
    await authStore.resetPassword(token, password.value)
    success.value = true
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
