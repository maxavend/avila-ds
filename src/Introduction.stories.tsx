import type { Meta, StoryObj } from '@storybook/react-vite';

const Introduction = () => (
  <main style={{ maxWidth: 780, padding: '32px 12px', fontFamily: 'inherit', lineHeight: 1.6 }}>
    <p style={{ textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: 12, fontWeight: 700 }}>Ávila · Design System</p>
    <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.08, margin: '10px 0 24px' }}>Diseño consistente, código reutilizable.</h1>
    <p>Ávila es una biblioteca personal de componentes React documentada en Storybook. Esta rama conserva la arquitectura técnica y la lógica de los componentes seleccionados desde un Design System existente.</p>
    <p>El catálogo corresponde provisionalmente con las páginas del <a href="https://www.figma.com/file/vJS4Ozok1qKFmRoBbtlNda" target="_blank" rel="noreferrer">Figma de referencia</a>. Los valores visuales aún deben extraerse y validarse; el tema actual es de integración, no de paridad final.</p>
    <p>Comienza por <strong>Components / Actions / Button</strong> para probar variantes, tamaños y estados reales.</p>
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
