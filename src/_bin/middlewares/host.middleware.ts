import { sortProperties } from "../utils";
import createMiddleware from "./createMiddleware";

export default createMiddleware<Record<string, any>>({
  mapOutput: (output) => sortProperties(output, ["version"]),
  path: "host.json",
  template: getTemplate,
  valid: ["azure-func"],
});

function getTemplate(): Record<string, any> {
  return {
    extensionBundle: {
      id: "Microsoft.Azure.Functions.ExtensionBundle",
      version: "[4.*, 5.0.0)",
    },
    extensions: {
      http: { routePrefix: "" },
    },
    logging: {
      applicationInsights: {
        samplingSettings: {
          excludedTypes: "Request",
          isEnabled: true,
        },
      },
    },
    version: "2.0",
  };
}
