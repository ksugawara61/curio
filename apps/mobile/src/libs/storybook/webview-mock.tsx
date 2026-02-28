// react-native-webview のモック（Storybook 用）
// ネイティブの WebView をブラウザ向けに差し替える

import type { FC } from "react";
import { View } from "react-native";

type WebViewProps = {
  // biome-ignore lint/suspicious/noExplicitAny: react-native の StyleSheet 型を受け入れる
  style?: any;
  source?: { uri?: string; html?: string };
  onLoadProgress?: (event: { nativeEvent: { progress: number } }) => void;
  onLoadEnd?: () => void;
  onLoadStart?: () => void;
};

const WebView: FC<WebViewProps> = ({
  style,
  source,
  onLoadProgress,
  onLoadEnd,
  onLoadStart,
}) => (
  <View style={[{ flex: 1 }, style]}>
    {source?.uri ? (
      <iframe
        src={source.uri}
        style={{ width: "100%", height: "100%", border: "none" }}
        title="webview"
        onLoad={() => {
          onLoadProgress?.({ nativeEvent: { progress: 1 } });
          onLoadEnd?.();
        }}
        onLoadStart={() => onLoadStart?.()}
      />
    ) : null}
  </View>
);

export default WebView;
