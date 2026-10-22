import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from './Image';


const meta = {
  title: 'Components/DataDisplay/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { isFilled: false, alt: "Imagen de muestra" },
} satisfies Meta<typeof Image>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
