/**
 * WebView wrapper for Botpress webchat v3: `window.botpress` API, events to RN via postMessage.
 */
import { WebView } from "react-native-webview";
import getBotpressWebchat from "./getBotpressWebchat";
import React, { useCallback, useRef } from "react";

const broadcastToRn = `
(function () {
  function post(ev, data) {
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: ev, data: data }));
    } catch (e) {}
  }
  function wire() {
    if (!window.botpress || typeof window.botpress.on !== "function") return false;
    window.botpress.on("webchat:initialized", function () {
      try { window.botpress.open(); } catch (e) {}
    });
    [
      "message",
      "webchat:initialized",
      "webchat:ready",
      "webchat:opened",
      "webchat:closed",
      "customEvent",
      "error",
      "conversation",
    ].forEach(function (ev) {
      window.botpress.on(ev, function (data) {
        post(ev, data);
      });
    });
    setTimeout(function () {
      try { window.botpress.open(); } catch (e) {}
    }, 400);
    return true;
  }
  var n = 0;
  var id = setInterval(function () {
    if (wire() || ++n > 240) clearInterval(id);
  }, 50);
})();
true;
`;

/** Closing the panel sometimes triggers a top-level nav to botpress.com — block it and close in-page. */
const closeChatJs = `
try {
  if (window.botpress && typeof window.botpress.close === "function") {
    window.botpress.close();
  }
} catch (e) {}
true;
`;

function isBotpressMarketingSiteUrl(url) {
  if (!url || url.startsWith("about:") || url.startsWith("blob:") || url.startsWith("data:")) {
    return false;
  }
  try {
    const h = new URL(url).hostname;
    return h === "botpress.com" || h.endsWith(".botpress.com");
  } catch {
    return false;
  }
}

export default function BpWidget(props) {
  const { botConfig, onMessage } = props;
  const webref = useRef(null);

  const { html, baseUrl } = getBotpressWebchat(botConfig);

  const onShouldStartLoadWithRequest = useCallback((request) => {
    const { url } = request;
    if (isBotpressMarketingSiteUrl(url)) {
      webref.current?.injectJavaScript(closeChatJs);
      return false;
    }
    return true;
  }, []);

  return (
    <WebView
      ref={webref}
      style={{ flex: 1 }}
      source={{
        baseUrl,
        html,
      }}
      onMessage={onMessage}
      injectedJavaScript={broadcastToRn}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      setSupportMultipleWindows={false}
      javaScriptEnabled
      domStorageEnabled
      originWhitelist={["*"]}
    />
  );
}
