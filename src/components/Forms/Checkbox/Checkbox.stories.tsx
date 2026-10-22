import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

/** Implementación reutilizada y adaptada del código fuente, no un mock estático. */
const meta = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {"label": "Acepto las condiciones"},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
