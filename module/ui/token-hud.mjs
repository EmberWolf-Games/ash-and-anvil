import { parseDeltaInput } from "../rules/resource-adjust.mjs";

/**
 * Register token HUD HP delta controls for character actors.
 */
export function registerTokenHud() {
  const hook = (application, element) => {
    const token = application?.object;
    const actor = token?.actor;
    if (!actor || actor.type !== "character") return;

    const health = actor.system.attributes?.health ?? { value: 0, max: 0, temp: 0 };
    const display = `${health.value ?? 0}${health.temp ? ` (+${health.temp})` : ""} / ${health.max ?? 0}`;

    const hud = element instanceof HTMLElement ? element : element?.[0];
    if (!hud || hud.querySelector(".ash-anvil-token-hp")) return;

    const block = document.createElement("div");
    block.className = "ash-anvil-token-hp control-icon flexrow";
    block.innerHTML = `
      <span class="token-hp-current" title="${game.i18n.localize("ASHANVIL.Health")}">${display}</span>
      <input type="text" class="token-hp-delta" placeholder="${game.i18n.localize("ASHANVIL.ResourceDeltaPlaceholder")}" />
      <a class="token-hp-apply" title="${game.i18n.localize("ASHANVIL.Apply")}"><i class="fa-solid fa-heart-pulse"></i></a>
    `;

    const input = block.querySelector(".token-hp-delta");
    const apply = block.querySelector(".token-hp-apply");

    apply?.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!actor.isOwner) return;
      const raw = input?.value ?? "";
      if (!raw.trim()) return;
      const current = health.value ?? 0;
      let next = parseDeltaInput(raw, current);
      const max = actor.system.attributes?.health?.max ?? next;
      next = Math.min(next, max);
      await actor.update({ "system.attributes.health.value": next });
      if (input) input.value = "";
      block.querySelector(".token-hp-current").textContent = `${next}${health.temp ? ` (+${health.temp})` : ""} / ${max}`;
    });

    hud.appendChild(block);
  };

  Hooks.on("renderTokenHUD", hook);
}
