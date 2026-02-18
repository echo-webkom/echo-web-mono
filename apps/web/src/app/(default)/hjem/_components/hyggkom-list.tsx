import { auth } from "@/auth/session";
import { HyggkomShoppingList } from "@/components/hyggkom-shopping-list";
import { unoWithAdmin } from "../../../../api/server";
import { BentoBox } from "./bento-box";

export const HyggkomList = async ({ className }: { className?: string }) => {
  const [user, items] = await Promise.all([auth(), unoWithAdmin.shopping.items()]);

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
      hasLiked: user ? item.likes.includes(user.id) : false,
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
