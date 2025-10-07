/**
 * Card Component
 *
 * A reusable card component for displaying content.
 * Great for posts, profiles, or any boxed content.
 *
 * Usage:
 * <Card>
 *   <CardHeader>Title</CardHeader>
 *   <CardContent>Content goes here</CardContent>
 * </Card>
 */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Main Card container
 */
export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/**
 * Card Header section
 */
export function CardHeader({ children, className = "" }: CardProps) {
  return (
    <div
      className={`p-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Card Content section
 */
export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

/**
 * Card Footer section
 */
export function CardFooter({ children, className = "" }: CardProps) {
  return (
    <div
      className={`p-4 border-t border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
}
