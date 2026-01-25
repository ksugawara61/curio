import { createBaseConfig } from "@repo/eslint-config/base";
import { createReactConfig } from "@repo/eslint-config/react";

export default [...createBaseConfig(), createReactConfig()];
