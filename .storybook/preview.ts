import type { Preview } from '@storybook/react-vite';
import '../src/index.css';
const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /^(background|backgroundColor|.+Color)$/i, date: /Date$/i } },
    a11y: { test: 'todo' },
    docs: { toc: true },
  },
};
export default preview;
