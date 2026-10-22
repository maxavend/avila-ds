# Tokens — Ávila DS

## Fuente de verdad

El archivo `src/design-tokens/figma-tokens.css` reproduce el CSS exportado de Figma. Debe ser la **única fuente de valores de marca**: no introducir HEX, tipografías, radios o espaciados sustitutivos en componentes.

La colección Primitive define las escalas y Semantic define dos modos con `data-theme="base"` y `data-theme="avila"`. La toolbar de Storybook ofrece ambos; Ávila es el modo predeterminado.

### Ejemplo

```css
.card-action {
  background: var(--color-theme-background-primary);
  color: var(--color-neutral-text-contrast);
  border-radius: var(--radius-button);
  padding: var(--size-space-300);
}
.card-action:hover { background: var(--color-theme-background-hover); }
.card-action:active { background: var(--color-theme-background-pressed); }
```

En JSX/Tailwind 4 se puede usar `bg-(--color-theme-background-primary)` directamente.

## Compatibilidad con el código reutilizado

El DS original utilizaba nombres como `--color-primary-bg-default`. Esas variables eran de una marca anterior y **ya no se importan**. `legacy-utility-bridge.css` traduce sus utilidades Tailwind a alias semánticos del export de Figma y permite migrar los 32 componentes sin perder funcionalidad.

**Mapeos de categoría no literales** (por no existir tokens homónimos en la fuente):
- Primary → Theme (Valle en Ávila, Blue en Base).
- Secondary e Info → Blue.
- Accent → Purple.
- Success → Green.
- Warning → Yellow.
- Danger → Red.
- Surface → Neutral.

Estas equivalencias deben contrastarse visualmente con los nodos de cada componente en Figma antes de cerrar la paridad.

## Corrección necesaria del export

El export contiene declaraciones como `--typography-font-weight-medium: var(--typography-font-weight-medium)` dentro de Semantic. Son autoalias CSS circulares y anulan el peso válido del Primitive. Se mantiene intacto el export y se reestablecen los valores de Primitive mediante `export-corrections.css`, únicamente para los pesos regular/medium/semibold.

## Radios

El token semántico `--radius-full` **no coincide entre modos**: en Base referencia `--size-radius-full` y en Ávila `--size-radius-300`. No se modifica la entrada. Si se necesita una circunferencia (avatar o spinner), elegir explícitamente el primitivo `--size-radius-full`.

## Validación

`npm run check:tokens` protege nombres y valores críticos del export, ausencia de HEX en el adaptador y la existencia de todos los tokens Figma referenciados. `npm run build-storybook` y la revisión visual son comprobaciones complementarias, no sustitutos.
