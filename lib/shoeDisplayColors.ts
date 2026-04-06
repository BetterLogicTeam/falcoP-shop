/**
 * Footwear PDP: show at least one color option when catalog `colors` is empty.
 * Current range is white-only; real variants still come from product.colors when set.
 */
export function shoeDisplayColors(colors: string[]): string[] {
  return colors.length > 0 ? colors : ['White']
}
