# Components

This folder contains reusable React components for the Social Life app.

## Structure

Organize your components in a way that makes sense for your app. Here are some suggestions:

```
components/
├── ui/              # Reusable UI components (buttons, cards, inputs, etc.)
├── layout/          # Layout components (header, footer, sidebar, etc.)
├── auth/            # Authentication-related components
├── posts/           # Post-related components
├── profile/         # Profile-related components
└── ...              # Add more folders as needed
```

## Creating Components

When creating a new component:

1. **Use TypeScript**: Define proper types for props
2. **Add comments**: Explain what the component does
3. **Keep it focused**: Each component should do one thing well
4. **Make it reusable**: Avoid hardcoding values when possible

### Example Component

```tsx
/**
 * Button Component
 *
 * A reusable button component with different variants
 */

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-semibold transition-colors";
  const variantStyles =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <button className={`${baseStyles} ${variantStyles}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

## Best Practices

- Use meaningful component names
- Export components as default or named exports consistently
- Keep components small and focused
- Use composition over large, complex components
- Add prop validation with TypeScript interfaces
