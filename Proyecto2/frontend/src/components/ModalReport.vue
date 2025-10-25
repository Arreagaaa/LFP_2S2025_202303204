<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="close">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <h2 class="text-xl font-bold">{{ title }}</h2>
          <button
            @click="close"
            class="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-auto p-4">
          <iframe
            v-if="htmlContent"
            :srcdoc="htmlContent"
            class="w-full h-full min-h-[600px] border-0"
            sandbox="allow-same-origin"
          ></iframe>
          <div v-else class="flex items-center justify-center h-full text-gray-400">
            <p>No hay contenido para mostrar</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            @click="downloadReport"
            class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition flex items-center gap-2"
          >
            <span>💾</span>
            <span>Descargar HTML</span>
          </button>
          <button
            @click="close"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'ModalReport',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Reporte'
    },
    htmlContent: {
      type: String,
      default: ''
    },
    filename: {
      type: String,
      default: 'reporte.html'
    }
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close');
    },
    downloadReport() {
      if (!this.htmlContent) {
        alert('No hay contenido para descargar');
        return;
      }

      // Crear blob con el HTML
      const blob = new Blob([this.htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      // Crear enlace temporal y descargar
      const a = document.createElement('a');
      a.href = url;
      a.download = this.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('✅ Reporte descargado correctamente');
    }
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
