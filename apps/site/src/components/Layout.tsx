import SideBar from "./SideBar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex h-screen w-full flex-col">{children}</div>
    </div>
  );
};

export default Layout;
