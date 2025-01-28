<template>
  <div class="news-feed">
    <div class="feed-header">
      <h1>Últimas Notícias</h1>
    </div>

    <div 
      ref="feedContainer" 
      class="feed-container" 
      @scroll="onScroll"
    >
      <div 
        v-if="noticias.length === 0 && !loading" 
        class="no-news-message"
      >
        Não há notícias disponíveis no momento.
      </div>

      <div 
        v-for="noticia in noticias" 
        :key="noticia.slug" 
        class="news-card"
      >
        <div class="news-card-header">
          <img 
            v-if="noticia.imagem_url" 
            :src="noticia.imagem_url" 
            :alt="noticia.titulo" 
            class="news-image"
          />
          <div v-else class="news-image placeholder"></div>
        </div>
        
        <div class="news-card-content">
          <h2 class="news-title">{{ noticia.titulo }}</h2>
          <div class="news-meta">
            <span class="news-date">
              {{ formatDate(noticia.data_publicacao) }}
            </span>
            <span class="news-category">
              {{ noticia.categoria_nome }}
            </span>
          </div>

          <div class="news-actions">
            <button @click="openNewsDetail(noticia.slug)" class="read-more-btn">
              Ler Completo
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="loading-spinner">
        Carregando mais notícias...
      </div>

      <div v-if="!loading && !hasMoreNews" class="no-more-news">
        Não há mais notícias para carregar
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const noticias = ref([])
const page = ref(1)
const loading = ref(false)
const hasMoreNews = ref(true)
const feedContainer = ref(null)
const router = useRouter()

const fetchNoticias = async () => {
  if (loading.value || !hasMoreNews.value) return

  loading.value = true
  try {
    const response = await api.get('noticias/', {
      params: { 
        page: page.value
      }
    })

    // Verificar a estrutura da resposta
    console.log('Resposta da API:', response.data)

    const newNoticias = response.data.results || response.data

    if (newNoticias.length === 0) {
      hasMoreNews.value = false
    } else {
      noticias.value = [...noticias.value, ...newNoticias]
      page.value += 1
    }
  } catch (error) {
    console.error('Erro ao buscar notícias:', error)
    hasMoreNews.value = false
  } finally {
    loading.value = false
  }
}

const onScroll = () => {
  const container = feedContainer.value
  if (!container) return

  // Detecta quando está próximo do final do scroll
  const bottomOfWindow = container.scrollTop + container.clientHeight >= 
                         container.scrollHeight - 200

  if (bottomOfWindow) {
    fetchNoticias()
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Data não disponível'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return 'Data inválida'
  }
}

const openNewsDetail = (slug) => {
  // Navigate to the news detail page using vue-router
  router.push({ 
    name: 'NewsDetail', 
    params: { slug: slug } 
  })
}

onMounted(() => {
  fetchNoticias()
  
  // Adicionar event listener para scroll
  const container = feedContainer.value
  if (container) {
    container.addEventListener('scroll', onScroll)
  }
})

onUnmounted(() => {
  // Remover event listener
  const container = feedContainer.value
  if (container) {
    container.removeEventListener('scroll', onScroll)
  }
})
</script>

<style scoped>
.news-feed {
  max-width: 600px;
  margin: 0 auto;
  padding: 0;
  height: calc(100vh - 80px);
  overflow: hidden;
}

.feed-header {
  text-align: center;
  padding: 1rem;
  background-color: var(--white);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.feed-container {
  height: calc(100% - 60px);
  overflow-y: auto;
  padding: 0 1rem;
}

.no-news-message {
  text-align: center;
  color: var(--secondary-text-color);
  padding: 2rem;
}

.news-card {
  background-color: var(--white);
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.news-card:hover {
  transform: scale(1.02);
}

.news-card-header .news-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.news-card-header .placeholder {
  background-color: var(--background-color);
  height: 250px;
}

.news-card-content {
  padding: 1rem;
}

.news-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.news-meta {
  display: flex;
  justify-content: space-between;
  color: var(--secondary-text-color);
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.news-actions {
  display: flex;
  justify-content: center;
}

.read-more-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.read-more-btn:hover {
  background-color: var(--primary-light);
}

.loading-spinner, 
.no-more-news {
  text-align: center;
  padding: 1rem;
  color: var(--secondary-text-color);
}
</style>