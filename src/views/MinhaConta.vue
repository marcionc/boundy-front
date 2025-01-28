<template>
  <div class="minha-conta-container">
    <div class="account-header">
      <h1>Minha Conta</h1>
    </div>

    <div class="account-sections">
      <!-- Informações Pessoais -->
      <section class="account-section personal-info">
        <div class="section-header">
          <h2>Informações Pessoais</h2>
          <button 
            @click="enablePersonalInfoEdit" 
            class="edit-button"
          >
            <Icon name="edit" />
          </button>
        </div>

        <form @submit.prevent="updatePersonalInfo" class="personal-info-form">
          <div class="form-group">
            <label for="fullName">Nome Completo</label>
            <input 
              id="fullName" 
              v-model="personalInfo.fullName" 
              :disabled="!isPersonalInfoEditing"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">E-mail</label>
            <input 
              id="email" 
              v-model="personalInfo.email" 
              type="email"
              :disabled="!isPersonalInfoEditing"
              required
            />
          </div>

          <div class="form-group">
            <label for="phone">Telefone</label>
            <input 
              id="phone" 
              v-model="personalInfo.phone" 
              type="tel"
              :disabled="!isPersonalInfoEditing"
            />
          </div>

          <div 
            v-if="isPersonalInfoEditing" 
            class="form-actions"
          >
            <button 
              type="submit" 
              class="save-button"
            >
              Salvar Alterações
            </button>
            <button 
              type="button" 
              class="cancel-button" 
              @click="cancelPersonalInfoEdit"
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <!-- Segurança da Conta -->
      <section class="account-section security">
        <div class="section-header">
          <h2>Segurança</h2>
        </div>

        <div class="security-options">
          <div class="security-option">
            <h3>Alterar Senha</h3>
            <p>Recomendamos alterar sua senha periodicamente</p>
            <button 
              @click="openChangePasswordModal" 
              class="action-button"
            >
              Alterar Senha
            </button>
          </div>

          <div class="security-option danger-zone">
            <h3>Excluir Conta</h3>
            <p>Esta ação é irreversível e excluirá todos os seus dados</p>
            <button 
              @click="openDeleteAccountModal" 
              class="delete-button"
            >
              Excluir Conta
            </button>
          </div>
        </div>
      </section>

      <!-- Planos -->
      <section class="account-section plans">
        <div class="section-header">
          <h2>Meu Plano</h2>
        </div>

        <div class="current-plan">
          <div class="plan-details">
            <h3>{{ currentPlan.name }}</h3>
            <p>{{ currentPlan.description }}</p>
            <div class="plan-pricing">
              <span class="plan-price">R$ {{ currentPlan.price }}/mês</span>
            </div>
          </div>

          <div class="plan-actions">
            <button 
              @click="openChangePlanModal" 
              class="change-plan-button"
            >
              Alterar Plano
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Modais -->
    <Modal 
      v-model="changePasswordModal" 
      title="Alterar Senha" 
      icon="lock"
      @confirm="changePassword"
    >
      <div class="change-password-form">
        <div class="form-group">
          <label for="currentPassword">Senha Atual</label>
          <input 
            id="currentPassword" 
            v-model="passwordChange.currentPassword" 
            type="password" 
            required 
          />
        </div>
        <div class="form-group">
          <label for="newPassword">Nova Senha</label>
          <input 
            id="newPassword" 
            v-model="passwordChange.newPassword" 
            type="password" 
            required 
          />
        </div>
        <div class="form-group">
          <label for="confirmNewPassword">Confirmar Nova Senha</label>
          <input 
            id="confirmNewPassword" 
            v-model="passwordChange.confirmNewPassword" 
            type="password" 
            required 
          />
        </div>
      </div>
    </Modal>

    <Modal 
      v-model="deleteAccountModal" 
      title="Excluir Conta" 
      icon="warning"
      variant="danger"
      @confirm="deleteAccount"
    >
      <div class="delete-account-confirmation">
        <p>Tem certeza que deseja excluir sua conta? Esta ação é irreversível.</p>
        <div class="form-group">
          <label for="deleteConfirmation">Digite "EXCLUIR" para confirmar</label>
          <input 
            id="deleteConfirmation" 
            v-model="deleteConfirmation" 
            type="text" 
          />
        </div>
      </div>
    </Modal>

    <Modal 
      v-model="changePlanModal" 
      title="Alterar Plano" 
      icon="credit-card"
    >
      <div class="plans-list">
        <div 
          v-for="plan in availablePlans" 
          :key="plan.id" 
          class="plan-option"
          :class="{ 'selected': selectedPlan === plan.id }"
          @click="selectPlan(plan.id)"
        >
          <h3>{{ plan.name }}</h3>
          <p>{{ plan.description }}</p>
          <span class="plan-price">R$ {{ plan.price }}/mês</span>
        </div>
      </div>
      <div class="plan-change-actions">
        <button 
          @click="confirmPlanChange" 
          :disabled="!selectedPlan"
        >
          Confirmar Mudança
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePlanStore } from '@/stores/plans'
import Icon from '@/components/icons/Icon.vue'
import Modal from '@/components/Modal.vue'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const planStore = usePlanStore()
const toast = useToast()

// Estados de edição
const isPersonalInfoEditing = ref(false)
const personalInfo = reactive({
  fullName: '',
  email: '',
  phone: ''
})

// Modais
const changePasswordModal = ref(false)
const deleteAccountModal = ref(false)
const changePlanModal = ref(false)

// Dados de alteração de senha
const passwordChange = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

// Confirmação de exclusão de conta
const deleteConfirmation = ref('')

// Planos
const currentPlan = ref({
  name: 'Plano Básico',
  description: 'Acesso a todos os simulados básicos',
  price: '49,90'
})

const availablePlans = ref([
  {
    id: 1,
    name: 'Plano Básico',
    description: 'Acesso a todos os simulados básicos',
    price: '49,90'
  },
  {
    id: 2,
    name: 'Plano Premium',
    description: 'Acesso a todos os simulados e conteúdos exclusivos',
    price: '99,90'
  }
])

const selectedPlan = ref(null)

onMounted(async () => {
  try {
    // Buscar informações do usuário
    const userData = await authStore.fetchUserProfile()
    personalInfo.fullName = userData.full_name
    personalInfo.email = userData.email
    personalInfo.phone = userData.phone

    // Buscar plano atual
    const planData = await planStore.getCurrentPlan()
    currentPlan.value = planData
  } catch (error) {
    toast.error('Erro ao carregar informações da conta')
  }
})

// Métodos de edição de informações pessoais
function enablePersonalInfoEdit() {
  isPersonalInfoEditing.value = true
}

function cancelPersonalInfoEdit() {
  isPersonalInfoEditing.value = false
}

async function updatePersonalInfo() {
  try {
    await authStore.updateProfile({
      full_name: personalInfo.fullName,
      email: personalInfo.email,
      phone: personalInfo.phone
    })
    toast.success('Informações atualizadas com sucesso')
    isPersonalInfoEditing.value = false
  } catch (error) {
    toast.error('Erro ao atualizar informações')
  }
}

// Métodos de alteração de senha
function openChangePasswordModal() {
  changePasswordModal.value = true
}

async function changePassword() {
  if (passwordChange.newPassword !== passwordChange.confirmNewPassword) {
    toast.error('As senhas não coincidem')
    return
  }

  try {
    await authStore.changePassword({
      current_password: passwordChange.currentPassword,
      new_password: passwordChange.newPassword
    })
    toast.success('Senha alterada com sucesso')
    changePasswordModal.value = false
    
    // Limpar campos
    passwordChange.currentPassword = ''
    passwordChange.newPassword = ''
    passwordChange.confirmNewPassword = ''
  } catch (error) {
    toast.error('Erro ao alterar senha')
  }
}

// Métodos de exclusão de conta
function openDeleteAccountModal() {
  deleteAccountModal.value = true
}

async function deleteAccount() {
  if (deleteConfirmation.value.toUpperCase() !== 'EXCLUIR') {
    toast.error('Confirmação inválida')
    return
  }

  try {
    await authStore.deleteAccount()
    toast.success('Conta excluída com sucesso')
    // Redirecionar para página inicial ou login
  } catch (error) {
    toast.error('Erro ao excluir conta')
  }
}

// Métodos de alteração de plano
function openChangePlanModal() {
  changePlanModal.value = true
}

function selectPlan(planId) {
  selectedPlan.value = planId
}

async function confirmPlanChange() {
  if (!selectedPlan.value) return

  try {
    await planStore.changePlan(selectedPlan.value)
    toast.success('Plano alterado com sucesso')
    changePlanModal.value = false
    
    // Atualizar plano atual
    const newPlan = availablePlans.value.find(p => p.id === selectedPlan.value)
    currentPlan.value = newPlan
  } catch (error) {
    toast.error('Erro ao alterar plano')
  }
}
</script>

<style scoped>
.minha-conta-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.account-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.account-sections {
  display: grid;
  gap: var(--spacing-xl);
}

.account-section {
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.edit-button {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
}

.personal-info-form .form-group {
  margin-bottom: var(--spacing-md);
}

.personal-info-form label {
  display: block;
  margin-bottom: var(--spacing-xs);
}

.personal-info-form input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--cloud-white);
  border-radius: var(--border-radius-md);
}

.personal-info-form input:disabled {
  background-color: var(--cloud-white);
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.save-button, .cancel-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: none;
  cursor: pointer;
}

.save-button {
  background-color: var(--primary-color);
  color: var(--white);
}

.cancel-button {
  background-color: var(--cloud-white);
  color: var(--text-color);
}

.security-options {
  display: grid;
  gap: var(--spacing-lg);
}

.security-option {
  background-color: var(--cloud-white);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}

.danger-zone {
  border: 2px solid var(--danger-color);
}

.action-button, .delete-button {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
}

.action-button {
  background-color: var(--primary-color);
  color: var(--white);
}

.delete-button {
  background-color: var(--danger-color);
  color: var(--white);
}

.current-plan {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--cloud-white);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}

.plan-details h3 {
  margin: 0 0 var(--spacing-xs) 0;
}

.plan-details p {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--secondary-text-color);
}

.plan-price {
  font-weight: bold;
  color: var(--primary-color);
}

.change-plan-button {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
}

.plans-list {
  display: grid;
  gap: var(--spacing-md);
}

.plan-option {
  border: 2px solid var(--cloud-white);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.plan-option:hover {
  border-color: var(--primary-color);
}

.plan-option.selected {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
}

.plan-change-actions {
  margin-top: var(--spacing-lg);
  text-align: center;
}

.plan-change-actions button {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
}

.plan-change-actions button:disabled {
  background-color: var(--cloud-white);
  cursor: not-allowed;
}
</style>
