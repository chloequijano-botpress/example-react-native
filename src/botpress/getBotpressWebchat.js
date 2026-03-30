/**
 * HTML for Botpress Cloud webchat v3 in a WebView: `inject.js` + your Studio embed script.
 * The embed script carries bot configuration; do not duplicate `init()` from v1.
 *
 * Avoid setting global font-family here — it fights Botpress theme fonts. Use Botpress Studio
 * for typography; emoji display is handled by the webchat runtime.
 */
const getBotpressWebchat = (botConfig) => {
  const injectUrl =
    botConfig.injectScriptUrl ||
    "https://cdn.botpress.cloud/webchat/v3.6/inject.js";
  const embedUrl = botConfig.embedScriptUrl;
  if (!embedUrl || typeof embedUrl !== "string") {
    throw new Error(
      "botConfig.embedScriptUrl is required (paste the second script URL from Studio embed)",
    );
  }
  const baseUrl = botConfig.baseUrl || "https://cdn.botpress.cloud/";

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<style>
  html, body { margin: 0; height: 100%; }
  body {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  #bp-web-widget-container {
    height: 100%;
    width: 100%;
    flex: 1;
  }
</style>
<title>Chatbot</title>
</head>
<body>
<script src="${injectUrl}"></script>
<script src="${embedUrl}" defer></script>
</body>
</html>`;

  return { baseUrl, html };
};

module.exports = getBotpressWebchat;
