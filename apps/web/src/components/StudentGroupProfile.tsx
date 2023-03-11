export interface StudentGroupProfileProps {
  name: string;
  imageUrl: string;
  role: string;
}

export const StudentGroupProfile = ({name, imageUrl, role}: StudentGroupProfileProps) => {
  const _imageUrl = imageUrl;

  return (
    <div>
      <p>{name}</p>
      <p>{role}</p>
    </div>
  );
};
