import "./Home.css";

import Hero from "../../components/Hero/Hero";
import ConfessionCarousel from "../../components/ConfessionCarousel/ConfessionCarousel";
import Stats from "../../components/Stats/Stats";
import ConfidentialClub from "../../components/confidentialClub/ConfidentialClub";

const Home = () => {
  return (
    <main className="home">
      <Hero />

      <ConfessionCarousel />

      <Stats />

      <ConfidentialClub />
    </main>
  );
};

export default Home;