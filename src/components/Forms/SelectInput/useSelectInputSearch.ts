import * as React from 'react';

const normalizeSearchText = (value: string) => value
  .toLocaleLowerCase('es')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

export interface SelectInputSearchOption {
  value: string;
  label: string;
  searchText?: string;
}

export interface UseSelectInputSearchProps<T extends SelectInputSearchOption> {
  options: readonly T[];
  onOpenChange?: (open: boolean) => void;
  onOptionSelect?: (option: T) => void;
}

export const useSelectInputSearch = <T extends SelectInputSearchOption>({
  options,
  onOpenChange,
  onOptionSelect,
}: UseSelectInputSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  const filteredOptions = React.useMemo(() => {
    const normalizedSearchTerm = normalizeSearchText(searchTerm);
    if (!normalizedSearchTerm) return options;

    return options.filter((option) => {
      const searchableText = [option.label, option.value, option.searchText]
        .filter(Boolean)
        .map((value) => normalizeSearchText(value ?? ''))
        .join(' ');

      return searchableText.includes(normalizedSearchTerm);
    });
  }, [options, searchTerm]);

  const safeHighlightedIndex = Math.min(highlightedIndex, Math.max(filteredOptions.length - 1, 0));

  const resetSearch = () => {
    setSearchTerm('');
    setHighlightedIndex(0);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setHighlightedIndex(0);
  };

  const selectOption = (option: T) => {
    onOptionSelect?.(option);
    setSearchTerm('');
    setHighlightedIndex(0);
    onOpenChange?.(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onOpenChange?.(false);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((currentIndex) => Math.min(currentIndex + 1, Math.max(filteredOptions.length - 1, 0)));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((currentIndex) => Math.max(currentIndex - 1, 0));
      return;
    }

    if (event.key === 'Enter' && filteredOptions[safeHighlightedIndex]) {
      event.preventDefault();
      selectOption(filteredOptions[safeHighlightedIndex]);
    }
  };

  return {
    searchTerm,
    safeHighlightedIndex,
    filteredOptions,
    selectOption,
    handleKeyDown,
    handleSearchChange,
    resetSearch,
  };
};
