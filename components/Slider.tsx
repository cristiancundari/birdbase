import { SetStateAction, useState } from "react";
import { IconGripVertical } from "@tabler/icons-react";
import { clamp, useMediaQuery, useMove } from "@mantine/hooks";
import classes from "@/styles/slider.module.scss";
import { useMantineTheme } from "@mantine/core";

function Slider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const { ref } = useMove(({ x }) => onChange(clamp(x, 0.1, 0.9)));

  const theme = useMantineTheme();
  const isDeviceLarge = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`);
  const labelFloating = !isDeviceLarge && (value < 0.2 || value > 0.8);

  return (
    <div className={classes.root}>
      <div className={classes.track} ref={ref}>
        <div
          className={classes["fill-left"]}
          style={{
            width: `calc(${value * 100}% - var(--thumb-width) / 2 - var(--thumb-offset) / 2)`,
          }}
        >
          <span className={classes.label} data-floating={labelFloating || undefined} data-filled data-left>
            {(value * 100).toFixed(0)} %
          </span>
        </div>

        <div
          className={classes["fill-right"]}
          style={{
            width: `calc(${(1 - value) * 100}% - var(--thumb-width) / 2 - var(--thumb-offset) / 2)`,
          }}
        >
          <span className={classes.label} data-floating={labelFloating || undefined} data-filled data-right>
            {((1 - value) * 100).toFixed(0)} %
          </span>
        </div>

        <div className={classes.thumb} style={{ left: `calc(${value * 100}% - var(--thumb-width) / 2)` }} data-testid="slider-thumb">
          <IconGripVertical stroke={1.5} />
        </div>
      </div>
    </div>
  );
}

export default Slider;
