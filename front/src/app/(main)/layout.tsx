import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import Icon from "@/components/ui/Icons";
import { SearchBar } from "@/components/ui/Searchbar";
import { MAIN_NAV_ITEMS } from "@/config/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="flex flex-row gap-[50px] w-full p-2.5">
        <div className="w-[245px]">
          <Icon name="logo_text" size={38} />
        </div>
        <SearchBar className="max-w-[650px]" />
      </nav>
      <div className="flex">
        <Sidebar items={MAIN_NAV_ITEMS} />
        <main className="flex-1 justify-between px-[50px] py-4">
          <div className="flex-1 max-w-[650px]">{children}</div>
        </main>
      </div>
    </>
  );
}
