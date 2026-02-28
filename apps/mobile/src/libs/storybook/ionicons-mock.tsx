import type { FC } from "react";

type IoniconsProps = {
  name: string;
  size?: number;
  color?: string;
  testID?: string;
  style?: object;
};

const Ionicons: FC<IoniconsProps> = ({ name, size, color, testID }) => (
  <span
    data-testid={testID ?? "ionicons"}
    data-icon={name}
    style={{ fontSize: size, color }}
  />
);

export default Ionicons;
