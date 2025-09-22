import NavigationBar from "@/components/NavigationBar";
import TabContainer from "@/components/TabContainer";
import { TabProvider } from "@/contexts/TabContext";

export default function Game() {
  return (
    <TabProvider>
      <main className="min-h-screen bg-background text-foreground ">
        <TabContainer />
        <NavigationBar />
      </main>
    </TabProvider>
  );
}
