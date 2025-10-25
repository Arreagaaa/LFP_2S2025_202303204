<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-lg font-semibold">📝 Editor Java</span>
        <span v-if="filename" class="text-sm opacity-80">{{ filename }}</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <span>Líneas: {{ lineCount }}</span>
        <span>•</span>
        <span>Caracteres: {{ charCount }}</span>
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

    <!-- Footer con estadísticas -->
    <div class="bg-gray-100 px-4 py-2 text-xs text-gray-600 flex justify-between items-center">
      <span>JavaBridge Editor v1.0</span>
      <span v-if="lastModified">Última modificación: {{ lastModified }}</span>
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
      placeholderText: `// Escribe tu código Java aquí...
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
