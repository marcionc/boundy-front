import { ref, onMounted, onUnmounted } from 'vue'

export function useResponsive() {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const orientation = ref('portrait')

  const checkDevice = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    isMobile.value = width < 768
    isTablet.value = width >= 768 && width < 992
    isDesktop.value = width >= 992
    orientation.value = width > height ? 'landscape' : 'portrait'
  }

  const onResize = () => {
    checkDevice()
  }

  onMounted(() => {
    checkDevice()
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    orientation
  }
}

// Helpers para media queries
export const mediaQueries = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 991px)',
  desktop: '(min-width: 992px)',
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)'
}
