<template>
    <div class="register-container">
        <div class="register-content">
            <div class="brand">
                <Icon name="plane" color="white" size="48px" class="brand-icon" />
                <h1 class="brand-name">Bounky</h1>
            </div>
            
            <form @submit.prevent="handleRegister" class="register-form">
                <h2>Criar Conta</h2>
                <p class="subtitle">Preencha os dados para se cadastrar</p>

                <div class="form-group">
                    <label for="fullName">Nome Completo:</label>
                    <div class="input-wrapper">
                        <Icon name="user" class="input-icon" color="var(--secondary-color)" />
                        <input 
                            id="fullName" 
                            v-model="formData.fullName" 
                            type="text" 
                            required 
                            placeholder="Digite seu nome completo"
                        >
                    </div>
                </div>

                <div class="form-group">
                    <label for="email">E-mail:</label>
                    <div class="input-wrapper">
                        <Icon name="mail" class="input-icon" color="var(--secondary-color)" />
                        <input 
                            id="email" 
                            v-model="formData.email" 
                            type="email" 
                            required 
                            placeholder="Digite seu e-mail"
                        >
                    </div>
                </div>

                <div class="form-group">
                    <label for="phone">Telefone:</label>
                    <div class="input-wrapper">
                        <Icon name="phone" class="input-icon" color="var(--secondary-color)" />
                        <input 
                            id="phone" 
                            v-model="formData.phone" 
                            type="tel" 
                            placeholder="Digite seu telefone"
                        >
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">Senha:</label>
                    <div class="input-wrapper">
                        <Icon name="lock" class="input-icon" color="var(--secondary-color)" />
                        <input 
                            id="password" 
                            v-model="formData.password" 
                            type="password" 
                            required 
                            placeholder="Digite sua senha"
                        >
                    </div>
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirmar Senha:</label>
                    <div class="input-wrapper">
                        <Icon name="lock" class="input-icon" color="var(--secondary-color)" />
                        <input 
                            id="confirmPassword" 
                            v-model="formData.confirmPassword" 
                            type="password" 
                            required 
                            placeholder="Confirme sua senha"
                        >
                    </div>
                </div>

                <div v-if="error" class="error-message">
                    {{ error }}
                </div>

                <button type="submit" :disabled="isLoading" class="register-button">
                    <span class="button-content">
                        {{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
                        <Icon name="arrowRight" size="20px" class="button-icon" color="currentColor" />
                    </span>
                </button>

                <div class="login-link">
                    Já tem uma conta? 
                    <router-link to="/login">Faça login</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import Icon from '../components/icons/Icon.vue'

const formData = reactive({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
})

const error = ref('')
const isLoading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

async function handleRegister() {
    error.value = ''
    
    // Validações
    if (formData.password !== formData.confirmPassword) {
        error.value = 'As senhas não coincidem'
        return
    }

    if (formData.password.length < 6) {
        error.value = 'A senha deve ter pelo menos 6 caracteres'
        return
    }

    isLoading.value = true

    try {
        await authStore.register({
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        })

        // Login automático após o registro
        await authStore.login(formData.email, formData.password)
        router.push('/dashboard')
    } catch (e) {
        error.value = e.message || 'Erro ao tentar fazer cadastro'
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    padding: var(--spacing-md);
}

.register-content {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 480px;
}

.brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.brand-name {
    color: var(--primary-color);
    font-size: 2rem;
    margin: 0;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

h2 {
    color: var(--text-color);
    margin: 0;
    text-align: center;
}

.subtitle {
    color: var(--text-secondary);
    margin: 0;
    text-align: center;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    color: var(--text-color);
    font-weight: 500;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 1rem;
}

input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s;
}

input:focus {
    outline: none;
    border-color: var(--primary-color);
}

.error-message {
    color: var(--error-color);
    font-size: 0.875rem;
    text-align: center;
}

.register-button {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.register-button:hover {
    background: var(--primary-dark);
}

.register-button:disabled {
    background: var(--disabled-color);
    cursor: not-allowed;
}

.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.login-link {
    text-align: center;
    color: var(--text-secondary);
}

.login-link a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
}

.login-link a:hover {
    text-decoration: underline;
}
</style>
