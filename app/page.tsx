import { SceneNav } from "@/app/_components/SceneNav/SceneNav";
import { Sheet } from "@/app/_components/Sheet/Sheet";
import { SCENES } from "@/app/_lib/scenes";
import { Footer } from "@/app/_components/Footer/Footer";
import { Cover } from "./_sections/Cover/Cover";
import { Opening } from "./_sections/Opening/Opening";

export default function Home() {
  return (
    <>
      <SceneNav scenes={SCENES} />
      <Sheet>
        <Cover />
        <Opening />
      </Sheet>
      <Footer />
    </>
  );
}
