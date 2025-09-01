import { cn } from "@/lib/utils";

interface HeaderProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
}

const Header = ({
  children,
  as: Component = "header",
  className,
}: HeaderProps) => {
  return (
    <Component
      className={cn(
        " left-0 right-0 border-bbg-background/95  z-10",
        className
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {children}
      </div>
    </Component>
  );
};

export default Header;
