import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormattedExamText, normalizeExamText } from './textFormatter';

describe('formatação de texto', () => {
  it('normaliza espaços e resíduos conhecidos', () => expect(normalizeExamText('juriti-hífens  , rubrica')).toBe('juriti-hífens, rubrica'));
  it('renderiza marcação como elementos, não como HTML arbitrário', () => {
    const { container }=render(<FormattedExamText text={'**forte** <script>alert(1)</script> <u>alvo</u>'}/>);
    expect(screen.getByText('forte').tagName).toBe('STRONG');
    expect(container.querySelector('script')).toBeNull();
    expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument();
  });
});
