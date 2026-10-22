import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from './TextInput';

/** Implementación reutilizada y adaptada del código fuente, no un mock estático. */
const meta = {
  title: 'Components/Forms/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {"label": "Correo electrónico", "placeholder": "nombre@ejemplo.com"},
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
