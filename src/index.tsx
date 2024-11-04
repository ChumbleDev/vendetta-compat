import { reload } from 'enmity/api/native';
import { get, set } from 'enmity/api/settings';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { Dialog, React } from 'enmity/metro/common';
import Manifest from '../manifest.json'
import Settings from './components/Settings';

const VendettaCompat: Plugin = {
   ...Manifest,

   async onStart() {

      // show success dialog
      const showSuccessDialog = () => {
         if (!get(Manifest.name, "shownEnabledDialog", false)) {
            Dialog.show({
               title: "Enabled Bunny",
               body: "Successfully enabled Bunny. To disable it, just disable the plugin.",
               confirmText: "Okay",
               onConfirm: () => set(Manifest.name, "shownEnabledDialog", true)
            })
         }
      }

      // define the custom bunny url setting
      const customBunnyURL = get(Manifest.name, 'customBunnyURL') as { enabled: boolean, url: string };

      // base url of bunny
      const url = customBunnyURL?.enabled
         ? customBunnyURL.url
         : "https://raw.githubusercontent.com/bunny-mod/builds/main/bunny.js"

      // get the bunny code as text
      const res = await fetch(url)
      const bunnyCode = res.ok 
         ? await res.text() 
         : get(Manifest.name, "bunnyCode", null)

      // set the code for next time
      set(Manifest.name, "bunnyCode", bunnyCode)

      // eval the code
      eval(bunnyCode as string)

      // show success dialog
      showSuccessDialog()
   },

   // y̶o̶u̶d̶e̶t̶t̶a̶ ̶w̶i̶d̶e̶t̶t̶a̶ ̶n̶e̶v̶e̶r̶d̶e̶t̶t̶a̶ ̶g̶e̶d̶e̶t̶t̶a̶ ̶r̶i̶d̶e̶t̶t̶a̶ ̶o̶d̶e̶t̶t̶a̶ ̶v̶e̶n̶d̶e̶t̶t̶a̶ youdetta cadetta nowdetta gedetta ridetta odetta vendetta (i have no idea what this says)
   onStop() {

      // @ts-ignore attempt to put @arg window.bunny to @arg bunny
      const bunny = window.bunny;

      if (bunny) { 
         try {
            // unload bunny
            bunny?.unload();

            // ask to reload
            Dialog.show({
               title: "Must Reload",
               body: "To fully disable Bunny, you need to reload your Discord. Please note that Bunny will not work until you reload Discord.",
               confirmText: "Reload",
               cancelText: "Later",
               onConfirm: () => reload()
            })
         } catch(e) {
            // log error to console
            console.error(`[${Manifest.name}] Error when trying to unload Bunny: ${e}`)
         }
      }
   },

   getSettingsPanel() {
      return <Settings Manifest={Manifest} />
   }
};

registerPlugin(VendettaCompat);
