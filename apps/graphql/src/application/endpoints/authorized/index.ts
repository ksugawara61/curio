import type { Context } from "@getcronit/pylon";

export const authorized = (ctx: Context) => {
  return ctx.html(
    "<h1>Welcome to curio</h1><button id='closeTab'>Close Tab</button><script>document.getElementById('closeTab').addEventListener('click', () => { window.close(); });</script>",
  );
};
