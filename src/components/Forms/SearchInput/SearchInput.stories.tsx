import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchInput } from './SearchInput';

/** Implementación reutilizada y adaptada del código fuente, no un mock estático. */
const meta = {
  title: 'Components/Forms/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {"placeholder": "Buscar"},
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
