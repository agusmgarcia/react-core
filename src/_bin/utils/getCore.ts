import getPackageJSON from "./getPackageJSON";

export default function getCore(): Promise<
  NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>
> {
  return getPackageJSON().then((json) =>
    json.core === "app" ||
    json.core === "azure-func" ||
    json.core === "lib" ||
    json.core === "node"
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
