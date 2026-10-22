import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';
import { TabItem } from "./Atoms/TabItem";

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { defaultValue: "primero", children: <><TabItem label="General" value="primero" /><TabItem label="Detalle" value="segundo" /><TabItem label="Historial" value="tercero" /></> },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
