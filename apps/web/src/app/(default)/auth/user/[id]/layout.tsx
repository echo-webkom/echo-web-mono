export default async function ProfileLayout(props: LayoutProps<"/auth/user/[id]">) {
  const { children } = props;

  return <div className="px-4 pt-5 sm:px-6 lg:px-8">{children}</div>;
}
