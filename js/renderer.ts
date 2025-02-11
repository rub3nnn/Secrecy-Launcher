import { readForgeMod, ForgeModMetadata } from "@xmcl/mod-parser";
function lajava(){
    const forgeModJarBuff = "C:\Users\ruben\AppData\Roaming\.minecraft\mods\AppleSkin-mc1.12-1.0.9.jar";
const metadata: ForgeModMetadata[] = await readForgeMod(forgeModJarBuff);
const modid = metadata[0].modid; // get modid of first mods
alert(modid)
}
