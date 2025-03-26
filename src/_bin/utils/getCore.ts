import getPackageJSON from "./getPackageJSON";

export default function getCore(): Promise<"app" | "lib"> {
  return getPackageJSON().then((json) =>
    !!json.core
      ? json.core
      : typeof json.private === "string"
        ? json.private === "true"
          ? "app"
          : "lib"
        : !!json.private
          ? "app"
          : "lib",
  );
}
