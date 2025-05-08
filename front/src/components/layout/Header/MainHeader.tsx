import Icon from "@/components/ui/Icons";
import { SearchBar } from "@/components/ui/Searchbar";

const MainHeader = () => {
  return (
    <nav className="flex flex-row gap-[50px] w-full p-2.5 border-b border-[var(--black-400)]">
      <div className="w-[245px]">
        <Icon name="logo_text" size={38} />
      </div>
      <SearchBar className="max-w-[650px]" />
    </nav>
  );
};

export default MainHeader;
