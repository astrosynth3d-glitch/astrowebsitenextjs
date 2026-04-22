import Navigation from './Pages/navigation';
import HomeContent from './Pages/home'; 
import AboutMe from './Pages/aboutme';
import Portfolio from './Pages/Portfolio';
import Contact from './Pages/contact';

export default function Home() {
  return (
    <main>
      <Navigation />
      
      <section id="home">
        <HomeContent />
      </section>

      <section id="about">
        <AboutMe />
      </section>
      
      <section id="portfolio">
        <Portfolio />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}