import * as React from "react";

export default function CustomLabel({
  children,
  className,
  as: Tag = "h2"
}) {
  return React.createElement(Tag, { className }, children);
}
