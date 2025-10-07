import { Search } from "lucide-react";
import { Input } from "../atoms/Input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onKeyPress,
  placeholder,
  disabled,
}: SearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
      <Input
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
