import { createRef } from "react";
import { fireEvent, render, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useOutsideClick } from "../use-outsideclick";

describe("useOutsideClick", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should run callback when clicking outside of div", () => {
    const ref = createRef<HTMLDivElement>();
    const callback = vi.fn();

    renderHook(() => useOutsideClick(callback, [ref]));

    const { getByTestId } = render(
      <div>
        <div data-testid="inside" ref={ref} />
        <div data-testid="outside" />
      </div>,
    );

    fireEvent.mouseDown(getByTestId("inside"));
    expect(callback).not.toHaveBeenCalled();

    fireEvent.mouseDown(getByTestId("outside"));
    expect(callback).toHaveBeenCalled();
  });
});
