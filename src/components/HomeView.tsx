import React from 'react';
import { ExternalLink } from 'lucide-react';

/** A quiet, informational landing page kept intentionally free of card clutter. */
export const HomeView: React.FC = () => {
  return (
    <div className="home-page mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="alexandria-home-sky" aria-hidden="true">
        <img className="alexandria-philosopher" src="/alexandria/philosopher.png" alt="" />
        <img className="alexandria-muse" src="/alexandria/muse.png" alt="" />
      </div>
      <header className="home-title-block">
        <h1 className="home-hero-title">A Nova Alexandria</h1>
      </header>

      <section className="home-section home-about" aria-labelledby="home-about-title">
        <p id="home-about-title" className="home-section-kicker">Sobre o projeto</p>
        <div className="home-card-copy">
          <p>
            O <strong>ConjuLetter</strong> nasceu como uma ferramenta aberta para resolver uma dor comum a todo estudante: o atrito de praticar por PDFs longos, pesados e difíceis de navegar, que tornam a resolução e a correção lentas.
          </p>
          <p>
            Reunimos provas reais de bancas oficiais em um ambiente limpo, direto e intuitivo. Nosso acervo não utiliza materiais de cursinhos ou questões autorais de professores — apenas provas de bancas públicas que autorizam o uso para fins educacionais.
          </p>
          <p>
            Além do acervo integrado, você pode importar seus próprios PDFs: o algoritmo apenas processa a estrutura do arquivo, ajusta a diagramação e transforma cada exercício em um bloco interativo e filtrável, poupando seu tempo na montagem dos cadernos de estudo.
          </p>
        </div>
      </section>

      <a
        className="home-section home-vocablab"
        href="https://vocablab-revolution.vercel.app/"
        target="_blank"
        rel="noreferrer"
        aria-labelledby="vocablab-title"
      >
        <div className="home-section-heading">
          <div>
            <p className="home-section-kicker">Outro projeto</p>
            <h2 id="vocablab-title">VocabLab</h2>
          </div>
        </div>
        <p className="home-vocablab-copy">
          Uma ferramenta de código aberto para memorizar palavras em inglês, praticar vocabulário, regência e leitura — uma alternativa aprimorada ao Quizlet.
        </p>
        <span className="home-vocablab-link">
          Conhecer o VocabLab
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </a>
    </div>
  );
};
