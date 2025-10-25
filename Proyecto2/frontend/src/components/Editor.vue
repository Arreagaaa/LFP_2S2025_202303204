<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div
      class="bg-[#0f172a] border-b border-slate-700/50 px-5 py-3 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <svg
          class="w-5 h-5 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        <span class="text-sm font-medium text-slate-300">Editor Java</span>
        <span
          v-if="filename"
          class="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded"
          >{{ filename }}</span
        >
      </div>
      <div class="flex items-center gap-4 text-xs text-slate-400">
        <span>Lineas: {{ lineCount }}</span>
        <span>Caracteres: {{ charCount }}</span>
      </div>
    </div>

    <!-- Editor Area -->
    <div class="flex-1 overflow-hidden relative bg-[#0f172a]">
      <textarea
        ref="editor"
        v-model="localCode"
        @input="handleInput"
        class="w-full h-full p-6 code-editor resize-none border-none focus:ring-0 bg-transparent text-slate-200"
        :placeholder="placeholderText"
        spellcheck="false"
      ></textarea>
    </div>

    <!-- Footer con estadisticas -->
    <div
      class="bg-[#0f172a] border-t border-slate-700/50 px-5 py-2 text-xs text-slate-500 flex justify-between items-center"
    >
      <span>UTF-8 | Java</span>
      <span v-if="lastModified">{{ lastModified }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Editor",
  props: {
    code: {
      type: String,
      default: "",
    },
    filename: {
      type: String,
      default: "",
    },
  },
  emits: ["update:code"],
  data() {
    return {
      localCode: this.code,
      lastModified: null,
      placeholderText: `// Escribe tu codigo Java aqui...
public class MiClase {
    public static void main(String[] args) {
        System.out.println("Hola Mundo");
    }
}`,
    };
  },
  computed: {
    lineCount() {
      return this.localCode.split("\n").length;
    },
    charCount() {
      return this.localCode.length;
    },
  },
  watch: {
    code(newVal) {
      this.localCode = newVal;
    },
  },
  methods: {
    handleInput() {
      this.$emit("update:code", this.localCode);
      this.updateLastModified();
    },
    updateLastModified() {
      const now = new Date();
      this.lastModified = now.toLocaleTimeString("es-GT");
    },
    focus() {
      this.$refs.editor.focus();
    },
  },
  mounted() {
    this.focus();
  },
};
</script>

<style scoped>
.code-editor {
  font-family: "Fira Code", "Consolas", "Monaco", monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #e2e8f0;
}

.code-editor::placeholder {
  color: #475569;
}

.code-editor:focus {
  outline: none;
}
</style>
