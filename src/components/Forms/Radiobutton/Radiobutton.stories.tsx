import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radiobutton } from './Radiobutton';


const meta = {
  title: 'Components/Forms/Radiobutton',
  component: Radiobutton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: "Opción uno" },
} satisfies Meta<typeof Radiobutton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
