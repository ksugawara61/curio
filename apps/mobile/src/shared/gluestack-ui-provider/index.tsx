import type { FC, PropsWithChildren } from "react";
import { useColorScheme, View } from "react-native";
import { config } from "./config";

type Mode = "light" | "dark" | "system";

type GluestackUIProviderProps = PropsWithChildren<{
  mode?: Mode;
}>;

export const GluestackUIProvider: FC<GluestackUIProviderProps> = ({
  mode = "light",
  children,
}) => {
  const colorScheme = useColorScheme();
  const resolvedMode =
    mode === "system" ? (colorScheme === "dark" ? "dark" : "light") : mode;

  return <View style={[config[resolvedMode], { flex: 1 }]}>{children}</View>;
};
