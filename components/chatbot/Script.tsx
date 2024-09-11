// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";

import { useEffect } from "react";

const ChatbotScript = () => {
  useEffect(() => {
    ((d, t) => {
      const BASE_URL = "https://chat.barberi.app";
      const g = d.createElement(t);
      const s = d.getElementsByTagName(t)[0];
      g.src = `${BASE_URL}/packs/js/sdk.js`;
      g.defer = true;
      g.async = true;
      s.parentNode.insertBefore(g, s);
      g.onload = function () {
        window.chatwootSDK.run({
          websiteToken: "znbNkogMdSJB4vmt7FDzDKgS",
          baseUrl: BASE_URL,
        });
      };
    })(document, "script");
  }, []);
  return <div />;
};

export default ChatbotScript;
