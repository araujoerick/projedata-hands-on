import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "../../components/StatusBadge";

describe("StatusBadge", () => {
  it('shows "Sem estoque" when quantity is 0', () => {
    render(<StatusBadge quantity={0} />);
    expect(screen.getByText("Sem estoque")).toBeInTheDocument();
  });

  it('shows "Estoque baixo" when quantity is between 1 and 9', () => {
    render(<StatusBadge quantity={5} />);
    expect(screen.getByText("Estoque baixo")).toBeInTheDocument();
  });

  it('shows "Estoque baixo" at boundary value 1', () => {
    render(<StatusBadge quantity={1} />);
    expect(screen.getByText("Estoque baixo")).toBeInTheDocument();
  });

  it('shows "Estoque baixo" at boundary value 9', () => {
    render(<StatusBadge quantity={9} />);
    expect(screen.getByText("Estoque baixo")).toBeInTheDocument();
  });

  it('shows "Normal" when quantity is 10 or more', () => {
    render(<StatusBadge quantity={10} />);
    expect(screen.getByText("Normal")).toBeInTheDocument();
  });

  it('shows "Normal" for large quantities', () => {
    render(<StatusBadge quantity={999} />);
    expect(screen.getByText("Normal")).toBeInTheDocument();
  });

  it("applies danger styles when out of stock", () => {
    render(<StatusBadge quantity={0} />);
    const badge = screen.getByText("Sem estoque");
    expect(badge).toHaveClass("text-red-700");
  });

  it("applies warning styles when low stock", () => {
    render(<StatusBadge quantity={3} />);
    const badge = screen.getByText("Estoque baixo");
    expect(badge).toHaveClass("text-amber-700");
  });

  it("applies success styles when normal stock", () => {
    render(<StatusBadge quantity={50} />);
    const badge = screen.getByText("Normal");
    expect(badge).toHaveClass("text-green-700");
  });
});
