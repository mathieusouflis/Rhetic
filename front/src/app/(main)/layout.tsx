import MainHeader from "@/components/layout/Header/MainHeader";
import { Rhetics } from "@/components/layout/Right Assides/Rhetics";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import Icon from "@/components/ui/Icons";
import { SearchBar } from "@/components/ui/Searchbar";
import { MAIN_NAV_ITEMS } from "@/config/navigation";
import { ToastManager } from "@/components/layout/ToastManager";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      <div className="flex">
        <Sidebar items={MAIN_NAV_ITEMS} />
        <main className="flex-1 justify-between px-[50px] py-4">
          <div className="flex-1 max-w-[650px]">{children}</div>
        </main>
        <Rhetics />
      </div>
      
      <ToastManager />
    </>
  );
}