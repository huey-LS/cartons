export function spread () {}

export function respond (name, ctx, args) {
  let spread = ctx[name];
  if (typeof spread === 'function') {
    spread.apply(ctx, args);
  }

  if (typeof ctx.emit === 'function') {
    ctx.emit(name, args);
  }
}
