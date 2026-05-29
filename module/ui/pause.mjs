import { aaVerbose, aaWarn } from "../helpers/logger.mjs";

const PAUSE_IMAGE = "systems/ash-and-anvil/assets/ui/AshandAnvil_Pause.png";

/**
 * @param {HTMLElement} root
 */
function applyPauseImage(root) {
  if (!root) return;
  const img = root.querySelector("img");
  if (!img) return;

  img.src = PAUSE_IMAGE;
  img.classList.add("ash-anvil-pause");
  img.alt = game.i18n.localize("ASHANVIL.PauseAlt");

  aaVerbose("Pause overlay image applied.", PAUSE_IMAGE);
}

/**
 * Register the system pause-screen branding (rotating icon while paused).
 */
export function registerPauseScreen() {
  // Legacy hook (v12–v13; still used by several systems on v13).
  Hooks.on("renderGamePause", (_application, html) => {
    if (game.system.id !== "ash-and-anvil") return;
    applyPauseImage(html);
  });

  // Application V2 fallback (v13+ / v14 GamePause).
  Hooks.on("renderApplicationV2", (application, element) => {
    if (game.system.id !== "ash-and-anvil") return;
    if (application?.constructor?.name !== "GamePause") return;
    applyPauseImage(element);
  });

  // Re-apply when pause state toggles in case the DOM was rebuilt.
  Hooks.on("pauseGame", (paused) => {
    if (!paused || game.system.id !== "ash-and-anvil") return;
    const pauseRoot = document.getElementById("pause");
    if (pauseRoot) applyPauseImage(pauseRoot);
    else aaWarn("Pause overlay element not found after pauseGame.");
  });
}
