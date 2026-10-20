import DeepField from "@/components/DeepField";
import Fleet from "@/components/Fleet";
import FlightPath from "@/components/FlightPath";
import FlightRules from "@/components/FlightRules";
import GroundControl from "@/components/GroundControl";
import Hero from "@/components/Hero";
import Missions from "@/components/Missions";
import Nav from "@/components/Nav";
import Origin from "@/components/Origin";
import StarChart from "@/components/StarChart";
import Trajectory from "@/components/Trajectory";
import Transmit from "@/components/Transmit";

export default function Page() {
  return (
    <>
      <Nav />
      <FlightPath />
      <main className="overflow-x-clip">
        <Hero />
        <Origin />
        <Trajectory />
        <Missions />
        <Fleet />
        <FlightRules />
        <DeepField />
        <StarChart />
        <GroundControl />
        <Transmit />
      </main>
    </>
  );
}
