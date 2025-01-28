import { ref } from 'vue'

export function useToast() {
  const message = ref('')
  const type = ref('info')
  const visible = ref(false)

  const showToast = (msg, toastType = 'info') => {
    message.value = msg
    type.value = toastType
    visible.value = true

    setTimeout(() => {
      visible.value = false
    }, 3000)
  }

  const hideToast = () => {
    visible.value = false
  }

  return {
    message,
    type,
    visible,
    showToast,
    hideToast
  }
}
