import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../Input";

describe("Input", () => {
  it("should render with value", () => {
    render(<Input value="test value" onChange={() => {}} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("test value");
  });

  it("should call onChange when typing", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<Input value="" onChange={onChange} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "h");

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith("h");
  });

  it("should render with placeholder", () => {
    render(<Input value="" onChange={() => {}} placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input value="" onChange={() => {}} disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("should call onKeyPress when pressing a key", async () => {
    const onKeyPress = jest.fn();
    const user = userEvent.setup();

    render(<Input value="" onChange={() => {}} onKeyPress={onKeyPress} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "{Enter}");

    expect(onKeyPress).toHaveBeenCalled();
  });

  it("should not call onChange when disabled", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<Input value="" onChange={onChange} disabled />);
    const input = screen.getByRole("textbox");

    await user.type(input, "test");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("should have correct styling classes", () => {
    render(<Input value="" onChange={() => {}} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("w-full", "rounded-lg", "border-2");
  });
});
