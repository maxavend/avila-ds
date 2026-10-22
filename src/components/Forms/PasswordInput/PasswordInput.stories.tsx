import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordInput } from './PasswordInput';

/** Implementación reutilizada y adaptada del código fuente, no un mock estático. */
const meta = {
  title: 'Components/Forms/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {"label": "Contraseña"},
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
