import { render, screen } from "@testing-library/react";
import { Card } from "../Card";

describe("Card", () => {
  it("should render with children", () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>,
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("should have correct styling classes", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass("rounded-lg", "shadow-sm", "bg-white");
  });

  it("should render multiple children", () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Description</p>
      </Card>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });
});
