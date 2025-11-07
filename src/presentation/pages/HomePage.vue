<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <v-container class="py-16">
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" lg="6" class="text-center">
            <div class="hero-content">
              <v-icon size="100" color="primary" class="mb-6">mdi-food</v-icon>
              <h1 class="text-h2 text-md-h1 font-weight-bold mb-4">
                CantinaSoft
              </h1>
              <p class="text-h5 text-md-h4 mb-2 text-medium-emphasis">
                Sistema de Gerenciamento
              </p>
              <p class="text-h6 mb-8 text-medium-emphasis">
                Cantinas e Bares Escolares
              </p>
              <v-btn
                @click="router.push({ name: 'login' })"
                size="x-large"
                color="primary"
                elevation="4"
                class="px-12 py-6"
              >
                <v-icon start>mdi-login</v-icon>
                Acessar Sistema
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features Section -->
    <section class="features-section py-16">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-8">
            <h2 class="text-h3 font-weight-bold mb-4">Funcionalidades</h2>
            <p class="text-h6 text-medium-emphasis">
              Tudo que você precisa para gerenciar seu negócio
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="feature in features"
            :key="feature.title"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              class="feature-card h-100"
              elevation="2"
              :ripple="false"
            >
              <v-card-text class="text-center pa-8">
                <v-avatar
                  :color="feature.color"
                  size="80"
                  class="mb-4"
                >
                  <v-icon size="48" color="white">{{ feature.icon }}</v-icon>
                </v-avatar>
                <h3 class="text-h5 font-weight-bold mb-3">{{ feature.title }}</h3>
                <p class="text-body-1 text-medium-emphasis">
                  {{ feature.description }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section py-16">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-8">
            <h2 class="text-h3 font-weight-bold mb-4">Por que escolher o CantinaSoft?</h2>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="benefit in benefits"
            :key="benefit.title"
            cols="12"
            md="6"
          >
            <div class="d-flex align-start mb-6">
              <v-icon
                :color="benefit.color"
                size="32"
                class="mr-4 mt-1"
              >
                {{ benefit.icon }}
              </v-icon>
              <div>
                <h4 class="text-h6 font-weight-bold mb-2">{{ benefit.title }}</h4>
                <p class="text-body-1 text-medium-emphasis">{{ benefit.description }}</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-16 text-center">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <h2 class="text-h3 font-weight-bold mb-4">
              Pronto para começar?
            </h2>
            <p class="text-h6 text-medium-emphasis mb-8">
              Acesse o sistema e comece a gerenciar sua cantina de forma profissional
            </p>
            <v-btn
              @click="router.push({ name: 'login' })"
              size="x-large"
              color="primary"
              elevation="4"
              class="px-12 py-6"
            >
              <v-icon start>mdi-login</v-icon>
              Fazer Login
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Footer -->
    <footer class="footer-section py-8 text-center">
      <v-container>
        <p class="text-medium-emphasis mb-2">
          &copy; {{ new Date().getFullYear() }} CantinaSoft. Todos os direitos reservados.
        </p>
        <p class="text-caption text-medium-emphasis">
          Sistema de Gerenciamento de Cantinas e Bares Escolares
        </p>
      </v-container>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    title: 'Gestão de Vendas',
    description: 'Controle completo de vendas, faturamento e histórico de transações',
    icon: 'mdi-cash-register',
    color: 'success',
  },
  {
    title: 'Controle de Estoque',
    description: 'Gerencie produtos, inventário e alertas de reposição em tempo real',
    icon: 'mdi-package-variant',
    color: 'info',
  },
  {
    title: 'Relatórios',
    description: 'Análises detalhadas de desempenho e métricas do seu negócio',
    icon: 'mdi-chart-line',
    color: 'warning',
  },
  {
    title: 'Gestão de Clientes',
    description: 'Cadastro completo de clientes com controle de saldo e histórico',
    icon: 'mdi-account-group',
    color: 'purple',
  },
  {
    title: 'Múltiplos Usuários',
    description: 'Sistema de permissões com diferentes níveis de acesso',
    icon: 'mdi-account-multiple',
    color: 'orange',
  },
  {
    title: 'Segurança',
    description: 'Autenticação segura e proteção de dados dos seus clientes',
    icon: 'mdi-shield-check',
    color: 'red',
  },
]

const benefits = [
  {
    title: 'Fácil de usar',
    description: 'Interface intuitiva e moderna que qualquer pessoa pode usar sem dificuldades',
    icon: 'mdi-check-circle',
    color: 'success',
  },
  {
    title: 'Acesso em qualquer lugar',
    description: 'Sistema web responsivo que funciona em computadores, tablets e smartphones',
    icon: 'mdi-check-circle',
    color: 'success',
  },
  {
    title: 'Dados em tempo real',
    description: 'Informações sempre atualizadas sobre vendas, estoque e movimentações',
    icon: 'mdi-check-circle',
    color: 'success',
  },
  {
    title: 'Suporte completo',
    description: 'Documentação detalhada e suporte técnico para auxiliar na utilização',
    icon: 'mdi-check-circle',
    color: 'success',
  },
]
</script>

<style scoped lang="scss">
.landing-page {
  min-height: 100vh;
}

.hero-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.05) 100%);
}

.hero-content {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card {
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  }
}

.features-section {
  background: rgba(var(--v-theme-surface), 1);
}

.benefits-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.03) 0%, rgba(var(--v-theme-secondary), 0.03) 100%);
}

.cta-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08) 0%, rgba(var(--v-theme-secondary), 0.08) 100%);
}

.footer-section {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

// Responsive adjustments
@media (max-width: 960px) {
  .hero-section {
    min-height: 70vh;
  }

  .text-h1 {
    font-size: 2.5rem !important;
  }

  .text-h2 {
    font-size: 2rem !important;
  }
}

@media (max-width: 600px) {
  .hero-section {
    min-height: 60vh;
  }

  .text-h1 {
    font-size: 2rem !important;
  }

  .text-h2 {
    font-size: 1.75rem !important;
  }

  .text-h3 {
    font-size: 1.5rem !important;
  }
}
</style>
