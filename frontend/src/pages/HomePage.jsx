import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary font-sans animate-fadeIn">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-6 px-8 md:px-16">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="DevLoop Logo" className="h-10" />
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="nav-link font-medium">Entrar</Link>
          <Link to="/register" className="btn btn-primary">Registrar-se</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display leading-tight">
            <span className="text-primary">Conecte</span> com mentores,
            <br />
            <span className="text-secondary">Evolua</span> sua carreira
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-text-secondary max-w-2xl mx-auto">
            Descubra uma nova forma de crescer profissionalmente com a plataforma que conecta mentores e mentees de forma simples e eficiente.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link to="/register" className="btn btn-accent text-lg px-8 py-4">
              Comece agora
            </Link>
            <Link to="/mentors" className="btn btn-secondary text-lg px-8 py-4">
              Explorar mentores
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-offwhite py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display">
            Como funciona a <span className="text-primary">DevLoop</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card border-l-4 border-primary animate-slideUp">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Encontre seu mentor</h3>
              <p className="text-text-secondary">
                Busque mentores especializados na sua área de interesse e filtre por habilidades, experiência e disponibilidade.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card border-l-4 border-secondary animate-slideUp" style={{animationDelay: "0.1s"}}>
              <div className="h-12 w-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Agende sessões</h3>
              <p className="text-text-secondary">
                Marque sessões de mentoria de acordo com a disponibilidade do mentor e receba lembretes automáticos.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card border-l-4 border-accent animate-slideUp" style={{animationDelay: "0.2s"}}>
              <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Evolua sua carreira</h3>
              <p className="text-text-secondary">
                Receba orientação personalizada, desenvolva novas habilidades e alcance seus objetivos profissionais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display">
            O que dizem nossos <span className="text-primary">usuários</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="card">
              <div className="flex items-start mb-4">
                <div className="h-12 w-12 bg-primary rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Ana Silva</h4>
                  <p className="text-text-muted">Desenvolvedora Frontend</p>
                </div>
              </div>
              <p className="text-text-secondary italic">
                "Encontrei um mentor incrível que me ajudou a melhorar minhas habilidades em React e consegui uma promoção em apenas 3 meses. A plataforma é intuitiva e fácil de usar!"
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="card">
              <div className="flex items-start mb-4">
                <div className="h-12 w-12 bg-secondary rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Carlos Mendes</h4>
                  <p className="text-text-muted">Tech Lead</p>
                </div>
              </div>
              <p className="text-text-secondary italic">
                "Como mentor, a DevLoop me permite compartilhar conhecimento e ajudar outros desenvolvedores. A plataforma facilita o gerenciamento de sessões e disponibilidade."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display">
            Pronto para impulsionar sua carreira?
          </h2>
          <p className="text-xl mb-8 text-text-secondary">
            Junte-se a milhares de profissionais que estão evoluindo através de mentorias personalizadas.
          </p>
          <Link to="/register" className="btn btn-primary text-lg px-10 py-4">
            Criar conta gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-offwhite py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <img src="/logo.svg" alt="DevLoop Logo" className="h-10 mb-4 brightness-200" />
            <p className="text-text-muted">
              Conectando mentores e mentees para impulsionar carreiras na tecnologia.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li><Link to="/mentors" className="text-text-muted hover:text-offwhite transition">Encontrar mentores</Link></li>
              <li><Link to="/register" className="text-text-muted hover:text-offwhite transition">Tornar-se mentor</Link></li>
              <li><Link to="/sessions" className="text-text-muted hover:text-offwhite transition">Como funciona</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-muted hover:text-offwhite transition">Blog</a></li>
              <li><a href="#" className="text-text-muted hover:text-offwhite transition">FAQ</a></li>
              <li><a href="#" className="text-text-muted hover:text-offwhite transition">Comunidade</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Contato</h4>
            <ul className="space-y-2">
              <li><a href="mailto:contato@devloop.com" className="text-text-muted hover:text-offwhite transition">contato@devloop.com</a></li>
              <li><a href="#" className="text-text-muted hover:text-offwhite transition">Suporte</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-700 text-center text-text-muted">
          <p>© 2025 DevLoop. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
