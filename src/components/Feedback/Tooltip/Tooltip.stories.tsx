import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';


const meta = {
  title: 'Components/Feedback/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { open: true, title: "Información", bodyText: "Puedes consultar más detalles aquí" },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
