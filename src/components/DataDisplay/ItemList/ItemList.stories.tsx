import type { Meta, StoryObj } from '@storybook/react-vite';
import { ItemList } from './ItemList';


const meta = {
  title: 'Components/DataDisplay/ItemList',
  component: ItemList,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { title: "Preferencias de usuario", bodyText: "Configura cómo quieres recibir notificaciones" },
} satisfies Meta<typeof ItemList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
