import type { Preview } from '@storybook/react-vite';
import '../src/index.css';
const preview: Preview = {
  initialGlobals: { theme: 'avila' },
  globalTypes: {
    theme: {
      description: 'Modo semántico exportado de Figma',
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'avila', title: 'Ávila' },
          { value: 'base', title: 'Base' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', context.globals.theme === 'base' ? 'base' : 'avila');
      }
      return Story();
    },
  ],
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /^(background|backgroundColor|.+Color)$/i, date: /Date$/i } },
    a11y: { test: 'todo' },
    docs: { toc: true },
  },
};
export default preview;
