<template>
  <div class="cursos-container">
    <h1>Nossos Cursos</h1>
    
    <div class="cursos-grid">
      <div 
        v-for="curso in cursos" 
        :key="curso.id" 
        class="curso-card"
        @click="openCurso(curso)"
      >
        <div class="curso-icon">
          <img v-if="curso.icon.includes('.png')" :src="curso.icon" alt="Curso Icon" width="48" height="48">
          <Icon v-else :name="curso.icon" :color="curso.color" size="48px" />
        </div>
        <div class="curso-details">
          <h2>{{ curso.nome }}</h2>
          <p>{{ curso.descricao }}</p>
        </div>
      </div>
    </div>

    <Modal 
      v-model="selectedCurso"
      :title="selectedCurso?.nome || ''"
      icon="book"
      size="large"
      @close="selectedCurso = null"
    >
      <div class="curso-secoes">
        <div 
          v-for="secao in selectedCurso?.secoes" 
          :key="secao.id" 
          class="curso-secao"
        >
          <h3>{{ secao.nome }}</h3>
          
          <div class="curso-aulas">
            <div 
              v-for="aula in secao.aulas" 
              :key="aula.id" 
              class="curso-aula"
            >
              <Icon name="video" class="aula-icon" />
              <span>{{ aula.titulo }}</span>
              <button 
                v-if="aula.videoUrl" 
                @click="openVideo(aula.videoUrl)"
                class="play-button"
              >
                <Icon name="play" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div 
        v-if="selectedCurso?.documentos?.length" 
        class="curso-documentos"
      >
        <h3>Documentos</h3>
        <div class="documentos-lista">
          <div 
            v-for="documento in selectedCurso.documentos" 
            :key="documento.id" 
            class="documento-item"
          >
            <Icon name="file-pdf" class="documento-icon" />
            <span>{{ documento.nome }}</span>
            <a 
              :href="documento.url" 
              target="_blank" 
              class="download-button"
              download
            >
              <Icon name="download" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Icon from '@/components/icons/Icon.vue'
import Modal from '@/components/Modal.vue'
import api from '@/plugins/axios'

const cursos = ref([])
const selectedCurso = ref(null)

const fetchCursos = async () => {
  try {
    const response = await api.get('/tipos-simulado/')
    cursos.value = response.data.map(tipo => ({
      id: tipo.id,
      nome: tipo.nome,
      descricao: tipo.descricao,
      icon: tipo.id % 2 === 0 
        ? '/src/assets/comissario.png' 
        : '/src/assets/piloto.png',
      color: tipo.id % 2 === 0 ? '#3498db' : '#2ecc71',
      secoes: [], // Pode ser expandido no futuro
      documentos: [] // Pode ser expandido no futuro
    }))
  } catch (error) {
    console.error('Erro ao buscar tipos de simulados:', error)
    // Manter os dados hardcoded como fallback
    cursos.value = [
      {
        id: 1,
        nome: 'Comissário de Bordo',
        descricao: 'Curso completo para formação de comissários',
        icon: '/src/assets/comissario.png',
        color: '#3498db',
        secoes: [],
        documentos: []
      },
      {
        id: 2,
        nome: 'Piloto Privado',
        descricao: 'Formação para pilotos de aeronaves privadas',
        icon: '/src/assets/piloto.png',
        color: '#2ecc71',
        secoes: [],
        documentos: []
      }
    ]
  }
}

onMounted(fetchCursos)

function openCurso(curso) {
  selectedCurso.value = curso
}

function openVideo(videoUrl) {
  // Implementação futura
  console.log('Abrindo vídeo:', videoUrl)
}
</script>

<style scoped>
.cursos-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md);
}

.cursos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.curso-card {
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

.curso-card:hover {
  transform: scale(1.05);
}

.curso-icon {
  margin-bottom: var(--spacing-md);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.curso-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(1.2);
}

.curso-icon svg {
  width: 48px;
  height: 48px;
}

.curso-details {
  text-align: center;
}

.curso-details h2 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.curso-secoes {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.curso-secao h3 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: var(--spacing-sm);
}

.curso-aulas {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.curso-aula {
  display: flex;
  align-items: center;
  background: var(--background-color);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
}

.aula-icon {
  margin-right: var(--spacing-sm);
  color: var(--primary-color);
}

.play-button {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-color);
}

.curso-documentos {
  margin-top: var(--spacing-lg);
}

.curso-documentos h3 {
  margin-bottom: var(--spacing-md);
}

.documentos-lista {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.documento-item {
  display: flex;
  align-items: center;
  background: var(--background-color);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
}

.documento-icon {
  margin-right: var(--spacing-sm);
  color: var(--primary-color);
}

.download-button {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .cursos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
