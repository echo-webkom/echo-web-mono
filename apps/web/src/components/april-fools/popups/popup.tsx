import Image from "next/image";

type PopupProps = {
  imgUrl: string;
  children: React.ReactNode;
};

export default function Popup({ children, imgUrl }: PopupProps) {
  return (
    <>
      <div>
        <Image src={imgUrl} alt={""}></Image>
      </div>
    </>
  );
}
