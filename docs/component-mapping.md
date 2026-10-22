# Mapeo Figma ↔ código existente

**Fuente Figma:** `vJS4Ozok1qKFmRoBbtlNda`. Los nombres de páginas y Button fueron observados mediante la conexión; las similitudes restantes son **candidatas** por propósito y deben corroborarse visualmente.

| Grupo | Componente Figma | Implementación reutilizada | Estado |
|---|---|---|---|
| Navigation | Breadcrumb | `src/components/Navigation/Breadcrumb/Breadcrumb.tsx` | ADAPT / PROVISIONAL |
| Navigation | Bottom Nav | `src/components/Navigation/BottomNavbar/BottomNavbar.tsx` | ADAPT / PROVISIONAL |
| Navigation | Key Button | `src/components/Actions/KeyButton/KeyButton.tsx` | ADAPT / PROVISIONAL |
| Navigation | Tabs | `src/components/Navigation/Tabs/Tabs.tsx` | ADAPT / PROVISIONAL |
| Navigation | Scrollbar | `—` | PENDING — sin coincidencia funcional confirmada |
| Buttons | Action Icon | `src/components/Actions/ActionIcon/ActionIcon.tsx` | ADAPT / PROVISIONAL |
| Buttons | Button | `src/components/Actions/Button/Button.tsx` | ADAPT / PROVISIONAL |
| Buttons | Icon Button | `src/components/Actions/IconButton/IconButton.tsx` | ADAPT / PROVISIONAL |
| Buttons | Icon Toggle Button | `src/components/Actions/IconToggleButton/IconToggleButton.tsx` | ADAPT / PROVISIONAL |
| Buttons | Toggle Button | `src/components/Actions/ToggleButton/ToggleButton.tsx` | ADAPT / PROVISIONAL |
| Feedback | Badge | `src/components/DataDisplay/Badge/Badge.tsx` | ADAPT / PROVISIONAL |
| Feedback | Chip | `src/components/DataDisplay/Chip/Chip.tsx` | ADAPT / PROVISIONAL |
| Feedback | Loader | `src/components/Feedback/Spinner/Spinner.tsx` | ADAPT / PROVISIONAL |
| Feedback | Tooltip | `src/components/Feedback/Tooltip/Tooltip.tsx` | ADAPT / PROVISIONAL |
| Feedback | Notification | `—` | PENDING — sin coincidencia funcional confirmada |
| Forms | Calendar | `src/components/Forms/Calendar/Calendar.tsx` | ADAPT / PROVISIONAL |
| Forms | Checkbox | `src/components/Forms/Checkbox/Checkbox.tsx` | ADAPT / PROVISIONAL |
| Forms | Date Picker | `src/components/Forms/DatePicker/DatePicker.tsx` | ADAPT / PROVISIONAL |
| Forms | Dropdown | `src/components/Forms/Dropdown/Dropdown.tsx` | ADAPT / PROVISIONAL |
| Forms | Help Text | `src/components/Feedback/HelpText/HelpText.tsx` | ADAPT / PROVISIONAL |
| Forms | Password Input | `src/components/Forms/PasswordInput/PasswordInput.tsx` | ADAPT / PROVISIONAL |
| Forms | Phone Number Input | `src/components/Forms/PhoneNumberInput/PhoneNumberInput.tsx` | ADAPT / PROVISIONAL |
| Forms | Radiobutton | `src/components/Forms/Radiobutton/Radiobutton.tsx` | ADAPT / PROVISIONAL |
| Forms | Search Input | `src/components/Forms/SearchInput/SearchInput.tsx` | ADAPT / PROVISIONAL |
| Forms | Select Input | `src/components/Forms/SelectInput/SelectInput.tsx` | ADAPT / PROVISIONAL |
| Forms | Text Area | `src/components/Forms/TextArea/TextArea.tsx` | ADAPT / PROVISIONAL |
| Forms | Text Input | `src/components/Forms/TextInput/TextInput.tsx` | ADAPT / PROVISIONAL |
| Forms | Toggle | `src/components/Forms/Switch/Switch.tsx` | ADAPT / PROVISIONAL |
| Forms | Upload Input | `—` | PENDING — sin coincidencia funcional confirmada |
| Content | Avatar | `src/components/DataDisplay/Avatar/Avatar.tsx` | ADAPT / PROVISIONAL |
| Content | Avatar Group | `—` | PENDING — sin coincidencia funcional confirmada |
| Content | Body Text | `src/components/DataDisplay/Text/Text.tsx` | ADAPT / PROVISIONAL |
| Content | Divider | `src/components/Layout/Divider/Divider.tsx` | ADAPT / PROVISIONAL |
| Content | Image | `src/components/DataDisplay/Image/Image.tsx` | ADAPT / PROVISIONAL |
| Content | List | `src/components/DataDisplay/ItemList/ItemList.tsx` | ADAPT / PROVISIONAL |
| Content | Swap | `—` | PENDING — sin coincidencia funcional confirmada |
| Content | Toast | `src/components/Feedback/Toast/Toast.tsx` | ADAPT / PROVISIONAL |
| Cards | Image Card | `—` | PENDING — sin coincidencia funcional confirmada |


## Decisiones

- No asumir que `Card` sea un `Image Card`; se requiere confirmar anatomía y uso.
- No asumir que `Toast` equivalga a `Notification` ni que `BottomSheet` sea un `Bottom Nav`.
- `Swap`, `Upload Input`, `Avatar Group`, `Scrollbar`, `Notification` e `Image Card` no están implementados como equivalentes verificados.
- Los componentes fuera de este catálogo no aparecen en las exportaciones públicas ni en las stories generadas.
- Los componentes auxiliares que son dependencias internas pueden existir en el árbol fuente sin figurar en el catálogo público.
- El archivo original fue proporcionado por su autor; no se trasladaron datos, imágenes comerciales, logotipos ni fuentes del ZIP.
