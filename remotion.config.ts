/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((config) => {
  const withTailwind = enableTailwind(config);
  return {
    ...withTailwind,
    cache: false,
    output: {
      ...((withTailwind as Record<string, unknown>).output as object),
      hashFunction: "sha256",
    },
    snapshot: {
      ...((withTailwind as Record<string, unknown>).snapshot as object),
      managedPaths: [],
    },
  };
});
Config.setOutputLocation("D:/Claude Experiments");
