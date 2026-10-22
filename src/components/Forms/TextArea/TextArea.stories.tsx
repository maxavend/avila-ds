import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from './TextArea';

/** Implementación reutilizada y adaptada del código fuente, no un mock estático. */
const meta = {
  title: 'Components/Forms/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {"label": "Descripción"},
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
