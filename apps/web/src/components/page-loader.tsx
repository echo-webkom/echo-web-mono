import Image from "next/image";

const LoadingComponent = () => {
  return (
    <>
      <Image
        alt="Webkom Loader"
        src="/gif/webkom-loading.gif"
        height="65"
        width="140"
        className="mx-auto rounded-md"
      />
    </>
  );
};

export default LoadingComponent;
