import type { Meta, StoryObj } from '@storybook/react-vite';

const swatches = [
  { title: 'Theme / Primary', token: '--color-theme-background-primary' },
  { title: 'Theme / Hover', token: '--color-theme-background-hover' },
  { title: 'Theme / Pressed', token: '--color-theme-background-pressed' },
  { title: 'Theme / Soft', token: '--color-theme-background-soft' },
  { title: 'Neutral / Base', token: '--color-neutral-background-base' },
  { title: 'Neutral / Contrast', token: '--color-neutral-background-contrast' },
  { title: 'Blue / Default', token: '--color-blue-background-default' },
  { title: 'Success', token: '--color-green-background-default' },
  { title: 'Warning', token: '--color-yellow-background-default' },
  { title: 'Danger', token: '--color-red-background-default' },
  { title: 'Accent', token: '--color-purple-background-default' },
] as const;

const radii = [
  { label: 'Button', token: '--radius-button' },
  { label: 'Input', token: '--radius-input' },
  { label: 'Box', token: '--radius-box' },
  { label: 'Full (semántico)', token: '--radius-full' },
  { label: 'Circular (primitivo)', token: '--size-radius-full' },
] as const;

const TokenGallery = () => (
  <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px', color: 'var(--color-neutral-text-strong)', fontFamily: 'var(--typography-family-font-family-font)' }}>
    <p style={{ color: 'var(--color-theme-text-primary)', fontSize: 'var(--typography-font-size-xs)', fontWeight: 600, letterSpacing: '0.1em' }}>ÁVILA · FOUNDATIONS</p>
    <h1 style={{ fontSize: 'var(--typography-font-size-4xl)', lineHeight: 'var(--typography-line-height-900)', margin: '12px 0 16px' }}>Design tokens</h1>
    <p style={{ color: 'var(--color-neutral-text-default)', marginBottom: 32 }}>Variables importadas desde Figma. Usa el selector de temas de Storybook para alternar entre Base y Ávila.</p>
    <h2 style={{ fontSize: 'var(--typography-font-size-2xl)', margin: '0 0 16px' }}>Colores semánticos</h2>
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--size-space-400)' }}>
      {swatches.map(({ title, token }) => (
        <div key={token} style={{ border: '1px solid var(--color-neutral-border-soft)', borderRadius: 'var(--radius-box)', overflow: 'hidden', backgroundColor: 'var(--color-neutral-background-base)' }}>
          <div aria-hidden="true" style={{ backgroundColor: `var(${token})`, height: 100 }} />
          <div style={{ padding: 'var(--size-space-300)' }}>
            <strong style={{ fontSize: 'var(--typography-font-size-xs)' }}>{title}</strong>
            <code style={{ display: 'block', fontSize: '10px', overflowWrap: 'anywhere', color: 'var(--color-neutral-text-soft)', marginTop: 6 }}>{token}</code>
          </div>
        </div>
      ))}
    </section>
    <h2 style={{ fontSize: 'var(--typography-font-size-2xl)', margin: '40px 0 16px' }}>Radios</h2>
    <section style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--size-space-400)' }}>
      {radii.map(({ label, token }) => (
        <div key={token} style={{ display: 'grid', justifyItems: 'center', gap: 8, width: 144 }}>
          <div aria-hidden="true" style={{ width: 72, height: 72, backgroundColor: 'var(--color-theme-background-soft)', border: '2px solid var(--color-theme-border-primary)', borderRadius: `var(${token})` }} />
          <span style={{ fontSize: 'var(--typography-font-size-xs)' }}>{label}</span>
          <code style={{ fontSize: 10, textAlign: 'center', overflowWrap: 'anywhere' }}>{token}</code>
        </div>
      ))}
    </section>
  </main>
);

const meta = {
  title: 'Ávila/Foundations/Tokens',
  component: TokenGallery,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof TokenGallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const PaletaYRadios: Story = {};
