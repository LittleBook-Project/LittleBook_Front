import { Layout } from "./components/Layout";
import { HeroSection } from "./components/HeroSection";
import { BookCard } from "./components/BookCard";
import './App.css'

function App() {
  return (
    <Layout>
      <HeroSection />
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <BookCard
          id="1"
          title="Le Petit Prince"
          author="Antoine de Saint-Exupéry"
          coverImage="/src/assets/react.svg"
          rating={4}
          category="Classique"
          review="Un conte poétique et philosophique"
          likes={120}
          comments={24}
        />
      </div>
    </Layout>
  )
}

export default App
