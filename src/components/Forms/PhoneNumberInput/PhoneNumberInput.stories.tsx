import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhoneNumberInput } from './PhoneNumberInput';


const meta = {
  title: 'Components/Forms/PhoneNumberInput',
  component: PhoneNumberInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {  },
} satisfies Meta<typeof PhoneNumberInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
