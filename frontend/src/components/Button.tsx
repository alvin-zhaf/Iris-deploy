import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import styled, { css } from "styled-components";

// ----------------------------------------------------------------------
// Define base styles and variant/size mappings
// ----------------------------------------------------------------------
const baseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: 0.375rem; /* rounded-md */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  transition: all 0.2s ease;
  outline: none;
  flex-shrink: 0;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  /* Ensure child SVGs don't capture pointer events */
  & svg {
    pointer-events: none;
    flex-shrink: 0;
    width: 1rem; /* default size for SVG icons */
    height: 1rem;
  }
`;

const variantStyles = {
  default: css`
    background-color: var(--primary, #2563eb); /* bg-primary */
    color: var(--primary-foreground, #ffffff); /* text-primary-foreground */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    &:hover {
      background-color: rgba(37, 99, 235, 0.9);
    }
  `,
  destructive: css`
    background-color: var(--destructive, #dc2626);
    color: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    &:hover {
      background-color: rgba(220, 38, 38, 0.9);
    }
  `,
  outline: css`
    background-color: var(--background, #ffffff);
    border: 1px solid var(--border, #d1d5db);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    &:hover {
      background-color: var(--accent, #f3f4f6);
      color: var(--accent-foreground, #111827);
    }
  `,
  secondary: css`
    background-color: var(--secondary, #6b7280);
    color: var(--secondary-foreground, #f9fafb);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    &:hover {
      background-color: #4b5563;
    }
  `,
  ghost: css`
    background-color: transparent;
    &:hover {
      background-color: var(--accent, #f3f4f6);
      color: var(--accent-foreground, #111827);
    }
  `,
  link: css`
    background-color: transparent;
    text-decoration: underline;
    &:hover {
      text-decoration: underline;
    }
  `,
};

const sizeStyles = {
  default: css`
    height: 2.25rem; /* h-9 = 36px */
    padding: 0 1rem; /* px-4 = 16px */
  `,
  sm: css`
    height: 2rem; /* h-8 = 32px */
    padding: 0 0.75rem; /* px-3 = 12px */
    border-radius: 0.25rem; /* slightly smaller */
  `,
  lg: css`
    height: 2.5rem; /* h-10 = 40px */
    padding: 0 1.5rem; /* px-6 = 24px */
  `,
  icon: css`
    width: 2.25rem;
    height: 2.25rem;
  `,
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  asChild?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  ${baseStyles};
  ${({ variant = "default" }) => variantStyles[variant]};
  ${({ size = "default" }) => sizeStyles[size]};
`;

const StyledSlot = styled(Slot)<ButtonProps>`
  ${baseStyles};
  ${({ variant = "default" }) => variantStyles[variant]};
  ${({ size = "default" }) => sizeStyles[size]};
`;

function Button({
  asChild = false,
  variant,
  size,
  ...props
}: ButtonProps) {
  const Component = asChild ? StyledSlot : StyledButton;
  return <Component variant={variant} size={size} {...props} />;
}

export { Button, StyledButton as buttonVariants };
