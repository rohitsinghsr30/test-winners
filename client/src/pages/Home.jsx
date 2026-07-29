import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import PrizePool from "../components/home/PrizePool";
import TopWinners from "../components/home/TopWinners";
import Categories from "../components/home/Categories";
import Features from "../components/home/Features";
import Testimonials from "../components/home/Testimonials";
import Faq from "../components/home/Faq";
import LiveContest from "../components/home/LiveContest";
function Home() {
  return (
    <>

      <Hero />
      <LiveContest />
      <Stats />
      <Categories />
      <PrizePool />
      <TopWinners />
      <Features />
      <Testimonials />
      <Faq />
    </>
  );
}

export default Home;