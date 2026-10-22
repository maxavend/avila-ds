import type { Meta, StoryObj } from '@storybook/react-vite';
import { HelpText } from './HelpText';


const meta = {
  title: 'Components/Feedback/HelpText',
  component: HelpText,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: "Puedes editar esta información más adelante" },
} satisfies Meta<typeof HelpText>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
