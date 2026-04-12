// 1. Capitalize 'Home' to match React component naming conventions
// 2. Ensure the path points correctly to your Pages folder
import Navigation from './Pages/navigation' ; // Adjust path if necessary
import HomeContent from './Pages/home'; 
import AboutMe from './Pages/aboutme';
import Portfolio from './Pages/Portfolio';
import Contact from './Pages/contact';

export default function Home() {
  return (
    <main>
      <Navigation />
      {/* 1. Added ID for the top of the page */}
      <section id="home">
        <HomeContent />
      </section>

      {/* 2. Added ID for the About Me section */}
      <section id="about">
        <AboutMe />
      </section>
      
      {/* 3. Portfolio placeholder (add ID if you have a component) */}
      <section id="portfolio">
        <Portfolio />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}