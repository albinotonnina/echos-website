import { getSiteData } from "@/lib/content";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { TelegramDemo } from "@/components/telegram-demo";
import { VideoDemo } from "@/components/video-demo";
import { TerminalDemo } from "@/components/terminal-demo";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { InstallBlock } from "@/components/install-block";
import { Footer } from "@/components/footer";
import { InteractiveGrid } from "@/components/interactive-grid";

export default async function Home() {
  const data = await getSiteData();

  return (
    <>
      <InteractiveGrid />
      <div className="relative z-10">
        <Nav />
        <Hero version={data.version} />
        <TelegramDemo />
        <VideoDemo />
        <TerminalDemo />
        <Features features={data.features} />
        <HowItWorks interfaces={data.interfaces} plugins={data.plugins} />
        <InstallBlock methods={data.installMethods} />
        <Footer version={data.version} />
      </div>
    </>
  );
}
