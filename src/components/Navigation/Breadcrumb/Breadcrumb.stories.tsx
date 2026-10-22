import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './Breadcrumb';


const meta = {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { items: [{ label: "Inicio", href: "#" }, { label: "Biblioteca", href: "#" }, { label: "Botones", isActive: true }] },
} satisfies Meta<typeof Breadcrumb>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
