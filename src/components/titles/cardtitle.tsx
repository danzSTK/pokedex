import React from "react";

type Props = {
  children: React.ReactNode;
  as?: React.ElementType;
} & React.HTMLProps<HTMLHeadingElement>;

const CardTitle = ({ children, as: Component = "h2", ...props }: Props) => {
  return (
    <Component className="text-2xl font-bold tracking-tight" {...props}>
      {children}
    </Component>
  );
};

export default CardTitle;
