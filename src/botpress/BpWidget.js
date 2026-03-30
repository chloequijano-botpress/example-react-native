/**
 * WebView wrapper for Botpress webchat v3: `window.botpress` API, events to RN via postMessage.
 */
import { WebView } from "react-native-webview";
import getBotpressWebchat from "./getBotpressWebchat";
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

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

const BpWidget = forwardRef((props, ref) => {
  const webref = useRef();

  const { botConfig, onMessage } = props;

  const { html, baseUrl } = getBotpressWebchat(botConfig);

  const onShouldStartLoadWithRequest = useCallback((request) => {
    const { url } = request;
    if (isBotpressMarketingSiteUrl(url)) {
      webref.current?.injectJavaScript(closeChatJs);
      return false;
    }
    return true;
  }, []);

  const invokeBotpressMethod = (method, ...args) => {
    if (!webref.current) {
      throw new Error("Webview must be loaded to run commands");
    }
    const payload = { method, args };
    const run = `
(function () {
  try {
    if (!window.botpress) return;
    var p = ${JSON.stringify(payload)};
    if (p.method === "sendEvent") {
      var ev = p.args[0];
      if (ev && ev.type === "toggle") {
        if (typeof window.botpress.toggle === "function") window.botpress.toggle();
      } else {
        window.botpress.sendEvent(ev);
      }
    } else if (p.method === "sendPayload") {
      var pl = p.args[0];
      if (pl && pl.type === "text" && pl.text) {
        window.botpress.sendMessage(pl.text);
      } else {
        window.botpress.sendEvent(pl);
      }
    } else if (p.method === "mergeConfig") {
      var c = p.args[0];
      if (c && typeof c === "object" && !c.configuration) {
        window.botpress.config({ configuration: c });
      } else {
        window.botpress.config(c);
      }
    }
  } catch (e) {}
})();
true;
`;
    webref.current.injectJavaScript(run);
  };

  useImperativeHandle(ref, () => ({
    sendEvent: (event) => {
      invokeBotpressMethod("sendEvent", event);
    },
    sendPayload: (payload) => {
      invokeBotpressMethod("sendPayload", payload);
    },
    mergeConfig: (config) => {
      invokeBotpressMethod("mergeConfig", config);
    },
  }));

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
});

export default BpWidget;
