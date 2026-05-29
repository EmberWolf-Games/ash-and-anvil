import { applyAbilityMods } from "../rules/ability.mjs";
import { deriveCharacter } from "../rules/derive-character.mjs";

/**
 * @extends {Actor}
 */
export class AAAActor extends Actor {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type === "character") {
      deriveCharacter(this);
      return;
    }
    if (this.system.abilities) applyAbilityMods(this.system.abilities);
  }
}
