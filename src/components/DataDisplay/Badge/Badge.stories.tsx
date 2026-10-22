import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

/** Implementación reutilizada y adaptada del código fuente, no un mock estático. */
const meta = {
  title: 'Components/DataDisplay/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {"label": "Activo"},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
