import { type UnoReturnType, type User } from "../../../../../../api/uno/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../../components/ui/dialog";
import { UserForm } from "../../../../../../components/user-form";
import { ProfilePicture } from "./profile-picture";

type EditProfileDialogProps = {
  user: User;
  degrees: UnoReturnType["degrees"]["all"];
};

export function EditProfileDialog({ user, degrees }: EditProfileDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className="text-primary border-transparent text-left underline-offset-4 hover:underline">
        Rediger bruker
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rediger bruker</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <ProfilePicture
            userId={user.id}
            name={user.name ?? "Fant ikke brukernavn  "}
            hasImage={user.hasImage}
            edit
          />
          <UserForm
            user={{
              id: user.id,
              degree: user.degree ?? undefined,
              year: user.year ?? undefined,
              alternativeEmail: user.alternativeEmail ?? undefined,
              alternativeEmailVerifiedAt: user.alternativeEmailVerifiedAt ?? undefined,
              hasReadTerms: user.hasReadTerms,
              isPublic: user.isPublic,
              birthday: user.birthday ?? undefined,
            }}
            degrees={degrees}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
