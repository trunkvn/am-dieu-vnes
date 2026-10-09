import { SceneNav } from "@/app/_components/SceneNav/SceneNav";
import { Sheet } from "@/app/_components/Sheet/Sheet";
import { SCENES } from "@/app/_lib/scenes";
import { Footer } from "@/app/_components/Footer/Footer";
import { Cover } from "./_sections/Cover/Cover";
import { DrawVoice } from "./_sections/DrawVoice/DrawVoice";
import { ListenChoose } from "./_sections/ListenChoose/ListenChoose";
import { Opening } from "./_sections/Opening/Opening";
import { SayBack } from "./_sections/SayBack/SayBack";
import { SixTones } from "./_sections/SixTones/SixTones";
import { WhatIsATone } from "./_sections/WhatIsATone/WhatIsATone";

export default function Home() {
  return (
    <>
      <SceneNav scenes={SCENES} />
      <Sheet>
        <Cover />
        <Opening />
        <WhatIsATone />
        <SixTones />
        <DrawVoice />
        <SayBack />
        <ListenChoose />
      </Sheet>
      <Footer />
    </>
  );
}
