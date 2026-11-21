import {
  Armchair, Bike, Car, CookingPot, Dumbbell, Flower2, Footprints, Gem, Glasses, House, Laptop,
  ShoppingBag, ShoppingBasket, Shirt, Smartphone, Sparkles, Tablet, Tag, Watch, Droplets,
  type LucideIcon,
} from 'lucide-react';

const MAP: Array<[string, LucideIcon]> = [
  ['beauty', Sparkles],
  ['fragrance', Flower2],
  ['furniture', Armchair],
  ['grocer', ShoppingBasket],
  ['home', House],
  ['kitchen', CookingPot],
  ['laptop', Laptop],
  ['shirt', Shirt],
  ['tops', Shirt],
  ['dress', Shirt],
  ['shoes', Footprints],
  ['watch', Watch],
  ['smartphone', Smartphone],
  ['mobile', Smartphone],
  ['tablet', Tablet],
  ['motorcycle', Bike],
  ['vehicle', Car],
  ['skin', Droplets],
  ['sports', Dumbbell],
  ['sunglasses', Glasses],
  ['bags', ShoppingBag],
  ['jewel', Gem],
];

export function categoryIcon(slug: string): LucideIcon {
  return MAP.find(([key]) => slug.includes(key))?.[1] ?? Tag;
}
