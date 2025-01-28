<template>
  <div class="news-detail" v-if="noticia">
    <div class="news-header">
      <img 
        v-if="noticia.imagem_url" 
        :src="noticia.imagem_url" 
        :alt="noticia.titulo" 
        class="news-image"
      />
      <div v-else class="news-image placeholder"></div>
      
      <div class="news-meta">
        <h1 class="news-title">{{ noticia.titulo }}</h1>
        <div class="news-info">
          <span class="news-date">
            Publicado em: {{ formatDate(noticia.data_publicacao) }}
          </span>
          <span class="news-category">
            Categoria: {{ noticia.categoria.nome }}
          </span>
        </div>
      </div>
    </div>

    <div class="news-content">
      <p>{{ noticia.conteudo }}</p>
    </div>

    <div class="news-actions">
      <button @click="goBack" class="back-button">
        Voltar para Notícias
      </button>
    </div>
  </div>
  <div v-else-if="loading" class="loading">
    Carregando detalhes da notícia...
  </div>
  <div v-else class="error">
    Notícia não encontrada
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const noticia = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchNoticiaDetails = async () => {
  try {
    const slug = route.params.slug
    const response = await api.get(`noticias/${slug}/`)
    noticia.value = response.data
  } catch (err) {
    console.error('Erro ao buscar detalhes da notícia:', err)
    error.value = err
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Data não disponível'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Data inválida'
  }
}

const goBack = () => {
  router.push({ name: 'Home' })
}

onMounted(() => {
  fetchNoticiaDetails()
})
</script>

<style scoped>
.news-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.news-header {
  margin-bottom: 2rem;
}

.news-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.news-image.placeholder {
  background-color: var(--background-color);
  height: 300px;
}

.news-title {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.news-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.news-info {
  display: flex;
  justify-content: space-between;
  color: var(--secondary-text-color);
  font-size: 0.9rem;
}

.news-content {
  line-height: 1.6;
  color: var(--text-color);
  margin-bottom: 2rem;
}

.news-actions {
  display: flex;
  justify-content: center;
}

.back-button {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: var(--primary-light);
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: var(--secondary-text-color);
}
</style>
