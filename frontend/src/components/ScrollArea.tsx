import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import styled, { css } from "styled-components";

// ----------------------------------------------------------------------
// Styled Components for ScrollArea
// ----------------------------------------------------------------------

const StyledScrollAreaRoot = styled(ScrollAreaPrimitive.Root)`
  position: relative;
`;

const StyledViewport = styled(ScrollAreaPrimitive.Viewport)`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  transition: color 0.2s, box-shadow 0.2s;
  outline: none;
  &:focus-visible {
    /* You can replace the below with your theme's ring-color variables */
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.5);
    outline: 1px solid;
  }
`;

interface StyledScrollBarProps {
  orientation?: "vertical" | "horizontal";
}

const StyledScrollBar = styled(ScrollAreaPrimitive.ScrollAreaScrollbar)<StyledScrollBarProps>`
  display: flex;
  touch-action: none;
  padding: 1px;
  transition: color 0.2s;
  user-select: none;
  
  ${({ orientation }) =>
    orientation === "horizontal"
      ? css`
          height: 10px;
          flex-direction: column;
          border-top: 1px solid transparent;
        `
      : css`
          width: 10px;
          height: 100%;
          border-left: 1px solid transparent;
        `}
`;

const StyledThumb = styled(ScrollAreaPrimitive.ScrollAreaThumb)`
  background-color: var(--border, #d1d5db);
  position: relative;
  flex: 1;
  border-radius: 9999px; /* rounded-full */
`;

// ----------------------------------------------------------------------
// Component Implementations
// ----------------------------------------------------------------------

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <StyledScrollAreaRoot data-slot="scroll-area" className={className} {...props}>
      <StyledViewport
        data-slot="scroll-area-viewport"
      >
        {children}
      </StyledViewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </StyledScrollAreaRoot>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <StyledScrollBar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={className}
      {...props}
    >
      <StyledThumb data-slot="scroll-area-thumb" />
    </StyledScrollBar>
  );
}

export { ScrollArea, ScrollBar };