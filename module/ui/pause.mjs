import { aaVerbose, aaWarn } from "../helpers/logger.mjs";

/** @type {readonly string} */
export const PAUSE_IMAGE_PATH = "systems/ash-and-anvil/assets/ui/AshandAnvil_Pause.png";

/**
 * Resolve pause image URL for local installs and Forge asset hosting.
 * @returns {string}
 */
function getPauseImageSrc() {
  if (typeof foundry !== "undefined" && foundry.utils?.getRoute) {
    return foundry.utils.getRoute(PAUSE_IMAGE_PATH);
  }
  return `/${PAUSE_IMAGE_PATH}`;
}

/**
 * @param {HTMLElement} root
 */
function applyPauseImage(root) {
  if (!root) return;

  const src = getPauseImageSrc();
  const alt = game.i18n.localize("ASHANVIL.PauseAlt");

  let img = root.querySelector("img.ash-anvil-pause");

  if (!img) {
    root.querySelector("svg")?.remove();
    const icon = root.querySelector("i[class*='fa-'], .icon, .pause-icon");
    icon?.remove();

    img = root.querySelector("img:not(.ash-anvil-pause)");
    if (img) {
      img.classList.add("ash-anvil-pause");
    } else {
      img = document.createElement("img");
      img.className = "ash-anvil-pause";
      const anchor =
        root.querySelector("figure") ??
        root.querySelector(".window-content") ??
        root.querySelector(".flexcol") ??
        root;
      anchor.prepend(img);
    }
  }

  img.src = src;
  img.alt = alt;
  img.classList.add("ash-anvil-pause");
  img.style.animation = "ash-anvil-pause-spin 12s linear infinite";
  img.style.transformOrigin = "center center";

  const figure = root.querySelector("figure");
  if (figure) {
    figure.style.animation = "ash-anvil-pause-spin 12s linear infinite";
    figure.style.transformOrigin = "center center";
  }

  document.documentElement.style.setProperty("--ash-anvil-pause-image", `url("${src}")`);

  aaVerbose("Pause overlay image applied.", src);
}

/**
 * Observe #pause class changes (v13 toggles .paused on the overlay).
 */
function installPauseObserver() {
  const pause = document.getElementById("pause");
  if (!pause) {
    aaWarn("Pause overlay #pause element not found; observer not installed.");
    return;
  }

  const observer = new MutationObserver(() => {
    if (pause.classList.contains("paused")) applyPauseImage(pause);
  });
  observer.observe(pause, { attributes: true, attributeFilter: ["class"] });

  if (pause.classList.contains("paused")) applyPauseImage(pause);

  aaVerbose("Pause overlay observer installed.");
}

/**
 * Register the system pause-screen branding (rotating icon while paused).
 */
export function registerPauseScreen() {
  CONFIG.ASH_ANVIL ??= {};
  CONFIG.ASH_ANVIL.pauseImage = PAUSE_IMAGE_PATH;

  const onPauseRender = (_application, html) => {
    if (game.system.id !== "ash-and-anvil") return;
    const root = html instanceof HTMLElement ? html : document.getElementById("pause");
    applyPauseImage(root);
  };

  Hooks.on("renderGamePause", onPauseRender);
  Hooks.on("renderPause", onPauseRender);

  Hooks.on("renderApplicationV2", (application, element) => {
    if (game.system.id !== "ash-and-anvil") return;
    if (application?.constructor?.name !== "GamePause") return;
    applyPauseImage(element);
  });

  Hooks.on("pauseGame", (paused) => {
    if (!paused || game.system.id !== "ash-and-anvil") return;
    requestAnimationFrame(() => {
      const pauseRoot = document.getElementById("pause");
      if (pauseRoot) applyPauseImage(pauseRoot);
      else aaWarn("Pause overlay element not found after pauseGame.");
    });
  });

  Hooks.once("ready", () => installPauseObserver());
}
