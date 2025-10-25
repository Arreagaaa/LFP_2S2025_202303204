# 📊 Guía de Visualización de Diagramas

**Proyecto 2 - JavaBridge**

Los diagramas del proyecto están en formato **Graphviz (.dot)**, que es un lenguaje estándar para representar grafos y diagramas de flujo.

---

## 📁 Archivos de Diagramas

1. **`AFD_Diagrama.dot`** - Autómata Finito Determinista del Analizador Léxico
2. **`FLUJO_GENERAL.dot`** - Diagrama de Flujo del Sistema Completo

---

## 🖥️ Método 1: Graphviz Online (Recomendado)

### Opción A: GraphvizOnline

1. Visitar: https://dreampuf.github.io/GraphvizOnline/
2. Abrir el archivo `.dot` en un editor de texto
3. Copiar todo el contenido
4. Pegar en el editor de la página web
5. El diagrama se generará automáticamente
6. Clic derecho en la imagen → "Guardar imagen como..."

### Opción B: Edotor

1. Visitar: https://edotor.net/
2. Abrir el archivo `.dot` en un editor de texto
3. Copiar todo el contenido
4. Pegar en el panel izquierdo
5. Ver resultado en el panel derecho
6. Descargar como PNG o SVG

### Opción C: Viz.js

1. Visitar: http://viz-js.com/
2. Abrir el archivo `.dot`
3. Copiar y pegar el contenido
4. Seleccionar formato de salida (PNG, SVG, PDF)
5. Descargar la imagen

---

## 💻 Método 2: Instalar Graphviz Localmente

### Windows

**Usando Chocolatey:**
```bash
choco install graphviz
```

**Usando instalador:**
1. Descargar desde: https://graphviz.org/download/
2. Instalar el archivo `.msi`
3. Agregar al PATH del sistema

### macOS

```bash
brew install graphviz
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install graphviz
```

### Linux (Fedora/RedHat)

```bash
sudo dnf install graphviz
```

---

## 🎨 Generar Imágenes con Graphviz

Una vez instalado Graphviz, usar los siguientes comandos:

### Generar PNG

```bash
# AFD
dot -Tpng docs/AFD_Diagrama.dot -o docs/AFD_Diagrama.png

# Flujo General
dot -Tpng docs/FLUJO_GENERAL.dot -o docs/FLUJO_GENERAL.png
```

### Generar SVG (Escalable)

```bash
# AFD
dot -Tsvg docs/AFD_Diagrama.dot -o docs/AFD_Diagrama.svg

# Flujo General
dot -Tsvg docs/FLUJO_GENERAL.dot -o docs/FLUJO_GENERAL.svg
```

### Generar PDF

```bash
# AFD
dot -Tpdf docs/AFD_Diagrama.dot -o docs/AFD_Diagrama.pdf

# Flujo General
dot -Tpdf docs/FLUJO_GENERAL.dot -o docs/FLUJO_GENERAL.pdf
```

### Generar múltiples formatos

```bash
# Script para Windows (PowerShell)
cd docs
dot -Tpng AFD_Diagrama.dot -o AFD_Diagrama.png
dot -Tsvg AFD_Diagrama.dot -o AFD_Diagrama.svg
dot -Tpng FLUJO_GENERAL.dot -o FLUJO_GENERAL.png
dot -Tsvg FLUJO_GENERAL.dot -o FLUJO_GENERAL.svg
```

```bash
# Script para Linux/macOS (Bash)
cd docs
dot -Tpng AFD_Diagrama.dot -o AFD_Diagrama.png && \
dot -Tsvg AFD_Diagrama.dot -o AFD_Diagrama.svg && \
dot -Tpng FLUJO_GENERAL.dot -o FLUJO_GENERAL.png && \
dot -Tsvg FLUJO_GENERAL.dot -o FLUJO_GENERAL.svg
```

---

## 🔧 Comandos Adicionales de Graphviz

### Ver información del diagrama

```bash
dot -v docs/AFD_Diagrama.dot
```

### Generar en diferentes formatos

| Formato | Comando |
|---------|---------|
| PNG | `-Tpng` |
| SVG | `-Tsvg` |
| PDF | `-Tpdf` |
| PS (PostScript) | `-Tps` |
| JPG | `-Tjpg` |
| GIF | `-Tgif` |

### Cambiar el algoritmo de layout

| Motor | Descripción | Comando |
|-------|-------------|---------|
| dot | Grafos dirigidos jerárquicos (por defecto) | `dot -Tpng ...` |
| neato | Grafos no dirigidos con springs | `neato -Tpng ...` |
| fdp | Grafos no dirigidos con forces | `fdp -Tpng ...` |
| circo | Grafos circulares | `circo -Tpng ...` |
| twopi | Grafos radiales | `twopi -Tpng ...` |

---

## 📱 Método 3: Extensiones de VS Code

### Extensión: Graphviz Preview

1. Abrir VS Code
2. Ir a Extensions (Ctrl+Shift+X)
3. Buscar "Graphviz Preview"
4. Instalar extensión de **joaompinto**
5. Abrir archivo `.dot`
6. Presionar `Ctrl+Shift+V` para previsualizar
7. Clic derecho → "Export to PNG/SVG"

### Extensión: Graphviz (dot) language support

1. Instalar "Graphviz (dot) language support" de Stephan Schantz
2. Proporciona syntax highlighting para archivos .dot
3. Facilita la edición de diagramas

---

## Verificar Sintaxis del Archivo .dot

```bash
# Verificar si el archivo tiene errores de sintaxis
dot -v -Tpng docs/AFD_Diagrama.dot -o /dev/null
```

Si no hay errores, no mostrará ningún mensaje.

---

## Características de los Diagramas del Proyecto

### AFD_Diagrama.dot

**Características:**
- 37 estados del autómata
- Estado inicial (S0) en color verde
- Estados finales en color rojo
- Estados intermedios en amarillo
- Estado de error en rosa
- Transiciones etiquetadas con caracteres y rangos
- Leyenda explicativa

**Tamaño estimado:** 20x16 pulgadas  
**Orientación:** Izquierda a derecha (LR)

### FLUJO_GENERAL.dot

**Características:**
- Flujo completo del sistema de traducción
- Nodos coloreados por tipo:
  - Verde: Inicio/Fin
  - Azul: Procesos
  - Amarillo: Análisis (Lexer/Parser/Traductor)
  - Naranja: Decisiones
  - Rojo: Errores
- Líneas punteadas para flujos opcionales
- Leyenda explicativa

**Orientación:** Arriba hacia abajo (TB)

---

## 💡 Consejos

### Para mejor visualización:

1. **Usar SVG para documentos:** Formato vectorial escalable sin pérdida de calidad
2. **Usar PNG para presentaciones:** Compatible con la mayoría de aplicaciones
3. **Usar PDF para impresión:** Mejor calidad para documentos impresos

### Para editar los diagramas:

1. Abrir el archivo `.dot` en un editor de texto
2. Modificar nodos, aristas o atributos
3. Guardar cambios
4. Regenerar la imagen con `dot -Tpng ...`

### Para incluir en documentos:

```markdown
# En Markdown
![Diagrama del AFD](docs/AFD_Diagrama.png)

# En HTML
<img src="docs/AFD_Diagrama.png" alt="AFD">

# En LaTeX
\includegraphics[width=\textwidth]{docs/AFD_Diagrama.png}
```

---

## Solución de Problemas

### Problema: "dot: command not found"

**Solución:** Graphviz no está instalado o no está en el PATH.

```bash
# Windows
# Agregar C:\Program Files\Graphviz\bin al PATH

# macOS/Linux
# Reinstalar Graphviz
```

### Problema: "Error: syntax error in line X"

**Solución:** Revisar la sintaxis del archivo .dot en la línea indicada.

```bash
# Ver línea específica del archivo
sed -n 'Xp' docs/AFD_Diagrama.dot  # Linux/macOS
Get-Content docs/AFD_Diagrama.dot | Select-Object -Index X  # Windows PowerShell
```

### Problema: La imagen está muy pequeña

**Solución:** Aumentar el tamaño en el comando o en el archivo .dot

```bash
# Aumentar DPI (resolución)
dot -Tpng -Gdpi=300 docs/AFD_Diagrama.dot -o AFD_HD.png

# O modificar el archivo .dot:
size="30,24";  # Cambiar valores
```

---

## Recursos Adicionales

### Documentación Oficial
- **Graphviz:** https://graphviz.org/documentation/
- **DOT Language:** https://graphviz.org/doc/info/lang.html
- **Atributos:** https://graphviz.org/doc/info/attrs.html

### Tutoriales
- **Graphviz Tutorial:** https://www.graphviz.org/pdf/dotguide.pdf
- **DOT Guide:** https://graphs.grevian.org/

### Herramientas Online
- **GraphvizOnline:** https://dreampuf.github.io/GraphvizOnline/
- **Edotor:** https://edotor.net/
- **Viz.js:** http://viz-js.com/

---

## ✅ Checklist de Visualización

- [ ] Elegir método de visualización (online o local)
- [ ] Abrir `docs/AFD_Diagrama.dot`
- [ ] Generar imagen del AFD
- [ ] Abrir `docs/FLUJO_GENERAL.dot`
- [ ] Generar imagen del Flujo General
- [ ] Verificar que los diagramas sean legibles
- [ ] Guardar imágenes en formato deseado (PNG, SVG, PDF)
- [ ] Incluir imágenes en documentación si es necesario

---

**Elaborado por:** Christian Javier Rivas Arreaga  
**Carnet:** 202303204  
**Fecha:** Octubre 2025
