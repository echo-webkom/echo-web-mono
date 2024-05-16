import { deleteCommentAction } from "@/actions/delete-comment";
import { getCommentsById } from "@/data/comments/queries";
import { getUser } from "@/lib/get-user";
import { shortDate } from "@/utils/date";
import { initials } from "@/utils/string";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type CommentsProps = {
  id: string;
};

export const Comments = async ({ id }: CommentsProps) => {
  const [user, comments] = await Promise.all([getUser(), getCommentsById(id)]);

  return (
    <ul className="divide-y">
      {comments.map((comment) => (
        <li className="flex gap-4 py-4" key={comment.id}>
          <Avatar className="h-14 w-14">
            <AvatarImage src={undefined} />
            <AvatarFallback>{initials(comment.user.name ?? "AB")}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <h3 className="text-lg font-medium">{comment.user.name}</h3>
              <p className="text-sm text-muted-foreground">{shortDate(comment.createdAt)}</p>
            </div>

            <p className="mb-1">{comment.content}</p>

            <div className="flex gap-4">
              <button className="text-sm text-muted-foreground">Svar</button>
              {user?.id === comment.user.id && (
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                <form action={deleteCommentAction}>
                  <input type="hidden" name="id" value={comment.id} />
                  <input type="hidden" name="postId" value={id} />
                  <button type="submit" className="text-sm text-muted-foreground">
                    Slett
                  </button>
                </form>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
