import classNames from "classnames";

export const Separator = ({ direction = "width", ...props }) => {
  return (
    <div
      className={classNames("bg-[var(--black-500)]", {
        "w-full h-px": direction === "width",
        "h-full w-px": direction === "height",
        classNames,
      })}
      {...props}
    ></div>
  );
};
