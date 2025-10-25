<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-3 flex items-center justify-between border-b-2 border-blue-600">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
        </svg>
        <span class="text-lg font-semibold">Editor Java</span>
        <span v-if="filename" class="text-sm opacity-80 bg-blue-800/50 px-2 py-1 rounded">{{ filename }}</span>
      </div>
      <div class="flex items-center gap-3 text-sm">
        <span class="bg-blue-800/50 px-3 py-1 rounded">Lineas: {{ lineCount }}</span>
        <span class="bg-blue-800/50 px-3 py-1 rounded">Caracteres: {{ charCount }}</span>
      </div>
    </div>

    <!-- Editor Area -->
    <div class="flex-1 overflow-hidden relative">
      <textarea
        ref="editor"
        v-model="localCode"
        @input="handleInput"
        class="w-full h-full p-4 code-editor resize-none border-none focus:ring-0"
        :placeholder="placeholderText"
        spellcheck="false"
      ></textarea>
    </div>

    <!-- Footer con estadisticas -->
    <div class="bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-2 text-xs text-gray-300 flex justify-between items-center">
      <span>JavaBridge Editor v1.0</span>
      <span v-if="lastModified">Ultima modificacion: {{ lastModified }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Editor',
  props: {
    code: {
      type: String,
      default: ''
    },
    filename: {
      type: String,
      default: ''
    }
  },
  emits: ['update:code'],
  data() {
    return {
      localCode: this.code,
      lastModified: null,
      placeholderText: `// Escribe tu codigo Java aqui...
public class MiClase {
    public static void main(String[] args) {
        System.out.println("Hola Mundo");
    }
}`
    }
  },
  computed: {
    lineCount() {
      return this.localCode.split('\n').length;
    },
    charCount() {
      return this.localCode.length;
    }
  },
  watch: {
    code(newVal) {
      this.localCode = newVal;
    }
  },
  methods: {
    handleInput() {
      this.$emit('update:code', this.localCode);
      this.updateLastModified();
    },
    updateLastModified() {
      const now = new Date();
      this.lastModified = now.toLocaleTimeString('es-GT');
    },
    focus() {
      this.$refs.editor.focus();
    }
  },
  mounted() {
    this.focus();
  }
}
</script>

<style scoped>
.code-editor {
  background: white;
  color: #2d3748;
}
</style>
