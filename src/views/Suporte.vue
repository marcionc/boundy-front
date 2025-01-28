<template>
  <div class="suporte-container">
    <h1>Central de Suporte</h1>
    
    <button 
      @click="openTicketModal" 
      class="btn-criar-ticket"
    >
      Criar Novo Ticket
    </button>

    <Modal 
      v-model="isModalOpen"
      title="Criar Novo Ticket"
      icon="help-circle"
      confirmText="Enviar Ticket"
      cancelText="Cancelar"
      :closeOnOverlay="false"
      :confirmDisabled="!isTicketValid"
      @confirm="criarTicket"
      @cancel="resetTicket"
    >
      <form @submit.prevent="criarTicket">
        <div class="form-group">
          <label for="ticket-titulo">Título</label>
          <input 
            id="ticket-titulo"
            v-model="novoTicket.titulo" 
            placeholder="Título do Ticket" 
            required
            class="input-titulo"
          />
        </div>
        <div class="form-group">
          <label for="ticket-descricao">Descrição</label>
          <textarea 
            id="ticket-descricao"
            v-model="novoTicket.descricao" 
            placeholder="Descreva seu problema" 
            required
            class="input-descricao"
          ></textarea>
        </div>
      </form>
    </Modal>

    <div class="tickets-existentes">
      <h2>Seus Tickets</h2>
      <div 
        v-for="ticket in tickets" 
        :key="ticket.id" 
        class="ticket-item"
      >
        <div class="ticket-header">
          <h3>{{ ticket.titulo }}</h3>
          <span 
            :class="`status-${ticket.status.toLowerCase()}`"
          >
            {{ getStatusLabel(ticket.status) }}
          </span>
        </div>
        <p>{{ ticket.descricao }}</p>
        <div class="ticket-respostas">
          <div 
            v-for="resposta in ticket.respostas" 
            :key="resposta.id" 
            class="resposta-item"
          >
            <strong>{{ resposta.autor.username }}</strong>
            <p>{{ resposta.mensagem }}</p>
            <small>{{ formatDate(resposta.data_resposta) }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="notificacoes">
      <h2>Notificações</h2>
      <div 
        v-for="notificacao in notificacoes" 
        :key="notificacao.id" 
        class="notificacao-item"
      >
        {{ notificacao.mensagem }}
      </div>
    </div>
  </div>
</template>

<script>
import api from '../plugins/axios'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Modal from '@/components/Modal.vue'

export default {
  components: {
    Modal
  },
  setup() {
    const tickets = ref([])
    const notificacoes = ref([])
    const novoTicket = ref({
      titulo: '',
      descricao: ''
    })
    const isModalOpen = ref(false)

    const fetchTickets = async () => {
      try {
        const response = await api.get('/api/tickets/')
        tickets.value = response.data
      } catch (error) {
        console.error('Erro ao buscar tickets:', error)
      }
    }

    const fetchNotificacoes = async () => {
      try {
        const response = await api.get('/api/notificacoes-ticket/')
        notificacoes.value = response.data
      } catch (error) {
        console.error('Erro ao buscar notificações:', error)
      }
    }

    const criarTicket = async () => {
      try {
        await api.post('/api/tickets/', novoTicket.value)
        await fetchTickets()
        resetTicket()
      } catch (error) {
        console.error('Erro ao criar ticket:', error)
      }
    }

    const openTicketModal = () => {
      isModalOpen.value = true
    }

    const resetTicket = () => {
      novoTicket.value = {
        titulo: '',
        descricao: ''
      }
      isModalOpen.value = false
    }

    const getStatusLabel = (status) => {
      const statusMap = {
        'AB': 'Aberto',
        'AN': 'Em Andamento',
        'RS': 'Respondido',
        'FC': 'Fechado'
      }
      return statusMap[status] || status
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString()
    }

    const setupWebSocket = () => {
      const socket = new WebSocket('ws://localhost:8000/ws/ticket-notifications/')
      
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'ticket_notification') {
          fetchTickets()
          fetchNotificacoes()
        }
      }
    }

    const isTicketValid = computed(() => {
      return novoTicket.value.titulo.trim() !== '' && 
             novoTicket.value.descricao.trim() !== ''
    })

    onMounted(() => {
      fetchTickets()
      fetchNotificacoes()
      setupWebSocket()
    })

    onUnmounted(() => {
      const socket = new WebSocket('ws://localhost:8000/ws/ticket-notifications/')
      socket.close()
    })

    return {
      tickets,
      notificacoes,
      novoTicket,
      isModalOpen,
      criarTicket,
      openTicketModal,
      resetTicket,
      getStatusLabel,
      formatDate,
      isTicketValid
    }
  }
}
</script>

<style scoped>
.suporte-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.btn-criar-ticket {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-criar-ticket:hover {
  background-color: var(--primary-color-dark);
}

.ticket-item {
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-aberto { color: var(--warning-color); }
.status-emandamento { color: var(--info-color); }
.status-respondido { color: var(--success-color); }
.status-fechado { color: var(--text-muted); }

.ticket-respostas {
  margin-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-md);
}

.resposta-item {
  margin-bottom: var(--spacing-sm);
}

.notificacoes {
  margin-top: var(--spacing-lg);
}

.notificacao-item {
  background-color: var(--background-color);
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: bold;
}

.input-titulo, 
.input-descricao {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
}

.input-descricao {
  min-height: 150px;
  resize: vertical;
}
</style>
