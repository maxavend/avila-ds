import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';


const meta = {
  title: 'Components/DataDisplay/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: "Tipografía de interfaz para textos legibles y consistentes." },
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
