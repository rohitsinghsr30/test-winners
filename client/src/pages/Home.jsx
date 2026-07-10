import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import PrizePool from "../components/PrizePool";
import TopWinners from "../components/TopWinners";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <PrizePool />
      <TopWinners />
      <Footer />
    </>
  );
}

export default Home;