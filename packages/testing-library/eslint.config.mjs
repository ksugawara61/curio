import { createBaseConfig } from "@curio/eslint-config/base";
import { createReactConfig } from "@curio/eslint-config/react";

export default [...createBaseConfig(), createReactConfig()];
