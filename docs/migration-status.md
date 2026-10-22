# Estado de implementación

- Catálogo Figma observado: **38** tipos/páginas (sin familias de assets).
- Equivalencias preliminares con implementación existente: **32**.
- Código runtime reutilizado: **52** archivos fuente TypeScript/TSX, contando dependencias internas.
- Nuevas stories de integración: **32**.
- Tokens visuales Figma: **no verificados** (límite de la conexión).
- Verificación runtime: requiere instalar dependencias y ejecutar `typecheck` y `build-storybook`.

## Pendiente para fidelidad visual

1. Exportar variables, modos, estilos de texto y efectos de Figma.
2. Validar anatomía de componentes y comparación pixel a pixel.
3. Integrados los valores reales de Primitive y Semantic desde el export CSS de Figma (modos base/avila). Refactor progresivo de las clases legacy a nombres canónicos.
4. Completar las stories seleccionadas para componentes complejos; reutilizar escenarios funcionales del Storybook de origen.
5. Ejecutar las pruebas de accesibilidad, navegación y regresión visual; no publicar como paridad terminada antes de pasar estos controles.

## Tokens Figma (22-10-2026)
- Importado el export CSS real, con primitivas y modos semánticos `base`/`avila`.
- Eliminada la paleta visual provisional (los dos CSS anteriores).
- Los componentes reutilizados funcionan con una capa de compatibilidad que referencia exclusivamente tokens Figma.
- Button ya consume variables semánticas Figma de forma directa.
- Stories incluyen selector de tema con Ávila como predeterminado.
- Pendiente: comprobación visual de fidelidad de cada componente y revisión de equivalencias de categorías (`secondary`→blue, `accent`→purple, `warning`→yellow) que no tienen alias homónimos en el export.
