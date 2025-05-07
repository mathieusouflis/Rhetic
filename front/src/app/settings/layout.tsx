import { SettingsSidebar } from "@/components/layout/Sidebar/SettingsSidebar";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { SETTINGS_NAV_ITEMS } from "@/config/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SettingsSidebar items={SETTINGS_NAV_ITEMS} />
      <main className="flex-1 px-[50px] py-4">{children}</main>
    </div>
  );
}
