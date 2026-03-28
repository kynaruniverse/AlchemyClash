import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

export interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  /** Visual variant of the slider */
  variant?: "default" | "alchemy" | "nature" | "magic";
}

const sliderVariantStyles = {
  default: {
    track: "bg-gold/20",
    range: "bg-gold",
    thumb: "border-gold bg-parchment hover:bg-gold/10 focus-visible:ring-gold/50",
  },
  alchemy: {
    track: "bg-gold/30",
    range: "bg-gold",
    thumb: "border-gold bg-gold/5 hover:bg-gold/20 focus-visible:ring-gold/60",
  },
  nature: {
    track: "bg-moss/20",
    range: "bg-moss",
    thumb: "border-moss bg-moss/5 hover:bg-moss/20 focus-visible:ring-moss/50",
  },
  magic: {
    track: "bg-violet-magic/20",
    range: "bg-violet-magic",
    thumb: "border-violet-magic bg-violet-magic/5 hover:bg-violet-magic/20 focus-visible:ring-violet-magic/50",
  },
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  variant = "default",
  ...props
}: SliderProps) {
  const styles = sliderVariantStyles[variant];
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full",
          styles.track,
          "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute",
            styles.range,
            "data-[orientation=horizontal]:h-full",
            "data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "block size-4 shrink-0 rounded-full border shadow-sm transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            styles.thumb,
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };