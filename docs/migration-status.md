# Estado de implementación

- Catálogo Figma observado: **38** tipos/páginas (sin familias de assets).
- Equivalencias preliminares con implementación existente: **32**.
- Código runtime reutilizado: **52** archivos fuente TypeScript/TSX, contando dependencias internas.
- Nuevas stories de integración: **32**.
- Tokens de Figma **integrados** desde el export proporcionado: Primitive y Semantic (Base y Ávila).
- Verificación CI de GitHub: `check:tokens`, `typecheck`, `test` y `build-storybook` completados correctamente el 22-10-2026 en el PR #2.

## Pendiente para fidelidad visual

1. Validar anatomía, medidas y estados de los componentes Figma contra Storybook mediante comparación visual.
2. Extraer **solo los estilos o propiedades adicionales** que no figuran en el export CSS (por ejemplo, composiciones de sombras e iconos).
3. Migrar progresivamente las clases heredadas a nombres semánticos canónicos.
4. Revisar las stories seleccionadas de los componentes complejos con escenarios funcionales.
5. Ejecutar pruebas de accesibilidad y regresión visual; no publicar como paridad completa antes de pasar esos controles.

## Tokens Figma (22-10-2026)
- Importado el export CSS real, con primitivas y modos semánticos `base`/`avila`.
- Eliminada la paleta visual provisional (los dos CSS anteriores).
- Los componentes reutilizados funcionan con una capa de compatibilidad que referencia exclusivamente tokens Figma.
- Button ya consume variables semánticas Figma de forma directa.
- Stories incluyen selector de tema con Ávila como predeterminado.
- Pendiente: comprobación visual de fidelidad de cada componente y revisión de equivalencias de categorías (`secondary`→blue, `accent`→purple, `warning`→yellow) que no tienen alias homónimos en el export.
