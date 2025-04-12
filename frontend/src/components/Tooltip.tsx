import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
`;

const StyledTooltipContent = styled(TooltipPrimitive.Content)`
  background-color: #18181b; /* bg-zinc-900 */
  color: var(--primary-foreground, #ffffff); /* text-primary-foreground */
  z-index: 50;
  width: fit-content;
  border-radius: 0.375rem; /* rounded-md */
  padding: 0.375rem 0.75rem; /* py-1.5, px-3 approximations */
  font-size: 0.75rem; /* text-xs */
  /* Optionally set transform origin if required (Radix adds one as a CSS variable) */
  transform-origin: var(--radix-tooltip-content-transform-origin);
  
  animation: ${fadeIn} 0.2s ease-out;
  
  &[data-state="closed"] {
    animation: ${fadeOut} 0.2s ease-out;
  }

  &[data-side="bottom"] {
    transform: translateY(-2px);
  }
`;

const StyledTooltipArrow = styled(TooltipPrimitive.Arrow)`
  background-color: #18181b; /* bg-zinc-900 */
  fill: #18181b;
  z-index: 50;
  width: 10px;
  height: 10px;
  transform: translateY(calc(-50% - 2px)) rotate(45deg);
  border-radius: 2px;
`;

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
  );
}

// Tooltip: A thin wrapper over Radix Root with TooltipProvider.
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <StyledTooltipContent sideOffset={sideOffset} className={className} {...props}>
        {children}
        <StyledTooltipArrow />
      </StyledTooltipContent>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
