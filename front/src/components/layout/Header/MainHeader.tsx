import Icon from "@/components/ui/Icons";
import { SearchBar } from "@/components/ui/Searchbar";
import Search from "@/features/search/components/Search";

const MainHeader = () => {
  return (
    <nav className="z-50 flex flex-row gap-[50px] sticky top-0 w-full p-2.5 border-b bg-[var(--black-800)] border-[var(--black-400)]">
      <div className="w-[245px]">
        <Icon name="logo_text" size={38} />
      </div>
      <Search />
      <SearchBar className="max-w-[650px]" />
    </nav>
  );
};

export default MainHeader;
