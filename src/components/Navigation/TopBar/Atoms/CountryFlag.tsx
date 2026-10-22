import * as React from 'react';
import { CL, AR, BR, CO, EC, PE, MX, US, ES, CR, SV, GT, HN, NI, PY, PR, DO, UY } from 'country-flag-icons/react/3x2';

const FLAG_MAP: Record<string, React.FC<{ className?: string }>> = {
  cl: CL,
  ar: AR,
  br: BR,
  co: CO,
  ec: EC,
  pe: PE,
  mx: MX,
  us: US,
  es: ES,
  cr: CR,
  sv: SV,
  gt: GT,
  hn: HN,
  ni: NI,
  py: PY,
  pr: PR,
  do: DO,
  uy: UY,
};

export interface CountryFlagProps {
  countryCode: string;
  height?: number;
  className?: string;
}

/**
 * CountryFlag — Renderiza la bandera de un país como SVG vectorial
 * con bordes suaves (rounded-sm) para integrarse en la TopBar.
 * Soporta los países de operación de Ávila (Chile, Argentina, Brasil, etc.)
 */
export const CountryFlag = ({
  countryCode,
  height = 16,
  className,
}: CountryFlagProps) => {
  const code = countryCode.toLowerCase();
  const FlagComponent = FLAG_MAP[code];

  if (!FlagComponent) {
    // Fallback silencioso para códigos no mapeados
    return null;
  }

  return (
    <span
      className={
        'inline-flex rounded-sm overflow-hidden shrink-0 leading-none ' + (className || '')
      }
      style={{ height }}
    >
      <FlagComponent className="h-full w-auto" />
    </span>
  );
};

CountryFlag.displayName = 'CountryFlag';
