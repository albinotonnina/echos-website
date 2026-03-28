import { getSiteData } from "@/lib/content";
import { Nav } from "@/components/nav";
import { GridBackground } from "@/components/grid-background";
import { Hero } from "@/components/hero";
import { TelegramDemo } from "@/components/telegram-demo";
import { TerminalDemo } from "@/components/terminal-demo";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { InstallBlock } from "@/components/install-block";
import { Footer } from "@/components/footer";

export default async function Home() {
  const data = await getSiteData();

  return (
    <>
      <Nav />
      <GridBackground>
        <Hero version={data.version} />
        <TelegramDemo />
        <TerminalDemo />
      </GridBackground>
      <Features features={data.features} />
      <HowItWorks interfaces={data.interfaces} plugins={data.plugins} />
      <InstallBlock methods={data.installMethods} />
      <Footer version={data.version} />
    </>
  );
}
