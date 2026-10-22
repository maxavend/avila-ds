# Estado de implementación

- Catálogo Figma observado: **38** tipos/páginas (sin familias de assets).
- Equivalencias preliminares con implementación existente: **32**.
- Código runtime reutilizado: **52** archivos fuente TypeScript/TSX, contando dependencias internas.
- Nuevas stories de integración: **11**.
- Tokens visuales Figma: **no verificados** (límite de la conexión).
- Verificación runtime: requiere instalar dependencias y ejecutar `typecheck` y `build-storybook`.

## Pendiente para fidelidad visual

1. Exportar variables, modos, estilos de texto y efectos de Figma.
2. Validar anatomía de componentes y comparación pixel a pixel.
3. Adaptar `avila-theme.css`, `primitive.css` y clases de componentes a valores reales.
4. Completar las stories seleccionadas para componentes complejos; reutilizar escenarios funcionales del Storybook de origen.
5. Ejecutar las pruebas de accesibilidad, navegación y regresión visual; no publicar como paridad terminada antes de pasar estos controles.
