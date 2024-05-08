import { Container } from "@/components/container";
import { HyggkomShoppingForm } from "@/components/hyggkom-shopping-form";
import { HyggkomShoppingList } from "@/components/hyggkom-shopping-list";
import { getAllShoppinglistItems } from "@/data/shopping-list-item/queries";
import { getUser } from "@/lib/get-user";
import { isMemberOf } from "@/lib/memberships";

export default async function HyggkomHandleliste() {
  const [user, items] = await Promise.all([getUser(), getAllShoppinglistItems()]);

  const mappedItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    user: item.user.name,
    likes: item.likes.length,
    hasLiked: item.likes.some((like) => (user?.id ? like.userId === user.id : false)),
  }));

  const isAdmin = (user && isMemberOf(user, ["webkom", "hyggkom"])) ?? false;

  return (
    <Container className="max-w-5xl py-10">
      <h1 className="bold py-3 text-4xl">Hyggkoms handleliste</h1>
      <div className="py-5">
        <h1 className="py-3 text-xl">
          Like de tingene du mener vi bør kjøpe inn, eller legg til ditt eget forslag under!
        </h1>
        <HyggkomShoppingList items={mappedItems} isAdmin={isAdmin} withDots={false} />
      </div>
      <HyggkomShoppingForm />
    </Container>
  );
}
