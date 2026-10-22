import * as React from 'react';
import { HelpText, type HelpTextState } from '../../Feedback/HelpText/HelpText';
import { useHelpTextPresence } from '../../Feedback/HelpText/useHelpTextPresence';
import { CountryFlag } from '../../Navigation/TopBar/Atoms/CountryFlag';
import { SelectableField } from '../Dropdown/Atoms/SelectableField';
import { Dropdown } from '../Dropdown/Dropdown';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useDropdownPresence } from '../../../lib/useDropdownPresence';

// ============================================================================
// TYPES
// ============================================================================

export type PhoneNumberInputSize = 'L' | 'M';
/** Estado visual. Los valores 'Hover' y 'Pressed' quedan obsoletos: se retiran en 4.0; usa los selectores CSS `hover:`/`active:`. */
export type PhoneNumberInputState = 'Default' | 'Hover' | 'Pressed' | 'Error' | 'Success' | 'ReadOnly' | 'Disabled';

export interface CountryOption {
  code: string;        // Prefijo telefónico, ej. "+56"
  name: string;        // Nombre del país, ej. "Chile"
  countryCode: string; // Código ISO de la bandera, ej. "cl"
}

export interface PhoneNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'autoComplete'> {
  /** El autocompletado de credenciales no está disponible para este campo. */
  autoComplete?: never;
  /** El número de teléfono ingresado (sin prefijo de país). */
  value?: string;
  /** El código de país actual (ej. "+56"). */
  code?: string;
  /** Callback disparado al cambiar el código de país. */
  onCodeChange?: (code: string) => void;
  /** Mostrar la bandera del país. */
  hasFlag?: boolean;
  /** Mostrar la flecha de dropdown. */
  hasDropdown?: boolean;
  /** El tamaño del componente (L: 52px de alto, M: 44px de alto). */
  size?: PhoneNumberInputSize;
  /** Estado de interacción forzado. */
  state?: PhoneNumberInputState;
  /** Etiqueta superior del campo. */
  label?: string;
  /** Muestra un asterisco rojo indicando obligatoriedad. */
  isMandatory?: boolean;
  /** Mensaje de ayuda, error o éxito mostrado debajo del input. */
  helpText?: string;
  /** Lista de países para el selector dropdown. */
  countries?: CountryOption[];
  /** Callback disparado al cambiar el número de teléfono. */
  onChange?: (value: string) => void;
}

// ============================================================================
// CONSTANTS & STYLES
// ============================================================================

const DEFAULT_COUNTRIES: CountryOption[] = [
  { code: '+56', name: 'Chile', countryCode: 'CL' },
  { code: '+54', name: 'Argentina', countryCode: 'AR' },
  { code: '+51', name: 'Perú', countryCode: 'PE' },
  { code: '+57', name: 'Colombia', countryCode: 'CO' },
  { code: '+593', name: 'Ecuador', countryCode: 'EC' },
  { code: '+55', name: 'Brasil', countryCode: 'BR' },
  { code: '+52', name: 'México', countryCode: 'MX' },
  { code: '+34', name: 'España', countryCode: 'ES' },
  { code: '+1', name: 'Estados Unidos', countryCode: 'US' },
];

const CONTAINER_SIZE_STYLES: Record<PhoneNumberInputSize, string> = {
  L: 'p-4',
  M: 'px-4 py-3',
};

const STATE_STYLES: Record<PhoneNumberInputState, string> = {
  Default: 'bg-neutral-bg-surface-level-2 border-neutral-border-soft shadow-none',
  Hover: 'bg-neutral-bg-surface-level-2 border-neutral-border-soft shadow-card-overlay-s',
  Pressed: 'bg-neutral-bg-surface-level-2 border-secondary-border-default shadow-card-active-ring',
  Error: 'bg-neutral-bg-surface-level-2 border-danger-border-default shadow-none text-danger-text-default',
  Success: 'bg-neutral-bg-surface-level-2 border-success-border-default shadow-none text-success-text-default',
  ReadOnly: 'bg-neutral-bg-subtle border-neutral-border-action-disabled shadow-none',
  Disabled: 'bg-neutral-bg-action-disabled border-neutral-border-action-disabled shadow-none cursor-not-allowed',
};

const TEXT_STYLES: Record<PhoneNumberInputState, string> = {
  Default: 'text-neutral-text-default',
  Hover: 'text-neutral-text-default',
  Pressed: 'text-neutral-text-default',
  Error: 'text-neutral-text-default',
  Success: 'text-neutral-text-default',
  ReadOnly: 'text-neutral-text-default',
  Disabled: 'text-neutral-text-action-disabled',
};

// ============================================================================
// COMPONENT
// ============================================================================

export const PhoneNumberInput = React.memo(({
  value,
  code = '+56',
  onCodeChange,
  hasFlag = true,
  hasDropdown = true,
  size = 'L',
  state: forcedState = 'Default',
  label,
  isMandatory = false,
  helpText,
  countries = DEFAULT_COUNTRIES,
  onChange,
  className,
  disabled,
  readOnly,
  id,
  ref,
  placeholder,
  ...props
}: PhoneNumberInputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const helpTextId = `${inputId}-help`;
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = React.useState(false);
  const [pressedCountryCode, setPressedCountryCode] = React.useState<string | null>(null);
  const {
    isMounted: isDropdownMounted,
    isClosing: isDropdownClosing,
    transitionStatus,
    surfaceRef,
  } = useDropdownPresence(isOpen && hasDropdown);

  // Compute final state
  let finalState = forcedState;
  if (disabled) finalState = 'Disabled';
  else if (readOnly && finalState !== 'Error' && finalState !== 'Success') finalState = 'ReadOnly';

  const isInvalid = finalState === 'Error';
  const isDisabled = finalState === 'Disabled';
  const isReadOnly = finalState === 'ReadOnly' || readOnly;

  const helpTextState: HelpTextState = isInvalid ? 'Error' : (finalState === 'Success' ? 'Success' : (isDisabled ? 'Disabled' : 'Default'));
  const helpTextPresence = useHelpTextPresence({
    open: Boolean(helpText),
    children: helpText,
    state: helpTextState,
  });

  // Handle clicking outside the dropdown to close it
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getMaxDigits = React.useCallback((countryCode: string) => {
    switch (countryCode) {
      case '+56': // Chile
      case '+51': // Perú
        return 9;
      case '+57': // Colombia
        return 10;
      case '+54': // Argentina
        return 11;
      default:
        return 15;
    }
  }, []);



  const formatLocalNumber = React.useCallback((digits: string, countryCode: string) => {
    const num = digits.replace(/\D/g, '');
    switch (countryCode) {
      case '+56': // Chile
      case '+51': // Perú
        return num.replace(/^(\d{1})(\d{0,4})(\d{0,4})$/, (_, p1, p2, p3) => {
          return [p1, p2, p3].filter(Boolean).join(' ');
        });
      case '+57': // Colombia
        return num.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})$/, (_, p1, p2, p3) => {
          return [p1, p2, p3].filter(Boolean).join(' ');
        });
      case '+54': // Argentina
        return num.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, (_, p1, p2, p3) => {
          return [p1, p2, p3].filter(Boolean).join(' ');
        });
      default:
        return num;
    }
  }, []);

  // Estado local para mantener el país seleccionado
  const [selectedCountry, setSelectedCountry] = React.useState<CountryOption>(() => {
    const val = (value || '').trim();
    if (val.startsWith('+')) {
      const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length);
      const matched = sortedCountries.find((c) => val.startsWith(c.code));
      if (matched) return matched;
    }
    return countries.find((c) => c.code === code) || countries[0];
  });

  // Sincronizar estado cuando el prefijo de las props cambia externamente
  React.useEffect(() => {
    const match = countries.find((c) => c.code === code);
    if (match) {
      setSelectedCountry(match);
    }
  }, [code, countries]);

  const activeCountry = selectedCountry;

  // Al cambiar país en dropdown: reconstruir número completo
  const handleSelectCountry = (country: CountryOption) => {
    setPressedCountryCode(country.code);
    setSelectedCountry(country);
    onCodeChange?.(country.code);
    setIsOpen(false);

    // Extraer número local del valor actual
    let localNum = '';
    const currentVal = (value || '').trim();
    if (currentVal.startsWith('+')) {
      const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length);
      const matched = sortedCountries.find((c) => currentVal.startsWith(c.code));
      if (matched) {
        localNum = currentVal.slice(matched.code.length).replace(/\D/g, '');
      } else {
        localNum = currentVal.replace(/\D/g, '');
      }
    } else {
      localNum = currentVal.replace(/\D/g, '');
    }

    // Limitar y formatear para el nuevo país
    const maxDigits = getMaxDigits(country.code);
    const limited = localNum.slice(0, maxDigits);
    const formatted = formatLocalNumber(limited, country.code);

    const newValue = `${country.code} ${formatted}`.trim();
    onChange?.(newValue);
  };

  const handleToggleDropdown = () => {
    if (!isDisabled && !isReadOnly && hasDropdown) {
      if (!isOpen) setPressedCountryCode(null);
      setIsOpen((prev) => !prev);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;

    // Si se desactiva el dropdown, bloquear edición y borrado del prefijo activo
    if (!hasDropdown) {
      const activeCode = selectedCountry.code;
      if (!rawValue.startsWith(activeCode)) {
        // Si el usuario borra parcialmente el prefijo fijo (p. ej. `+56` → `+5`),
        // restáuralo sin reinterpretar el dígito restante como número local.
        if (rawValue.startsWith('+') && activeCode.startsWith(rawValue)) {
          onChange?.(activeCode);
          return;
        }

        const digitsOnly = rawValue.replace(/\D/g, '');
        const activeCodeDigits = activeCode.replace('+', '');
        let localDigits = digitsOnly;
        if (digitsOnly.startsWith(activeCodeDigits)) {
          localDigits = digitsOnly.slice(activeCodeDigits.length);
        }
        const maxDigits = getMaxDigits(activeCode);
        const limited = localDigits.slice(0, maxDigits);
        const formatted = formatLocalNumber(limited, activeCode);
        onChange?.(`${activeCode} ${formatted}`.trim());
        return;
      }
    }

    // Permitir borrar todo el contenido si tiene el dropdown activo
    if (rawValue === '') {
      onChange?.('');
      return;
    }

    // Si escribe número sin el "+" pero comienza con un código conocido (ej: "569...")
    if (!rawValue.startsWith('+') && rawValue.length > 2) {
      const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length);
      const matched = sortedCountries.find((c) => {
        const codeWithoutPlus = c.code.replace('+', '');
        return rawValue.startsWith(codeWithoutPlus);
      });
      if (matched) {
        rawValue = '+' + rawValue;
      }
    }

    // Si empieza con "+" pero aún no es una coincidencia exacta de país (ej: "+" o "+5")
    if (rawValue.startsWith('+')) {
      const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length);
      const matched = sortedCountries.find((c) => rawValue.startsWith(c.code));
      
      if (!matched) {
        // Permitir edición libre mientras busca coincidencia del prefijo
        onChange?.(rawValue);
        return;
      }

      // Si coincide exactamente con un país
      setSelectedCountry(matched);
      onCodeChange?.(matched.code);
      const localPart = rawValue.slice(matched.code.length);
      const cleanDigits = localPart.replace(/\D/g, '');
      const maxDigits = getMaxDigits(matched.code);
      const limitedDigits = cleanDigits.slice(0, maxDigits);
      const formattedLocal = formatLocalNumber(limitedDigits, matched.code);

      onChange?.(`${matched.code} ${formattedLocal}`.trim());
      return;
    }

    // Si escribe texto plano sin prefijo, dejar que lo edite libremente
    onChange?.(rawValue);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.trim() === '') {
      onChange?.(selectedCountry.code);
    }
    props.onBlur?.(e);
  };

  const getDynamicPlaceholder = React.useCallback((countryCode: string) => {
    switch (countryCode) {
      case '+56': // Chile
      case '+51': // Perú
        return `${countryCode} 9 1234 5678`;
      case '+57': // Colombia
        return `${countryCode} 300 123 4567`;
      case '+54': // Argentina
        return `${countryCode} 9 11 1234 5678`;
      default:
        return `${countryCode} 9 1234 5678`;
    }
  }, []);

  return (
    <div className={cn('flex flex-col gap-1 w-full items-start relative', className)}>
      {/* LABEL SLOT */}
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'flex items-center w-full font-sans font-medium text-base leading-[20px] overflow-hidden',
            (isDisabled || isReadOnly) ? 'text-neutral-text-action-disabled' : 'text-neutral-text-headline'
          )}
        >
          <span className="truncate">{label}</span>
          {isMandatory && (
            <span className="shrink-0 text-danger-text-default ml-1">*</span>
          )}
        </label>
      )}

      {/* INPUT CONTAINER */}
      <div
        ref={dropdownRef}
        className={cn(
          't-input flex items-center w-full relative overflow-visible border border-solid rounded-input-default   group gap-2 self-stretch',
          CONTAINER_SIZE_STYLES[size],
          STATE_STYLES[finalState],
          !isDisabled && !isReadOnly && '[&:hover:not(:focus-within)]:border-neutral-border-soft [&:hover:not(:focus-within)]:shadow-card-overlay-s focus-within:border-secondary-border-default focus-within:shadow-card-active-ring',
          !isDisabled && !isReadOnly && isOpen && 'border-secondary-border-default shadow-card-active-ring',
          !isDisabled && !isReadOnly && 'active:shadow-none',

          (finalState === 'Pressed' || finalState === 'Hover' || isOpen) && 'z-20'
        )}
        data-error={isInvalid ? 'true' : undefined}
      >
        {/* COUNTRY SELECTOR UNIT */}
        <div
          onClick={handleToggleDropdown}
          data-testid="flag-dropdown"
          className={cn(
            'flex items-center gap-1 shrink-0 select-none mr-1',
            (!isDisabled && !isReadOnly && hasDropdown) ? 'cursor-pointer' : 'pointer-events-none'
          )}
        >
          {/* Country Flag */}
          {hasFlag && activeCountry && (
            <CountryFlag
              countryCode={activeCountry.countryCode}
              height={16}
              className={cn(isDisabled && 'mix-blend-luminosity opacity-50')}
            />
          )}

          {/* Dropdown Icon Arrow */}
          {hasDropdown && !isDisabled && !isReadOnly && (
            <ChevronDown
              size={14}
              className={cn(
                'text-neutral-text-soft  ',
                isOpen && 'transform rotate-180'
              )}
            />
          )}
        </div>

        {/* NATIVE PHONE NUMBER INPUT */}
        <input
          id={inputId}
          ref={ref}
          type="tel"
          value={value}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={isDisabled}
          readOnly={isReadOnly}
          placeholder={placeholder ?? getDynamicPlaceholder(selectedCountry.code)}
          aria-invalid={isInvalid}
          aria-describedby={helpText ? helpTextId : undefined}
          className={cn(
            'flex-1 min-w-0 bg-transparent outline-none border-none p-0',
            'font-sans font-normal text-base leading-[20px]',
            TEXT_STYLES[finalState],
            'placeholder:text-neutral-text-soft',
            (isDisabled || isReadOnly) && 'placeholder:text-neutral-text-action-disabled'
          )}
          {...props}
        />

        {/* DROPDOWN OVERLAY LIST */}
        {isDropdownMounted && hasDropdown && (
            <div
              className={cn(
                't-dropdown-surface absolute left-0 right-0 top-full mt-1 z-30 w-full',
              )}
              data-origin="top-left"
              data-open={isOpen ? '' : undefined}
              data-closed={!isOpen ? '' : undefined}
              data-starting-style={transitionStatus === 'starting' ? '' : undefined}
              data-ending-style={isDropdownClosing ? '' : undefined}
              aria-hidden={!isOpen}
              inert={!isOpen ? true : undefined}
              ref={surfaceRef}
            >
              <Dropdown
                size={size}
                variant="Few Results"
                className="w-full"
              >
                {countries.map((c) => (
                  <SelectableField
                    key={c.code}
                    size={size}
                    mainText={`${c.name} (${c.code})`}
                    isActive={isOpen && c.code === code}
                    isPressed={pressedCountryCode === c.code}
                    onClick={() => handleSelectCountry(c)}
                    icon={
                      <CountryFlag countryCode={c.countryCode} height={16} />
                    }
                    className="w-full shrink-0"
                  />
                ))}
              </Dropdown>
            </div>
        )}
      </div>

      {/* HELP TEXT SLOT — CSS GRID TRANSITION */}
      <div
        className="ds-disclosure-text t-stagger"
        data-state={helpText ? 'open' : 'closed'}
        aria-hidden={!helpText}
        ref={helpTextPresence.disclosureRef}
      >
        <div className="ds-disclosure-text__content">
          {helpTextPresence.isMounted && (
            <HelpText id={helpTextId} state={helpTextPresence.state} className="mt-1">
              {helpTextPresence.children}
            </HelpText>
          )}
        </div>
      </div>
    </div>
  );
});

PhoneNumberInput.displayName = 'PhoneNumberInput';
