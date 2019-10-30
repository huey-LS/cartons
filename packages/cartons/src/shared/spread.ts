export function spread () {}

export function respond (
  name: string,
  ctx: any,
  args?: any
) {
  let spread = ctx[name];
  if (typeof spread === 'function') {
    spread.apply(ctx, args);
  }

  if (typeof ctx.emit === 'function') {
    ctx.emit(name, args);
  }
}
