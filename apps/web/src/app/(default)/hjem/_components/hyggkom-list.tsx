import { HyggkomShoppingList } from "@/components/hyggkom-shopping-list";
import { getAllShoppinglistItems } from "@/data/shopping-list-item/queries";
import { getUser } from "@/lib/get-user";
import { BentoBox } from "./bento-box";

export const HyggkomList = async ({ className }: { className?: string }) => {
  const [user, items] = await Promise.all([getUser(), getAllShoppinglistItems()]);

  if (!items.length) {
    return null;
  }

  const withDots = items.length > 5;

  const mappedItems = items
    .map((item) => ({
      id: item.id,
      name: item.name,
      user: null,
      likes: item.likes.length,
      hasLiked: item.likes.some((like) => user?.id && like.userId === user.id),
    }))
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);

  const isAdmin = false;

  return (
    <BentoBox title="Hyggkom Handleliste" href="/for-studenter/handleliste" className={className}>
      <HyggkomShoppingList items={mappedItems} isAdmin={isAdmin} withDots={withDots} />
    </BentoBox>
  );
};
