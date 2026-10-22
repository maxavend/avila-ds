import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';

/** Implementación reutilizada y adaptada del código fuente, no un mock estático. */
const meta = {
  title: 'Components/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {"mainText": "Cambios guardados", "supportingText": "La configuración se actualizó"},
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
