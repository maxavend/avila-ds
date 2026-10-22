import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomNavbar } from './BottomNavbar';
import { Home, Search, UserRound } from "lucide-react";

const meta = {
  title: 'Components/Navigation/BottomNavbar',
  component: BottomNavbar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { items: [{ id: "inicio", label: "Inicio", icon: <Home size={20} /> }, { id: "buscar", label: "Buscar", icon: <Search size={20} /> }, { id: "cuenta", label: "Cuenta", icon: <UserRound size={20} /> }] },
} satisfies Meta<typeof BottomNavbar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
