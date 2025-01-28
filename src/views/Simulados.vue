<template>
  <div class="simulados-container">
    <h1>Simulados</h1>

    <div class="simulados-opcoes">
      <!-- Simulado por Matéria (Tempo Livre) -->
      <div class="simulado-card" @click="iniciarSimuladoTempoLivre">
        <div class="simulado-icon">
          <Icon name="clock-off" />
        </div>
        <div class="simulado-info">
          <h2>Simulado por Matéria</h2>
          <p>Pratique sem limite de tempo</p>
        </div>
      </div>

      <!-- Simulado 2ª Época -->
      <div class="simulado-card" @click="abrirModalSegundaEpoca">
        <div class="simulado-icon">
          <Icon name="calendar" />
        </div>
        <div class="simulado-info">
          <h2>Simulado 2ª Época</h2>
          <p>Selecione duas matérias</p>
        </div>
      </div>

      <!-- Simulado Completo -->
      <div class="simulado-card" @click="iniciarSimuladoCompleto">
        <div class="simulado-icon">
          <Icon name="book" />
        </div>
        <div class="simulado-info">
          <h2>Simulado Completo</h2>
          <p>Todas as matérias, tempo total</p>
        </div>
      </div>
    </div>

    <!-- Modal 2ª Época -->
    <Modal 
      v-model="modalSegundaEpoca"
      title="Simulado 2ª Época"
      icon="calendar"
      size="large"
      confirmText="Iniciar Simulado"
      cancelText="Cancelar"
      :confirmDisabled="materiaSelecionadas.length !== 2"
      @confirm="iniciarSimuladoSegundaEpoca"
      @cancel="fecharModalSegundaEpoca"
    >
      <div class="materias-selecao">
        <div 
          v-for="materia in materias" 
          :key="materia.id" 
          class="materia-item"
          :class="{ 'selecionada': materiaSelecionadas.includes(materia) }"
          @click="toggleMateriaSelecao(materia)"
        >
          <div class="materia-header">
            <Icon :name="materia.icon" />
            <div class="materia-info">
              <span class="materia-nome">{{ materia.nome }}</span>
              <span class="materia-sigla">{{ materia.sigla }}</span>
            </div>
          </div>
          <div class="materia-blocos">
            <div 
              v-for="bloco in materia.blocos" 
              :key="bloco.id" 
              class="bloco-item"
            >
              <span class="bloco-nome">{{ bloco.nome }}</span>
              <span class="bloco-sigla">{{ bloco.sigla }}</span>
              <span class="bloco-descricao">{{ bloco.descricao }}</span>
            </div>
          </div>
          <span class="tempo-materia">({{ materia.tempoMinutos }} min)</span>
        </div>
      </div>

      <div 
        v-if="materiaSelecionadas.length > 0" 
        class="resumo-selecao"
      >
        <p>Matérias Selecionadas:</p>
        <ul>
          <li 
            v-for="materia in materiaSelecionadas" 
            :key="materia.id"
          >
            {{ materia.nome }} - {{ materia.tempoMinutos }} min
          </li>
        </ul>
        <p><strong>Tempo Total: {{ tempoTotalSelecionado }} minutos</strong></p>
      </div>
    </Modal>

    <!-- Modal Simulado -->
    <Modal 
      v-model="simuladoAtivo"
      :title="tituloSimulado"
      icon="book"
      size="large"
      :closeButton="false"
      :closeOnOverlay="false"
      confirmText="Finalizar Simulado"
      @confirm="finalizarSimulado"
    >
      <div class="simulado-header">
        <div 
          v-if="tempoRestante !== 'Sem Limite'" 
          class="cronometro"
        >
          <Icon name="clock" />
          <span>{{ tempoRestante }}</span>
        </div>
      </div>

      <div class="questoes-container">
        <div 
          v-for="(questao, index) in questoesSimulado" 
          :key="questao.id" 
          class="questao"
        >
          <p>{{ index + 1 }}. {{ questao.texto }}</p>
          <div class="alternativas">
            <label 
              v-for="(alternativa, altIndex) in questao.alternativas" 
              :key="altIndex"
              class="alternativa"
            >
              <input 
                type="radio" 
                :name="`questao-${questao.id}`" 
                :value="altIndex"
                v-model="questao.respostaSelecionada"
              />
              <span>{{ alternativa }}</span>
            </label>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from '@/components/icons/Icon.vue'
import Modal from '@/components/Modal.vue'
import api from '../plugins/axios'

const materias = [
  { 
    id: 1, 
    nome: 'Português', 
    sigla: 'PORT',
    icon: 'book', 
    tempoMinutos: 20,
    questoes: [],
    blocos: [
      {
        id: 1,
        nome: 'Interpretação de Texto',
        sigla: 'IT',
        descricao: 'Análise e compreensão de textos diversos'
      },
      {
        id: 2,
        nome: 'Gramática',
        sigla: 'GRAM',
        descricao: 'Regras e estruturas da língua portuguesa'
      }
    ]
  },
  { 
    id: 2, 
    nome: 'Matemática', 
    sigla: 'MAT',
    icon: 'calculator', 
    tempoMinutos: 20,
    questoes: [],
    blocos: [
      {
        id: 1,
        nome: 'Álgebra',
        sigla: 'ALG',
        descricao: 'Operações e equações algébricas'
      },
      {
        id: 2,
        nome: 'Geometria',
        sigla: 'GEO',
        descricao: 'Formas, medidas e propriedades geométricas'
      }
    ]
  },
  { 
    id: 3, 
    nome: 'Conhecimentos Específicos', 
    sigla: 'CE',
    icon: 'plane', 
    tempoMinutos: 30,
    questoes: [],
    blocos: [
      {
        id: 1,
        nome: 'Regulamentos Aeronáuticos',
        sigla: 'REG',
        descricao: 'Normas e regulamentações da aviação civil'
      },
      {
        id: 2,
        nome: 'Procedimentos Operacionais',
        sigla: 'PROC',
        descricao: 'Protocolos e procedimentos padrão na aviação'
      }
    ]
  },
  { 
    id: 4, 
    nome: 'Inglês', 
    sigla: 'ING',
    icon: 'globe', 
    tempoMinutos: 15,
    questoes: [],
    blocos: [
      {
        id: 1,
        nome: 'Interpretação de Texto',
        sigla: 'IT',
        descricao: 'Compreensão de textos em língua inglesa'
      },
      {
        id: 2,
        nome: 'Vocabulário Técnico',
        sigla: 'VOC',
        descricao: 'Terminologia técnica em inglês para aviação'
      }
    ]
  }
]

const modalSegundaEpoca = ref(false)
const materiaSelecionadas = ref([])
const simuladoAtivo = ref(false)
const tituloSimulado = ref('')
const questoesSimulado = ref([])
const tempoRestante = ref('00:00')

const tempoTotalSelecionado = computed(() => 
  materiaSelecionadas.value.reduce((total, materia) => total + materia.tempoMinutos, 0)
)

function toggleMateriaSelecao(materia) {
  console.log('toggleMateriaSelecao', materia)
  if (materiaSelecionadas.value.includes(materia)) {
    materiaSelecionadas.value = materiaSelecionadas.value.filter(m => m.id !== materia.id)
  } else if (materiaSelecionadas.value.length < 2) {
    materiaSelecionadas.value.push(materia)
  }
}

function abrirModalSegundaEpoca() {
  console.log('abrirModalSegundaEpoca')
  modalSegundaEpoca.value = true
  materiaSelecionadas.value = []
}

function fecharModalSegundaEpoca() {
  console.log('fecharModalSegundaEpoca')
  modalSegundaEpoca.value = false
  materiaSelecionadas.value = []
}

function iniciarSimuladoTempoLivre() {
  console.log('iniciarSimuladoTempoLivre')
  simuladoAtivo.value = true
  tituloSimulado.value = 'Simulado por Matéria (Tempo Livre)'
  questoesSimulado.value = materias.flatMap(materia => gerarQuestoes(materia))
  tempoRestante.value = 'Sem Limite'
}

async function iniciarSimuladoSegundaEpoca() {
  console.log('iniciarSimuladoSegundaEpoca')
  if (materiaSelecionadas.value.length !== 2) return

  simuladoAtivo.value = true
  tituloSimulado.value = 'Simulado 2ª Época'
  questoesSimulado.value = materiaSelecionadas.value.flatMap(materia => gerarQuestoes(materia))
  
  const tempoTotal = tempoTotalSelecionado.value * 60 // converter para segundos
  iniciarCronometro(tempoTotal)
  
  modalSegundaEpoca.value = false
}

async function iniciarSimuladoCompleto() {
  console.log('iniciarSimuladoCompleto')
  try {
    // Buscar questões de todas as matérias, limitando a 100
    const response = await api.get('/questoes/', {
      params: {
        limit: 100,
        ordering: 'random'  // Para distribuir questões aleatoriamente
      }
    })

    const questoes = response.data.results || []

    simuladoAtivo.value = true
    tituloSimulado.value = 'Simulado Completo'
    questoesSimulado.value = questoes.map(questao => ({
      id: questao.id,
      texto: questao.enunciado,
      materia: questao.materia,
      alternativas: [
        questao.alternativa_a,
        questao.alternativa_b,
        questao.alternativa_c,
        questao.alternativa_d
      ],
      respostaCorreta: questao.resposta_correta,
      respostaSelecionada: null
    }))
    
    // Calcular tempo total baseado nas matérias
    const tempoTotal = materias.reduce((total, materia) => total + materia.tempoMinutos, 0) * 60
    iniciarCronometro(tempoTotal)
  } catch (error) {
    console.error('Erro ao buscar questões:', error)
    alert('Não foi possível iniciar o simulado. Tente novamente.')
  }
}

function gerarQuestoes(materia) {
  console.log('gerarQuestoes', materia)
  // Lógica simplificada de geração de questões
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${materia.id}-${i}`,
    texto: `Questão de exemplo de ${materia.nome}`,
    alternativas: [
      'Alternativa A',
      'Alternativa B',
      'Alternativa C',
      'Alternativa D'
    ],
    respostaCorreta: 0,
    respostaSelecionada: null
  }))
}

function iniciarCronometro(tempoTotal) {
  console.log('iniciarCronometro', tempoTotal)
  let segundosRestantes = tempoTotal

  const cronometro = setInterval(() => {
    segundosRestantes--
    
    const minutos = Math.floor(segundosRestantes / 60)
    const segundos = segundosRestantes % 60
    
    tempoRestante.value = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`

    if (segundosRestantes <= 0) {
      clearInterval(cronometro)
      finalizarSimulado()
    }
  }, 1000)
}

function calcularResultado() {
  console.log('calcularResultado')
  const total = questoesSimulado.value.length
  const corretas = questoesSimulado.value.filter(questao => 
    questao.respostaSelecionada === questao.respostaCorreta
  ).length

  return {
    total,
    corretas,
    porcentagem: (corretas / total) * 100
  }
}

function finalizarSimulado() {
  console.log('finalizarSimulado')
  const resultado = calcularResultado()
  
  alert(`Simulado Finalizado!\nQuestões Corretas: ${resultado.corretas}/${resultado.total}\nAproveitamento: ${resultado.porcentagem.toFixed(2)}%`)
  
  simuladoAtivo.value = false
  questoesSimulado.value = []
  materiaSelecionadas.value = []
}

function fecharSimulado() {
  console.log('fecharSimulado')
  simuladoAtivo.value = false
  questoesSimulado.value = []
  materiaSelecionadas.value = []
}
</script>

<style scoped>
.simulados-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md);
}

.simulados-opcoes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.simulado-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.simulado-card:hover {
  transform: scale(1.05);
}

.simulado-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
}

.simulado-info {
  text-align: center;
}

.simulado-info h2 {
  margin-bottom: var(--spacing-sm);
}

.materias-selecao {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.materia-item {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  background: var(--background-color);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: background-color 0.3s ease;
  gap: var(--spacing-sm);
}

.materia-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.materia-header svg {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.materia-info {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.materia-nome {
  font-weight: bold;
}

.materia-sigla {
  color: var(--text-muted);
  font-size: 0.8em;
}

.tempo-materia {
  color: var(--text-muted);
  font-size: 0.8em;
}

.materia-item.selecionada {
  background-color: var(--primary-color);
  color: var(--white);
}

.materia-item.selecionada svg,
.materia-item.selecionada .materia-sigla,
.materia-item.selecionada .tempo-materia {
  color: var(--white);
  opacity: 0.8;
}

.materia-blocos {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-sm);
}

.bloco-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.bloco-nome {
  font-weight: 600;
}

.bloco-sigla {
  color: var(--text-muted);
  font-size: 0.8em;
}

.bloco-descricao {
  color: var(--text-muted);
  font-size: 0.9em;
  margin-top: var(--spacing-xs);
}

.blocos-selecionados {
  display: flex;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
}

.bloco-tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  font-size: 0.7em;
}

.resumo-selecao {
  background: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
}

.simulado-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.questoes-container {
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.questao {
  background: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}

.alternativas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.alternativa {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

@media (max-width: 768px) {
  .simulados-opcoes {
    grid-template-columns: 1fr;
  }

  .materias-selecao {
    grid-template-columns: 1fr;
  }

  .alternativas {
    grid-template-columns: 1fr;
  }
}
</style>