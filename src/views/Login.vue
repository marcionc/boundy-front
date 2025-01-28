<template>
    <div class="login-container">
        <div class="login-content">
            <div class="brand">
                <img src="/src/assets/bounky-logo.svg" alt="Bounky Logo" class="brand-logo" />
                <h1 class="brand-name">Bounky</h1>
            </div>
            
            <form @submit.prevent="handleLogin" class="login-form">
                <h2>Bem-vindo de volta!</h2>
                <p class="subtitle">Entre para acessar sua conta</p>

                <div class="form-group">
                    <label for="username">Usuário:</label>
                    <div class="input-wrapper">
                        <Icon name="user" class="input-icon" color="var(--secondary-color)" />
                        <input 
                            id="username" 
                            v-model="username" 
                            type="text" 
                            required 
                            placeholder="Digite seu usuário"
                        >
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">Senha:</label>
                    <div class="input-wrapper">
                        <Icon name="lock" class="input-icon" color="var(--secondary-color)" />
                        <input 
                            id="password" 
                            v-model="password" 
                            type="password" 
                            required 
                            placeholder="Digite sua senha"
                        >
                    </div>
                </div>

                <div v-if="error" class="error-message">
                    {{ error }}
                </div>

                <button type="submit" :disabled="isLoading" class="login-button">
                    <span class="button-content">
                        {{ isLoading ? 'Entrando...' : 'Entrar' }}
                        <Icon name="arrowRight" size="20px" class="button-icon" color="currentColor" />
                    </span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import Icon from '../components/icons/Icon.vue'

const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

async function handleLogin() {
    error.value = ''
    isLoading.value = true

    try {
        const success = await authStore.login(
            username.value,
            password.value
        )

        if (success) {
            const redirect = router.currentRoute.value.query.redirect || '/dashboard'
            router.push(redirect)
        } else {
            error.value = 'Usuário ou senha inválidos'
        }
    } catch (e) {
        error.value = e.message || 'Erro ao tentar fazer login'
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    padding: var(--spacing-md);
}

.login-content {
    width: 100%;
    max-width: 400px;
}

.brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-lg);
}

.brand-logo {
    width: 120px;
    height: 120px;
    margin-bottom: var(--spacing-sm);
}

.brand-name {
    font-size: 2rem;
    color: var(--white);
    text-align: center;
}

.login-form {
    background: var(--white);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(10px);
}

h2 {
    color: var(--primary-color);
    margin-bottom: var(--spacing-xs);
    font-size: 1.5rem;
}

.subtitle {
    color: var(--secondary-color);
    margin-bottom: var(--spacing-lg);
    font-size: 0.9rem;
}

.form-group {
    margin-bottom: var(--spacing-md);
}

label {
    display: block;
    margin-bottom: var(--spacing-xs);
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
    left: var(--spacing-md);
    width: 20px;
    height: 20px;
    opacity: 0.6;
    transition: all var(--transition-normal);
}

input:focus + .input-icon {
    opacity: 1;
    color: var(--accent-color);
}

input {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 3rem;
    border: 2px solid var(--cloud-white);
    border-radius: var(--border-radius-md);
    font-size: 1rem;
    transition: all var(--transition-normal);
    background-color: var(--cloud-white);
}

input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: var(--shadow-inner);
}

.login-button {
    width: 100%;
    padding: var(--spacing-md);
    background: linear-gradient(135deg, var(--accent-color) 0%, var(--primary-light) 100%);
    color: var(--white);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-weight: 600;
    transition: all var(--transition-normal);
    margin-top: var(--spacing-md);
}

.login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.login-button:disabled {
    background: var(--cloud-white);
    color: var(--secondary-color);
    cursor: not-allowed;
}

.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
}

.button-icon {
    transition: all var(--transition-normal);
    opacity: 0.8;
}

.login-button:hover:not(:disabled) .button-icon {
    transform: translateX(4px);
    opacity: 1;
}

.error-message {
    color: var(--error-color);
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-sm);
    background-color: rgba(220, 53, 69, 0.1);
    border-radius: var(--border-radius-sm);
    font-size: 0.9rem;
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0px);
    }
}

/* Responsividade */
@media (max-width: 480px) {
    .login-form {
        padding: var(--spacing-lg);
    }

    .brand-name {
        font-size: 2rem;
    }

    h2 {
        font-size: 1.2rem;
    }
}
</style>