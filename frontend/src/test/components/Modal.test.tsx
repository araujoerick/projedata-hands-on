import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../../components/Modal";

describe("Modal", () => {
  it("renders title and children", () => {
    render(
      <Modal title="Teste Modal" onClose={vi.fn()}>
        <p>Conteúdo do modal</p>
      </Modal>
    );
    expect(screen.getByText("Teste Modal")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do modal")).toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal title="Modal" onClose={onClose}>
        <p>Filho</p>
      </Modal>
    );
    // Click the outer backdrop (first div)
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when inner content is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal title="Modal" onClose={onClose}>
        <p>Filho</p>
      </Modal>
    );
    fireEvent.click(screen.getByText("Filho"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal title="Modal" onClose={onClose}>
        <p>Filho</p>
      </Modal>
    );
    fireEvent.click(screen.getByText("✕"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(
      <Modal title="Modal" onClose={onClose}>
        <p>Filho</p>
      </Modal>
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose for other keys", () => {
    const onClose = vi.fn();
    render(
      <Modal title="Modal" onClose={onClose}>
        <p>Filho</p>
      </Modal>
    );
    fireEvent.keyDown(window, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
  });
});
