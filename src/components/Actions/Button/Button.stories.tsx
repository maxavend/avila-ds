import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

/** Implementación reutilizada y adaptada del código fuente, no un mock estático. */
const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {"label": "Continuar", "variant": "Primary", "size": "L"},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};

export const FigmaMatrix: Story = {
  name: 'Matriz inicial · tamaños y estados',
  render: () => (
    <div style={{display: 'grid',gap: 24}}>
      {(['Primary', 'Secondary', 'Tertiary', 'Destructive'] as const).map(variant => (
        <section key={variant} style={{display:'grid',gap:10}}>
          <h3 style={{fontWeight:650}}>{variant}</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:12,alignItems:'center'}}>
            {(['L','M','S'] as const).map(size => (
              <div key={size} style={{display:'grid',gap:10}}>
                <Button variant={variant} size={size} label={`${size} · Default`} />
                <Button variant={variant} size={size} label={`${size} · Disabled`} disabled />
                <Button variant={variant} size={size} label={`${size} · Loading`} loading />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
