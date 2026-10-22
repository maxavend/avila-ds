import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeyButton } from './KeyButton';


const meta = {
  title: 'Components/Actions/KeyButton',
  component: KeyButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: "Explorar", icon: "LayoutGrid" },
} satisfies Meta<typeof KeyButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
