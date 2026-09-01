import React from 'react';

interface State { failed: boolean }

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State { return { failed: true }; }

  componentDidCatch(error: unknown): void {
    console.error('Falha não recuperada na interface do ConjuLetter.', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--theme-bg)] p-6 text-[var(--theme-text)]">
        <section className="max-w-md rounded-2xl bg-[var(--theme-surface)] p-6 text-center shadow-xl" role="alert">
          <h1 className="text-lg font-semibold">Não foi possível abrir esta área</h1>
          <p className="mt-2 text-sm text-[var(--theme-text-muted)]">Seus dados locais foram preservados. Recarregue a aplicação para voltar à Home.</p>
          <button className="mt-5 rounded-xl bg-[var(--theme-accent)] px-5 py-2.5 text-sm font-semibold" onClick={() => window.location.assign('/')}>Voltar à Home</button>
        </section>
      </main>
    );
  }
}
