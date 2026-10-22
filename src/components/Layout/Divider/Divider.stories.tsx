import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

/** Implementación reutilizada y adaptada del código fuente, no un mock estático. */
const meta = {
  title: 'Components/Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {},
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
