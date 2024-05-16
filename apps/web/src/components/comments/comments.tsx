import { getCommentsById } from "@/data/comments/queries";
import { shortDate } from "@/utils/date";

type CommentsProps = {
  id: string;
};

export const Comments = async ({ id }: CommentsProps) => {
  const comments = await getCommentsById(id);

  return (
    <ul className="divide-y">
      {comments.map((comment) => (
        <li className="py-4" key={comment.id}>
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <h3 className="text-lg font-medium">{comment.user.name}</h3>
            <p className="text-sm text-muted-foreground">{shortDate(comment.createdAt)}</p>
          </div>
          <p>{comment.content}</p>
        </li>
      ))}
    </ul>
  );
};
