# Ávila Design System

React 19 · TypeScript strict · Tailwind CSS v4 · Storybook 10 · Vite 8.

## Ejecutar

```bash
npm install
npm run storybook
```

## Alcance y trazabilidad

Este repositorio usa como base el código funcional provisto por el autor. Solo se exponen componentes con correspondencia conceptual en [el Figma objetivo](https://www.figma.com/file/vJS4Ozok1qKFmRoBbtlNda); ver `docs/component-mapping.md`. Los recursos visuales corporativos, pantallas de negocio y datos mock del ZIP no están incluidos.

**Importante:** los tokens Primitive + Semantic ya se importaron íntegramente del export de Figma. La **fidelidad por componente** todavía necesita revisión visual y contraste de anatomía, variantes y estados; no presentar el catálogo como réplica perfecta antes de completarla. Ver `DESIGN.md` y `docs/tokens.md`.

## Verificación

```bash
npm run check:tokens
npm run typecheck
npm run test
npm run build-storybook
```

### Tokens Figma (Base / Ávila)

El tema usa las variables oficiales de `src/design-tokens/figma-tokens.css` y muestra `Ávila/Foundations/Tokens` en Storybook. El selector de la barra permite alternar entre los modos `base` y `avila`. Para componentes nuevos, usar las variables CSS semánticas directamente; las clases del sistema anterior pasan por un puente de compatibilidad sin HEX alternativos. Ver `docs/tokens.md`.

