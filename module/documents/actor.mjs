/**
 * @extends {Actor}
 */
const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"];

export class AAAActor extends Actor {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.system.abilities) {
      for (const key of ABILITY_KEYS) {
        const ability = this.system.abilities[key];
        if (!ability) continue;
        ability.mod = Math.floor((ability.value - 10) / 2);
      }
    }
  }
}
