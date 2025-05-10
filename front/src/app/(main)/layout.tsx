import MainHeader from "@/components/layout/Header/MainHeader";
import { Rhetics } from "@/components/layout/Right Assides/Rhetics";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { MAIN_NAV_ITEMS } from "@/config/navigation";

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
        <main className="flex-1 flex flex-row gap-2.5 justify-between px-[50px] py-4">
          <div className="flex-1 max-w-[700px]">{children}</div>
          <Rhetics />
        </main>
      </div>
    </>
  );
}
