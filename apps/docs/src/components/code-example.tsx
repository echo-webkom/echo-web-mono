type CodeExampleProps = {
  children: React.ReactNode;
};

export function CodeExample({ children }: CodeExampleProps) {
  return (
    <div className="overflow-hidden rounded-xl">
      <div className="bg-gray-200 p-3 dark:bg-gray-700">
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
          <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <div className="bg-[#f4f7fc] p-3 dark:bg-[#1e282f]">{children}</div>
    </div>
  );
}
