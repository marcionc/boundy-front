<template>
  <Transition name="modal">
    <div 
      v-if="modelValue" 
      class="modal-overlay"
      @click.self="handleOverlayClick"
    >
      <div 
        class="modal-container"
        :class="[
          `modal-${size}`, 
          `modal-${variant}`,
          { 'modal-scrollable': scrollable }
        ]"
        role="dialog"
        aria-modal="true"
      >
        <!-- Header -->
        <div 
          v-if="title || $slots.header || closeButton" 
          class="modal-header"
        >
          <slot name="header">
            <div class="modal-header-content">
              <Icon 
                v-if="icon" 
                :name="icon" 
                class="modal-header-icon" 
              />
              <h2 v-if="title" class="modal-title">{{ title }}</h2>
            </div>
            
            <button 
              v-if="closeButton" 
              @click="closeModal"
              class="modal-close-button"
              aria-label="Fechar modal"
            >
              <Icon name="close" />
            </button>
          </slot>
        </div>

        <!-- Body -->
        <div 
          class="modal-body" 
          :class="{ 'modal-body-padded': bodyPadding }"
        >
          <slot></slot>
        </div>

        <!-- Footer -->
        <div 
          v-if="$slots.footer || (cancelText || confirmText)" 
          class="modal-footer"
        >
          <slot name="footer">
            <button 
              v-if="cancelText" 
              @click="cancelModal" 
              class="modal-button modal-button-cancel"
            >
              {{ cancelText }}
            </button>
            <button 
              v-if="confirmText" 
              @click="confirmModal" 
              class="modal-button modal-button-confirm"
              :disabled="confirmDisabled"
            >
              {{ confirmText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import Icon from '@/components/icons/Icon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
  },
  cancelText: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: ''
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  closeButton: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  bodyPadding: {
    type: Boolean,
    default: true
  },
  scrollable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:modelValue', 
  'close', 
  'confirm', 
  'cancel'
])

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    closeModal()
  }
}

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const confirmModal = () => {
  emit('confirm')
  closeModal()
}

const cancelModal = () => {
  emit('cancel')
  closeModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: var(--spacing-lg);
  overflow: auto;
}

.modal-container {
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.modal-small { max-width: 300px; }
.modal-medium { max-width: 500px; }
.modal-large { max-width: 800px; }
.modal-full { 
  width: 90%;
  max-width: none; 
}

.modal-scrollable {
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.modal-header-icon {
  width: 24px;
  height: 24px;
}

.modal-title {
  margin: 0;
  font-size: var(--font-size-lg);
}

.modal-close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
}

.modal-body {
  flex-grow: 1;
  overflow-y: auto;
}

.modal-body-padded {
  padding: var(--spacing-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.modal-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.modal-button-cancel {
  background-color: var(--background-color);
  color: var(--text-color);
}

.modal-button-confirm {
  background-color: var(--primary-color);
  color: white;
}

.modal-button-cancel:hover {
  background-color: var(--border-color);
}

.modal-button-confirm:hover {
  background-color: var(--primary-color-dark);
}

.modal-button-confirm:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

.modal-primary .modal-button-confirm { background-color: var(--primary-color); }
.modal-success .modal-button-confirm { background-color: var(--success-color); }
.modal-warning .modal-button-confirm { background-color: var(--warning-color); }
.modal-danger .modal-button-confirm { background-color: var(--danger-color); }

/* Transições */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
  opacity: 0;
}
</style>
