import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from './Button';

describe('Button — API de Ávila', () => {
  for (const variant of ['Primary', 'Secondary', 'Tertiary', 'Destructive'] as const) {
    it(`renderiza ${variant}`, () => {
      const html = renderToStaticMarkup(<Button variant={variant} label="Continuar" />);
      expect(html).toContain('Continuar');
    });
  }
  it('deshabilita el botón durante la carga y comunica aria-busy', () => {
    const html = renderToStaticMarkup(<Button label="Guardar" loading />);
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-busy="true"');
  });
  it('respeta los tamaños verificados de Figma', () => {
    expect(renderToStaticMarkup(<Button size="L" label="L" />)).toContain('h-[52px]');
    expect(renderToStaticMarkup(<Button size="M" label="M" />)).toContain('h-11');
    expect(renderToStaticMarkup(<Button size="S" label="S" />)).toContain('h-8');
  });
});
