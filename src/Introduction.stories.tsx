import type { Meta, StoryObj } from '@storybook/react-vite';

const Introduction = () => (
  <main style={{ maxWidth: 780, padding: 'var(--size-space-800) var(--size-space-300)', fontFamily: 'var(--typography-family-font-family-font)', lineHeight: 1.6 }}>
    <p style={{ textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: 'var(--typography-font-size-xs)', fontWeight: 'var(--typography-font-weight-bold)', color: 'var(--color-theme-text-primary)' }}>Ávila · Design System</p>
    <h1 style={{ fontSize: 'var(--typography-font-size-4xl)', lineHeight: 'var(--typography-line-height-900)', margin: 'var(--size-space-300) 0 var(--size-space-600)' }}>Diseño consistente, código reutilizable.</h1>
    <p>Ávila es una biblioteca personal de componentes React documentada en Storybook. Esta rama conserva la arquitectura técnica y la lógica de los componentes seleccionados desde un Design System existente.</p>
    <p>El catálogo corresponde provisionalmente con las páginas del <a href="https://www.figma.com/file/vJS4Ozok1qKFmRoBbtlNda" target="_blank" rel="noreferrer">Figma de referencia</a>. Los design tokens ya provienen del export CSS real de Figma: puedes alternar los modos Base y Ávila desde la toolbar. Queda pendiente revisar la fidelidad visual de cada componente.</p>
    <p>Comienza por <strong>Ávila / Foundations / Tokens</strong> y luego <strong>Components / Actions / Button</strong> para probar variantes, tamaños y estados reales.</p>
  </main>
);

const meta = {
  title: 'Ávila/Introducción',
  component: Introduction,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
} satisfies Meta<typeof Introduction>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Bienvenida: Story = {};
