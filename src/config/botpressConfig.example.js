/**
 * Template — copy to `botpressConfig.js` and replace placeholders with values from
 * Botpress Studio → Webchat → Embed. The real `botpressConfig.js` is gitignored so URLs/bot id
 * are not committed.
 */
export const botpressConfig = {
  /** Optional — your bot UUID from Botpress (for your own logging/analytics) */
  botId: "YOUR_BOT_ID",

  /**
   * First script from the embed snippet — inject loader (version may differ from v3.6).
   * Example shape: https://cdn.botpress.cloud/webchat/vX.Y/inject.js
   */
  injectScriptUrl: "https://cdn.botpress.cloud/webchat/v3.6/inject.js",

  /**
   * Second script from the embed snippet — generated config (`defer` in HTML).
   * Example shape: https://files.bpcontent.cloud/.../....js
   */
  embedScriptUrl: "https://files.bpcontent.cloud/YOUR/PATH/YOUR-GENERATED-SCRIPT.js",

  /**
   * HTTPS origin for WebView `baseUrl` (asset resolution). Default is usually fine.
   */
  baseUrl: "https://cdn.botpress.cloud/",
};
