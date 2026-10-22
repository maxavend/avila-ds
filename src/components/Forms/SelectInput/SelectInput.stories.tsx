import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectInput } from './SelectInput';


const meta = {
  title: 'Components/Forms/SelectInput',
  component: SelectInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: "País" },
} satisfies Meta<typeof SelectInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
