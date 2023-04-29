// https://github.com/t3-oss/t3-env/blob/main/docs/src/components/tailwind-indicator.tsx
const TailwindIndicator = () => {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-2 left-2 z-50 flex h-8 w-8 items-center justify-center rounded bg-primary p-3 font-mono text-white">
      <p className="block sm:hidden">xs</p>
      <p className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">sm</p>
      <p className="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</p>
      <p className="hidden lg:block xl:hidden 2xl:hidden">lg</p>
      <p className="hidden xl:block 2xl:hidden">xl</p>
      <p className="hidden 2xl:block">2xl</p>
    </div>
  );
};

export default TailwindIndicator;
