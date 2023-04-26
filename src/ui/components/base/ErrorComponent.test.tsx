import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ErrorComponent } from ".";

describe("Error tests", () => {
  test("should show Error title all the time", () => {
    render(<ErrorComponent></ErrorComponent>);

    expect(screen.getByText(/Erreur/)).toBeDefined();
  });
});
