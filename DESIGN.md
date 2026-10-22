> **Actualización de tokens (22-10-2026):** el export CSS de Figma está
> incorporado en `src/design-tokens/figma-tokens.css` como fuente de verdad
> para Primitive + Semantic (modos `base` y `avila`). Las notas anteriores
> `POR EXTRAER` sobre **colores, espaciado, radios y tipografía** quedan
> supersedidas por ese archivo; los detalles geométricos por componente aún
> requieren revisión visual. No regenerar la paleta provisional.
>
> **Regla para agentes:** las variables y alias del export adjunto mandan,
> incluyendo `--radius-full` diferente entre ambos modos. Reutilizar el
> nombre original en nuevos componentes; `legacy-utility-bridge.css` solo
> conserva compatibilidad de clases existentes, no autoriza nuevos tokens.

---
version: alpha
name: "Portfolio Design System — identidad basada en Figma"
description: "Contrato visual y protocolo de migración para construir una biblioteca personal de componentes React y Storybook a partir de una base técnica autorizada, tomando el archivo Figma indicado como referencia de diseño."
components:
  button-large:
    height: "52px"
  button-medium:
    height: "44px"
  button-small:
    height: "32px"
---

# DESIGN.md — Portfolio Design System

> **Estado:** especificación inicial basada en la estructura de Figma ya inspeccionada. No constituye una extracción integral de sus tokens. **Completar las secciones marcadas `POR EXTRAER` antes de ejecutar la transformación visual definitiva.**
>
> **Uso:** colocar este documento en la raíz del proyecto y pedir al agente que lo lea completo antes de modificar código. Es a la vez un contrato de diseño y un protocolo de trabajo. Se inspira en la especificación abierta de Google DESIGN.md (versión `alpha`): https://github.com/google-labs-code/design.md.
>
> **Base de implementación:** el usuario declara ser autor de la arquitectura y los componentes del ZIP, informa que él mismo añadió su aviso restrictivo y solicita explícitamente reutilizar el código existente para Ávila DS. **No reconstruir de cero por defecto**: conservar comportamiento, lógica, Storybook, tests y dependencias funcionales, y adaptar alcance e identidad. Antes de publicar, excluir información confidencial, marcas, recursos y datos de negocio ajenos, y verificar los derechos de uso necesarios de cualquier recurso de terceros.

## Overview

### Objetivo

Transformar una implementación existente de Design System + Storybook en **un Design System personal, publicable y demostrable**. El resultado debe sentirse como una biblioteca de UI diseñada y construida de forma deliberada, no como un re-skin improvisado ni como una copia de la identidad del empleador.

**Fuente de verdad y precedencia:**

1. **Figma objetivo:** decisiones visuales, familia y anatomía de componentes, variantes, tokens, estados y composición.
2. **Contrato de comportamiento accesible:** semántica HTML, interacción por teclado, comunicación de estados, soporte a lectores de pantalla y expectativas de usuario.
3. **ZIP de origen (base técnica prioritaria):** arquitectura, implementación React, patrones reutilizables, lógica, tests, Stories y experiencia de desarrollo. Reutilizar el código aportado según el encargo; limitar públicamente el catálogo a Figma.
4. **Criterio documentado:** únicamente cuando Figma no especifique algo, elegir una solución consistente y registrar la decisión como inferida.

Ante conflicto entre la UI original del ZIP y la UI de Figma, **Figma manda visualmente** y la solución técnica original debe conservarse como base funcional siempre que sea compatible. Ante conflicto entre una representación visual y la accesibilidad, conservar la intención estética sin sacrificar la interacción accesible.

### Archivo de referencia

- Figma: https://www.figma.com/file/vJS4Ozok1qKFmRoBbtlNda?locale=es-la&type=design
- File key: `vJS4Ozok1qKFmRoBbtlNda`
- Tipo de archivo: biblioteca de diseño con páginas temáticas de componentes.
- Evidencia comprobada: estructura de páginas y matriz de componentes Button (ver sección Components).
- **POR EXTRAER**: nombre comercial de la biblioteca, estilos de color, variables, tipografías, iconografía precisa, radios, elevaciones y detalles de cada componente. No atribuir valores no observados.

### Identidad a transmitir

El carácter visual debe **descubrirse a partir de la biblioteca de Figma**, no derivarse del look-and-feel del ZIP. Evitar imponer por defecto glassmorphism, gradientes, sombras de moda, bordes redondeados genéricos, Inter u otras convenciones no observadas. El portfolio debe tener una identidad propia en su envoltorio (marca personal, navegación y textos), claramente diferenciada del sistema de componentes que documenta.

### Alcance: paridad funcional selectiva

No migrar todos los componentes por inercia. Trabajar sobre la **intersección semántica entre los componentes existentes en el ZIP y el catálogo de Figma**. Si Figma documenta un patrón ausente y es pertinente para el showcase, podrá construirse desde cero y etiquetarse como nuevo. Un componente corporativo o específico del negocio sin equivalente no debe incluirse por defecto en la biblioteca pública.

## Colors

**POR EXTRAER — datos reales de Figma.** El archivo aún no contiene una paleta certificada. Al obtener acceso:

1. Leer colecciones de variables de color, modos (por ejemplo light/dark solo si existen), alias, paint styles y valores de fills y strokes representativos.
2. Construir una tabla de tokens `primitives → semantic → component`; respetar sus nombres cuando correspondan a roles semánticos y documentar cualquier traducción a nombres CSS.
3. Diferenciar superficies, texto, bordes, iconos, foco, hover, pressed, disabled, loading y estados de feedback si existen.
4. Registrar cada valor con su **fuente precisa** (`collection/variable/mode` o `page/node/property`). No deducir colores de capturas cuando se disponga del valor de origen.
5. Incorporar aquí un bloque YAML `colors:` conforme a DESIGN.md y eliminar `colors` de `omitted` al completar y verificar la extracción.

**Regla de implementación:** los componentes consumen tokens semánticos; los valores HEX, RGB u OKLCH solo existen en las definiciones de tokens, no dispersos como literales dentro de los componentes. Mantener los modos presentes en la fuente. No inventar un tema dark que Figma no haya definido.

## Typography

**POR EXTRAER — datos reales de Figma.** Registrar:

- Familias, fallbacks, disponibilidad y condiciones de uso/licencia de fuentes.
- Tamaños, pesos, alturas de línea, tracking, capitalización y jerarquías.
- Roles `display / heading / body / label / caption` solo si su estructura está respaldada por Figma; de lo contrario, usar nombres reales de estilos.
- Tratamiento de truncamiento, wrapping, números tabulares, errores y contenido de longitud variable.

Generar tokens tipográficos en YAML (`typography:`) con `fontFamily`, `fontSize`, `fontWeight`, `lineHeight` y `letterSpacing` **solo con valores verificados**. Eliminar `typography` de `omitted` al completar. No copiar automáticamente la tipografía del sistema de origen.

## Layout

**POR EXTRAER — medidas reales.**

- Obtener spacing, padding, gaps, constraints, min/max width, tamaños intrínsecos y comportamiento de Auto Layout de Figma.
- Distinguir **dimensión de ejemplo** de **regla de componente**: una muestra de 200 px de ancho no significa que todos los botones deban medir 200 px.
- Describir el layout responsivo por comportamiento, no limitarlo a un conjunto de breakpoints arbitrarios. Los componentes deben adaptarse al contenedor y al contenido.
- No perder soporte de textos largos, zoom 200–400 %, internacionalización ni targets táctiles adecuados.
- No fijar alturas arbitrarias en campos de texto multilinea o contenido dinámico.
- Crear tokens YAML `spacing:` y retirarlo de `omitted` una vez verificados.

**Reglas en React/CSS:** preferir tokens + CSS Grid/Flex y dimensionado intrínseco; evitar coordenadas absolutas para composición normal; respetar propiedades `min-width`, `flex-wrap`, `overflow` y `box-sizing` de cada patrón.

## Elevation & Depth

**POR EXTRAER — efectos reales.**

Inventariar shadow styles, blur, opacidad, bordes, overlays, estados elevados y jerarquía de capas. Conservar el grado real de profundidad del sistema. No añadir sombras o efectos decorativos para que "se vea más premium". Documentar tokens CSS para elevación y z-index **solo cuando estén justificados** por componentes observados.

## Shapes

**POR EXTRAER — geometrías reales.**

Medir radios, stroke widths, proporciones, iconos, tamaño visual e hit areas; distinguir círculos perfectos, pills, rectángulos redondeados y bordes de estados. Registrar `rounded:` en YAML al disponer de valores fiables y retirarlo de `omitted`. Mantener coherencia entre subcomponentes y variants; no usar el mismo radio para todos por conveniencia.

### Iconografía y otros recursos

Figma incluye páginas denominadas `Icons (Lucide)`, `Flags`, `Payment Methods` y `Social Media`. Esto acredita la **existencia de esas familias**, no garantiza que todos sus recursos sean libres de uso. Usar `lucide-react` si la implementación existente y el catálogo realmente lo permiten; respetar tamaños y pesos vistos en Figma. Para marcas, banderas o logos de terceros, comprobar permiso y sustituir por muestras neutras cuando sea necesario.

## Components

### Catálogo de Figma observado

**Los nombres e IDs siguientes se confirmaron en la estructura del archivo.** La existencia del componente en Figma **no obliga** a implementarlo: cada uno necesita un equivalente funcional o una justificación explícita para crearlo.

| Grupo | Catálogo Figma | Identificadores orientativos |
|---|---|---|
| Assets | Icons (Lucide), Flags, Payment Methods, Social Media | páginas `19989:7444`, `19989:7447`, `19989:7456`, `19989:7453` |
| Navigation | Breadcrumb, Bottom Nav, Key Button, Tabs, Scrollbar | páginas `19989:417`, `19989:416`, `19989:418`, `19989:419`, `19989:7451` |
| Buttons | Action Icon, Button, Icon Button, Icon Toggle Button, Toggle Button | páginas `19989:411` a `19989:415` |
| Feedback | Badge, Chip, Loader, Tooltip, Notification | páginas `19989:420`, `19989:4694`, `19989:421`, `19989:422`, `19989:4698` |
| Forms | Calendar, Checkbox, Date Picker, Dropdown, Help Text, Password Input, Phone Number Input, Radiobutton, Search Input, Select Input, Text Area, Text Input, Toggle, Upload Input | páginas `19989:1788` a `19989:1801` |
| Content | Avatar, Avatar Group, Body Text, Divider, Image, List, Swap, Toast | páginas `19989:4691`, `19989:4692`, `19989:4693`, `19989:4695`, `19989:4696`, `19989:4697`, `19989:4699`, `19989:4700` |
| Cards | Image Card | página `19989:4715` |

`Swap` es únicamente el nombre de una página de Figma observada: **inspeccionar su función** antes de decidir qué componente React le corresponde. No inferir que es necesariamente una operación de intercambio.

### Componente Button: contrato inicial comprobado

Figma página `19989:412`, contenedor `607:416`. La matriz visible contiene **60 variantes**:

| Dimensión | Valores documentados |
|---|---|
| Size | `L`, `M`, `S` |
| Variant | `Primary`, `Secondary`, `Tertiary`, `Destructive` |
| State | `Default`, `Hover`, `Pressed`, `Disabled`, `Loading` |
| Height L | `52px` |
| Height M | `44px` |
| Height S | `32px` |

Estos tamaños se observaron en los componentes de la matriz. **No extrapolar** sus colores, radios, paddings, tipografía, espaciado de iconos ni width a partir de esos nombres. El estado `Loading` puede modificar el ancho del ejemplo, por lo que el agente debe analizar la intención del botón en estado loading antes de generalizar la regla de tamaño. Verificar además la presencia/ausencia de iconos, accesibilidad y orden del contenido.

### Comparación obligatoria ZIP ↔ Figma

Antes de editar componentes, producir `docs/component-mapping.md` con columnas:

`origen (ruta) | nombre público | propósito | comportamiento | equivalente Figma (página/ID) | variantes/estados | decisión | cambios previstos | licencia/autorización | estado`.

Decisiones posibles:

- **ADAPT:** mismo propósito y comportamiento; conservar lo reutilizable y sustituir estructura visual/tokens/variantes según Figma.
- **SPLIT / MERGE:** el ZIP reúne múltiples patrones bajo una API, o Figma los divide; reorganizar conservando la claridad de la API pública.
- **NEW:** hay una necesidad documentada en Figma pero no una implementación equivalente en el ZIP; construir como trabajo personal nuevo, priorizando solo patrones útiles.
- **ARCHIVE:** componente original sin correspondencia o de negocio; excluirlo de Storybook público y de exports públicos.
- **REBUILD CLEAN:** únicamente para partes concretas imposibles de adaptar, no equivalentes o sujetas a derechos de terceros; no usar esta opción para rehacer indiscriminadamente la biblioteca.

La equivalencia se evalúa por propósito, comportamiento y anatomía, **no por una coincidencia de nombres**. Por ejemplo, `TextInput` puede mapear a `Text Input`; `BottomSheet` NO equivale automáticamente a `Bottom Nav`.

### Anatomía que debe documentarse por componente

Cada componente incluido debe disponer de:

1. Nombre de Figma, enlace/ID exacto y ruta al código.
2. Uso previsto y cuándo NO utilizarlo.
3. Anatomía visual: contenedor, contenido, slot de icono, label, helper/error, elementos adicionales y jerarquía.
4. Propiedades públicas (TypeScript), valores permitidos y defaults; distinguir props visuales de props funcionales.
5. Variantes, estados, transiciones y reglas de composición; `disabled`, `focus-visible`, `loading`, `error`, `hover`, `pressed` solo cuando sean aplicables.
6. Tokens aplicados y medidas verificadas en Figma; anotar todas las inferencias.
7. Casos límite: textos largos, overflow, icons-only, responsive, teclado, accesibilidad y contenido vacío.

### Implementación en Storybook

- Mostrar primero el uso más representativo; después variantes, estados y casos complejos.
- Ofrecer **Controls** bien tipados y una story por eje significativo, evitando explosiones de historias duplicadas.
- Documentar tokens y razonamiento de decisiones, sin revelar información sensible del origen laboral.
- Incorporar `Autodocs`, pruebas de interacción, accesibilidad y ejemplos de uso cuando las dependencias del repo los soporten.
- Las stories no deben utilizar marcas, usuarios, números de cuenta, flujos o datos internos de la empresa.
- Mantener una sección de **Foundations** con Color, Typography, Spacing, Radius, Elevation e Iconography únicamente tras verificar que los tokens existen.
- El Storybook personal debe funcionar como un **producto completo de portfolio**: navegación clara, introducción al sistema, documentación de decisiones y al menos un ejemplo de composición usando componentes reales.

## Do's and Don'ts

### Reglas innegociables

**HACER**

- Usar Figma como criterio visual verificable; documentar el origen concreto de cada valor.
- Preservar la calidad arquitectónica, la semántica y el comportamiento accesible del código aportado por el usuario; reemplazar de forma puntual los recursos que no correspondan al nuevo alcance.
- Traducir la identidad completa: tokens, iconos, anatomía, estados, layouts, microinteracciones y Storybook, no solo colores.
- Centralizar decisiones en tokens y asegurar variantes coherentes.
- Mantener un historial de decisiones e incertidumbres, con evidencia antes/después.
- Mostrar públicamente el proyecto como un **Design System personal desarrollado e implementado**, explicando el alcance real y la autoría de cada aporte.

**NO HACER**

- Publicar datos privados, marcas corporativas, imágenes licenciadas o lógica sensible fuera del alcance personal.
- Publicar logotipos, nombres internos, pantallas confidenciales, datos o capturas de la empresa.
- Reinterpretar libremente la UI objetivo cuando sus medidas sean consultables.
- Inventar paletas, tipografías, radios, modos o animaciones supuestamente "tomados de Figma".
- Incluir componentes que no existen en el alcance acordado solo para inflar el catálogo.
- Reemplazar silenciosamente la arquitectura, APIs o tests por una demo frágil.
- Construir un nuevo framework o introducir librerías masivas sin motivo.

### Protocolo de ejecución para el agente

**Entrada necesaria:**

- Este `DESIGN.md` en la raíz.
- ZIP con DS + Storybook o repositorio descomprimido.
- Acceso de solo lectura al Figma objetivo, o export verificable de tokens/estilos/componentes e imágenes de referencia si el conector no está disponible.
- El usuario declara ser autor de la base y solicita reutilización directa. Verificar únicamente permisos/licencias de recursos de terceros y que no se filtren secretos, información confidencial ni materiales corporativos ajenos al producto personal.

**Fase 0 — Inspección sin cambios**

1. Auditar `package.json`, versiones, tooling, scripts, estructura, tokens, componentes, stories, tests, licencia y dependencias. No ejecutar scripts desconocidos sin inspeccionarlos.
2. Identificar archivos ajenos al alcance (`negocio`, `marca`, `mock sensible`, `fuentes o assets de terceros`) y excluirlos del Storybook y bundle público, conservando el código base funcional y las dependencias internas requeridas.
3. Crear `docs/baseline-audit.md`: estructura del repo, rutas, conteos, riesgos, comandos verificables y estado inicial de build/tests.
4. No modificar la fuente original: usar branch/worktree/copia limpia y documentar operaciones destructivas.

**Fase 1 — Extracción rigurosa de Figma**

1. Levantar inventario real de componentes, variantes, propiedades, nodos y referencias visuales para los candidatos seleccionados.
2. Recuperar variables, modos, aliases, estilos tipográficos, paint/effect styles y medidas. Resolver referencias de alias hasta el valor final para cada modo.
3. Construir `docs/figma-token-audit.md`, citando `collection/variable/mode` o `node/property`; incluir unidades y nivel de confianza.
4. Completar los bloques de tokens `colors`, `typography`, `spacing`, `rounded` y `components` de este archivo **con valores reales** y retirar las entradas correspondientes de `omitted`.
5. Si Figma no es accesible (por permisos, límite del conector u otro motivo), no afirmar que hubo extracción: conservar `POR EXTRAER`, solicitar o localizar material exportado válido y continuar solo con tareas técnicas que no dependan de ese dato.

**Fase 2 — Selección y arquitectura**

1. Crear `docs/component-mapping.md` con todas las coincidencias justificadas.
2. Definir inventario público mínimo, estrategia de tokens, Storybook, naming, API y composición.
3. Reutilizar stack existente **como prioridad si es compatible**. Si el ZIP utiliza React 19, TypeScript strict, Tailwind v4 CSS-first y Storybook 10, preservar esas convenciones; si utiliza otras versiones, inspeccionar primero y no migrar por reflejo.
4. No emplear `any` ni casts inseguros por comodidad; mantener types y props consistentes con el repositorio.
5. Usar componentes accesibles, preferir semántica nativa y evitar duplicar lógica de estados.

**Fase 3 — Migración visual sistemática**

1. Implementar primitives → semantic tokens → estilos globales → componentes base → componentes compuestos → stories.
2. Empezar con una muestra representativa (por defecto Button), compararla con Figma y consolidar el patrón técnico; luego aplicar la misma disciplina al resto.
3. Garantizar paridad de interacción y estados de cada componente. `loading` debe bloquear activaciones no deseadas y anunciar su estado; `disabled` debe tener semántica real, no solo aspecto visual.
4. Evitar que una story engañe: `hover` y `pressed` pueden necesitar simulación o estados de documentación cuando no son props de producción. No introducir props artificiales en la API pública únicamente para exhibir screenshots.
5. Sustituir cualquier contenido de demostración por datos ficticios, neutros y no identificables.

**Fase 4 — Validación**

1. Ejecutar comandos reales del repositorio para lint, typecheck, test, build de librería y build de Storybook. Registrar evidencia y fallos, no inventar logs.
2. Visual QA por componente: comparación directa con Figma de geometría, padding, color, tipografía, iconos, estados y responsive.
3. Accesibilidad: teclado completo, foco visible, nombres accesibles, feedback de errores, compatibilidad con lectores de pantalla, `prefers-reduced-motion` y contraste WCAG AA cuando corresponda.
4. Revisión de import/export: no assets propietarios ni imports hacia repositorios, dominios, servicios o módulos internos del trabajo.
5. Generar `docs/visual-qa.md` con tabla `componente | Figma | story | diferencias | correcciones | aprobado`.
6. Ejecutar `npx @google/design.md lint DESIGN.md` cuando la red y el proyecto lo permitan; resolver errores sin rellenar tokens con valores ficticios.

**Fase 5 — Publicación de portfolio**

1. Preparar Storybook estático, con README público y créditos/atribuciones apropiados.
2. Mostrar **diseño + ingeniería**: Foundations, Components, Patterns, ejemplos de composición, guía de contribución y decisiones técnicas significativas.
3. Revisar licencias de librerías, fuentes, iconos y assets; eliminar información confidencial, secretos, endpoints y marcas no autorizadas.
4. Mantener reproducibilidad: `npm install` o equivalente según lockfile, script de desarrollo, build y export estático documentados y comprobados.
5. Publicar únicamente con todos los controles de propiedad intelectual, calidad y seguridad cumplidos.

### Definition of Done

- [ ] Solo los componentes seleccionados por correspondencia semántica están en la API pública.
- [ ] Los valores visuales se derivan de Figma y están referenciados en `DESIGN.md`/tokens; los faltantes se documentan como pendientes.
- [ ] Existe un mapping auditable de ZIP → componente final → página/nodo Figma.
- [ ] El design system utiliza identidad visual propia y no incorpora secretos, recursos de terceros no licenciados ni referencias corporativas que deban eliminarse.
- [ ] Componentes operativos, Stories utilizables y documentación comprensible.
- [ ] Tests, lint, typecheck, build y Storybook build verificables, o fallos explícitos con causa.
- [ ] Visual QA y a11y documentados por componente.
- [ ] README explica propósito, alcance, créditos y forma de iniciar el proyecto.

### Formato de reporte y control de avance

En cada respuesta del agente, comunicar de forma breve:

- **Resuelto:** acciones y archivos realmente modificados, con resultados comprobados.
- **Pendiente:** máximo tres bloqueos concretos.
- **Siguiente acción:** una acción acotada y verificable.

No declarar éxito sin evidencia. No borrar ni modificar masivamente materiales sin una forma razonable de reversión. Evitar ciclos infinitos de mejoras visuales: máximo dos iteraciones sin nuevos datos por componente; si persiste una diferencia, registrar un bloqueo con captura y medidas.

### Primer encargo al agente

> Lee `DESIGN.md` completo. Analiza el ZIP del DS/Storybook y el archivo Figma indicado. No hagas cambios todavía: produce una auditoría técnica, un inventario de tokens verificables de Figma y una matriz de correspondencia de componentes. Prioriza la reutilización directa de la implementación aportada por el usuario, mantén el Storybook, APIs y pruebas cuando sea posible, y adapta la identidad sobre la arquitectura existente, por tandas verificables, empezando por Button, conservando accesibilidad y funcionalidad, y documenta cada decisión. El resultado final debe ser un Storybook personal de nivel portfolio, publicable, reproducible y libre de material confidencial. Si faltan los datos visuales reales, no los inventes ni presentes el trabajo como fiel a Figma.

## Addendum — export CSS autoritativo recibido (22-10-2026)

- `src/design-tokens/figma-tokens.css`: export íntegro y sin retoques manuales de Primitive Root y Semantic `base` / `avila`.
- `src/design-tokens/export-corrections.css`: neutraliza 6 declaraciones autorreferenciales de peso tipográfico del propio export. Aplica los pesos Primitive equivalentes sin alterar la fuente.
- `src/design-tokens/legacy-utility-bridge.css`: puente de utilidades CSS existentes a nombres semánticos presentes en el archivo original. No contiene valores de marca propios.
- Modo `avila`: `--color-theme-background-primary` → `--color-valle-600` (`#1c7c54`); hover → valle-700, pressed → valle-800.
- Modo `base`: `--color-theme-background-primary` → `--color-blue-600` (`#2563eb`).
- Familia semántica de ambos modos: `--typography-family-font-family-font` → Poppins.
- Radio de botón: `--radius-button` → `--size-radius-300` (`12px`).
- Nota: `--radius-full` en `avila` es `--size-radius-300` (`12px`), distinto al modo `base`; preservarlo como está definido. Para elementos obligatoriamente circulares usar el primitivo `--size-radius-full`.
- Los colores y dimensiones de componentes sin variable explícita Figma siguen sujetos a revisión; no suponer paridad visual definitiva por haber integrado tokens.

### Política de consumo

1. Componentes nuevos: consumir directamente `var(--color-...semántico)`, `var(--radius-...)` o `var(--size-...)` de `figma-tokens.css`.
2. Componentes heredados: las clases `*-primary-bg-*` y similares se resuelven a tokens Figma mediante el puente. Migrar progresivamente las clases a nombres de Figma; nunca recuperar el archivo de paleta provisional.
3. Stories: conmutar `data-theme=avila/base` desde la toolbar; `avila` es el valor inicial.
4. Verificar con `npm run check:tokens`, `npm run typecheck`, `npm test` y `npm run build-storybook`.
