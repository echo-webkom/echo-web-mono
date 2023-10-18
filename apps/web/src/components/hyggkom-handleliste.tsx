interface Props {
  items: Array<string>;
}

export function ShoppingList({ items }: Props) {
  return (
    <>
      <h1>Handleliste</h1>
      <ul className="list-group">
        {items.map((item) => (
          <li className={item} key={item}>
            {item}
            <button className="likeButton_${item}" key="likeButton_${item}"></button>
          </li>
        ))}
      </ul>
    </>
  );
}
