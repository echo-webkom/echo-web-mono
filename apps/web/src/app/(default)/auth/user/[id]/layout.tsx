export default async function ProfileLayout(props: LayoutProps<"/auth/user/[id]">) {
  const { children } = props;

  return (
    <div>
      <div className="absolute h-64 w-full bg-red-500 "></div>
      <div className="flex px-4 pt-5 sm:px-6 lg:px-8 flex-col items-center">

      {children}
      </div>
    </div>
  );
}
