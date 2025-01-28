<template>
    <div class="news-reel">
        <div class="news-controls">
            <button @click="prevNews" class="control-button" :disabled="currentIndex === 0">
                <Icon name="arrowLeft" color="currentColor" />
            </button>
            <div class="news-container" ref="newsContainer">
                <TransitionGroup name="news-slide">
                    <article 
                        v-for="(news, index) in visibleNews" 
                        :key="news.id"
                        class="news-card"
                        :class="{ 'active': index === currentIndex }"
                    >
                        <div class="news-image">
                            <img :src="news.image" :alt="news.image_alt">
                            <div class="news-category">
                                {{ news.category.name }}
                            </div>
                        </div>
                        <div class="news-content">
                            <h2>{{ news.title }}</h2>
                            <p class="news-subtitle">{{ news.subtitle }}</p>
                            <p class="news-summary">{{ news.summary }}</p>
                            <div class="news-meta">
                                <span class="news-date">
                                    {{ formatDate(news.publish_date) }}
                                </span>
                                <div class="news-tags">
                                    <span v-for="tag in news.tags" :key="tag.id" class="tag">
                                        #{{ tag.name }}
                                    </span>
                                </div>
                            </div>
                            <button @click="readMore(news)" class="read-more-btn">
                                Ler mais
                                <Icon name="arrowRight" size="16px" />
                            </button>
                        </div>
                    </article>
                </TransitionGroup>
            </div>
            <button @click="nextNews" class="control-button" :disabled="currentIndex >= news.length - 1">
                <Icon name="arrowRight" color="currentColor" />
            </button>
        </div>
        <div class="news-indicators">
            <button 
                v-for="(_, index) in news" 
                :key="index"
                @click="goToNews(index)"
                class="indicator"
                :class="{ 'active': index === currentIndex }"
            ></button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '../icons/Icon.vue'
import api from '../../plugins/axios'

const router = useRouter()
const news = ref([])
const currentIndex = ref(0)
const newsContainer = ref(null)
const autoplayInterval = ref(null)

// Número de notícias visíveis por vez
const visibleNews = computed(() => {
    return news.value.slice(currentIndex.value, currentIndex.value + 1)
})

// Buscar notícias da API
async function fetchNews() {
    try {
        const response = await api.get('/api/aviation-news/', {
            params: {
                featured: true
            }
        })
        news.value = response.data
    } catch (error) {
        console.error('Erro ao buscar notícias:', error)
    }
}

// Navegação
function prevNews() {
    if (currentIndex.value > 0) {
        currentIndex.value--
    }
    resetAutoplay()
}

function nextNews() {
    if (currentIndex.value < news.value.length - 1) {
        currentIndex.value++
    } else {
        currentIndex.value = 0
    }
    resetAutoplay()
}

function goToNews(index) {
    currentIndex.value = index
    resetAutoplay()
}

function readMore(newsItem) {
    router.push(`/news/${newsItem.slug}`)
}

// Formatação de data
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

// Autoplay
function startAutoplay() {
    autoplayInterval.value = setInterval(() => {
        nextNews()
    }, 5000)
}

function resetAutoplay() {
    if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value)
        startAutoplay()
    }
}

// Lifecycle hooks
onMounted(() => {
    fetchNews()
    startAutoplay()
})
</script>

<style scoped>
.news-reel {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-md);
}

.news-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.control-button {
    background: var(--primary-color);
    color: var(--white);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-normal);
}

.control-button:hover:not(:disabled) {
    background: var(--accent-color);
    transform: scale(1.1);
}

.control-button:disabled {
    background: var(--cloud-white);
    color: var(--secondary-color);
    cursor: not-allowed;
}

.news-container {
    flex: 1;
    overflow: hidden;
    position: relative;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
}

.news-card {
    display: flex;
    flex-direction: column;
    background: var(--white);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
}

.news-image {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
}

.news-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
}

.news-card:hover .news-image img {
    transform: scale(1.05);
}

.news-category {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    background: var(--accent-color);
    color: var(--white);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    font-size: 0.875rem;
    font-weight: 500;
}

.news-content {
    padding: var(--spacing-lg);
}

.news-content h2 {
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
    font-size: 1.5rem;
}

.news-subtitle {
    color: var(--secondary-color);
    margin-bottom: var(--spacing-md);
    font-size: 1.1rem;
}

.news-summary {
    color: var(--text-color);
    margin-bottom: var(--spacing-lg);
    line-height: 1.6;
}

.news-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
    font-size: 0.875rem;
}

.news-date {
    color: var(--secondary-color);
}

.news-tags {
    display: flex;
    gap: var(--spacing-xs);
}

.tag {
    color: var(--accent-color);
    font-weight: 500;
}

.read-more-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    background: var(--primary-color);
    color: var(--white);
    border: none;
    border-radius: var(--border-radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
    cursor: pointer;
    transition: all var(--transition-normal);
    font-weight: 500;
}

.read-more-btn:hover {
    background: var(--accent-color);
    transform: translateY(-2px);
}

.news-indicators {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
}

.indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--cloud-white);
    border: none;
    cursor: pointer;
    transition: all var(--transition-normal);
}

.indicator.active {
    background: var(--accent-color);
    transform: scale(1.2);
}

/* Animações */
.news-slide-enter-active,
.news-slide-leave-active {
    transition: all 0.5s ease;
}

.news-slide-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.news-slide-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}

/* Responsividade */
@media (max-width: 768px) {
    .news-content {
        padding: var(--spacing-md);
    }

    .news-content h2 {
        font-size: 1.2rem;
    }

    .news-subtitle {
        font-size: 1rem;
    }

    .news-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-sm);
    }
}
</style>
