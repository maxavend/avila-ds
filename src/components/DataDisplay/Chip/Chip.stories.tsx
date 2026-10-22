import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';

/** Implementación reutilizada y adaptada del código fuente, no un mock estático. */
const meta = {
  title: 'Components/DataDisplay/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {"label": "Seleccionado"},
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
