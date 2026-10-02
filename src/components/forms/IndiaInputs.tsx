"use client";

import { useEffect, useId, useRef, useState, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import {
  COUNTRY_CODE,
  INDIAN_STATES,
  PHONE_DIGITS,
  PINCODE_DIGITS,
  amountError,
  cityError,
  emailError,
  formatIndianNumber,
  personNameError,
  phoneDigits,
  phoneError,
  pincodeError,
  vehicleNumberError,
  type PhoneKind,
} from "@/lib/india";
import { amountInWords } from "@/lib/money";

// Inputs that only accept valid Indian values. Each one sets the browser's own
// validity, so a form with an invalid value cannot be submitted, and shows the
// reason under the field once the person has left it (or tried to submit).

type BaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "type"> & {
  value?: string | number | null;
  defaultValue?: string | number | null;
  onValueChange?: (value: string) => void;
  /** Classes of the surrounding form's inputs, so the field matches them. */
  className?: string;
};

function useValidity(error: string | null) {
  const ref = useRef<HTMLInputElement | HTMLSelectElement>(null);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    ref.current?.setCustomValidity(error ?? "");
  }, [error]);
  return {
    ref,
    showError: touched && Boolean(error),
    touch: () => setTouched(true),
  };
}

function FieldError({ id, message }: { id: string; message: string | null }) {
  if (!message) return null;
  return <p id={id} role="alert" className="mt-1 text-xs font-medium text-red-600">{message}</p>;
}

function useFieldValue(props: Pick<BaseProps, "value" | "defaultValue" | "onValueChange">, normalize: (raw: string) => string) {
  const controlled = props.value !== undefined;
  const [inner, setInner] = useState(() => normalize(String(props.defaultValue ?? "")));
  const current = controlled ? normalize(String(props.value ?? "")) : inner;
  const set = (raw: string) => {
    const next = normalize(raw);
    if (!controlled) setInner(next);
    props.onValueChange?.(next);
  };
  return [current, set] as const;
}

const invalidClass = "!border-red-500";

// +91 is fixed in front; only the 10 digits are typed. Pasting "+91 98765 43210" or
// "098765 43210" keeps just the 10 digits. With `name`, the form submits "+919876543210".
export function PhoneInput({ kind = "mobile", required, name, className = "", value, defaultValue, onValueChange, id, placeholder, ...rest }: BaseProps & { kind?: PhoneKind }) {
  const [digits, setDigits] = useFieldValue({ value, defaultValue, onValueChange }, phoneDigits);
  const error = phoneError(digits, { kind, required });
  const { ref, showError, touch } = useValidity(error);
  const errorId = useId();
  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-slate-300 pl-3 pr-2 text-sm font-semibold text-slate-600">{COUNTRY_CODE}</span>
        <input
          {...rest}
          ref={ref as React.RefObject<HTMLInputElement>}
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete={rest.autoComplete ?? "tel-national"}
          required={required}
          value={digits}
          placeholder={placeholder ?? "98765 43210"}
          onChange={(event) => setDigits(event.target.value)}
          onBlur={(event) => { touch(); rest.onBlur?.(event); }}
          onInvalid={touch}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : undefined}
          className={`${className} tabular-nums tracking-wider ${showError ? invalidClass : ""}`}
          style={{ paddingLeft: "3.75rem", paddingRight: "3.5rem" }}
        />
        <span className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs tabular-nums ${digits.length === PHONE_DIGITS && !error ? "font-semibold text-emerald-600" : "text-slate-400"}`}>{digits.length}/{PHONE_DIGITS}</span>
      </div>
      {name && <input type="hidden" name={name} value={digits ? `${COUNTRY_CODE}${digits}` : ""} />}
      <FieldError id={errorId} message={showError ? error : null} />
    </div>
  );
}

export function PincodeInput({ required, className = "", value, defaultValue, onValueChange, placeholder, ...rest }: BaseProps) {
  const [pincode, setPincode] = useFieldValue({ value, defaultValue, onValueChange }, (raw) => raw.replace(/\D/g, "").slice(0, PINCODE_DIGITS));
  const error = pincodeError(pincode, required);
  const { ref, showError, touch } = useValidity(error);
  const errorId = useId();
  return (
    <div>
      <div className="relative">
        <input
          {...rest}
          ref={ref as React.RefObject<HTMLInputElement>}
          type="text"
          inputMode="numeric"
          autoComplete={rest.autoComplete ?? "postal-code"}
          required={required}
          value={pincode}
          placeholder={placeholder ?? "6-digit PIN code"}
          onChange={(event) => setPincode(event.target.value)}
          onBlur={(event) => { touch(); rest.onBlur?.(event); }}
          onInvalid={touch}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : undefined}
          className={`${className} tabular-nums tracking-wider ${showError ? invalidClass : ""}`}
          style={{ paddingRight: "3rem" }}
        />
        <span className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs tabular-nums ${pincode.length === PINCODE_DIGITS && !error ? "font-semibold text-emerald-600" : "text-slate-400"}`}>{pincode.length}/{PINCODE_DIGITS}</span>
      </div>
      <FieldError id={errorId} message={showError ? error : null} />
    </div>
  );
}

// Rupees with up to 2 decimal places. Shows the amount in Indian words underneath.
export function AmountInput({ required = true, allowZero = false, max, showWords = true, className = "", value, defaultValue, onValueChange, placeholder, ...rest }: BaseProps & { allowZero?: boolean; max?: number; showWords?: boolean }) {
  const [amount, setAmount] = useFieldValue({ value, defaultValue, onValueChange }, (raw) => {
    const cleaned = raw.replace(/[^\d.]/g, "");
    const [rupees, ...paise] = cleaned.split(".");
    return paise.length ? `${rupees.slice(0, 9)}.${paise.join("").slice(0, 2)}` : rupees.slice(0, 9);
  });
  const error = amountError(amount, { required, allowZero, max });
  const { ref, showError, touch } = useValidity(error);
  const errorId = useId();
  const number = Number(amount);
  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-semibold text-slate-600">₹</span>
        <input
          {...rest}
          ref={ref as React.RefObject<HTMLInputElement>}
          type="text"
          inputMode="decimal"
          required={required}
          value={amount}
          placeholder={placeholder ?? "0"}
          onChange={(event) => setAmount(event.target.value)}
          onBlur={(event) => { touch(); rest.onBlur?.(event); }}
          onInvalid={touch}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : undefined}
          className={`${className} tabular-nums ${showError ? invalidClass : ""}`}
          style={{ paddingLeft: "1.75rem" }}
        />
      </div>
      {showError
        ? <FieldError id={errorId} message={error} />
        : showWords && amount && !error && <p className="mt-1 text-xs text-slate-500">₹{formatIndianNumber(number)} · {amountInWords(number)}</p>}
    </div>
  );
}

// Any text input with one of the shared checks (email, person's name, city...).
function CheckedInput({ check, type = "text", className = "", value, defaultValue, onValueChange, ...rest }: BaseProps & { check: (value: string) => string | null; type?: string }) {
  const [text, setText] = useFieldValue({ value, defaultValue, onValueChange }, (raw) => raw);
  const error = check(text);
  const { ref, showError, touch } = useValidity(error);
  const errorId = useId();
  return (
    <div>
      <input
        {...rest}
        ref={ref as React.RefObject<HTMLInputElement>}
        type={type}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={(event) => { touch(); rest.onBlur?.(event); }}
        onInvalid={touch}
        aria-invalid={showError}
        aria-describedby={showError ? errorId : undefined}
        className={`${className} ${showError ? invalidClass : ""}`}
      />
      <FieldError id={errorId} message={showError ? error : null} />
    </div>
  );
}

export function EmailInput(props: BaseProps) {
  return <CheckedInput autoComplete="email" maxLength={254} {...props} type="email" check={(value) => emailError(value, props.required)} />;
}

export function NameInput(props: BaseProps) {
  return <CheckedInput autoComplete="name" maxLength={80} {...props} check={(value) => personNameError(value, Boolean(props.required))} />;
}

export function CityInput(props: BaseProps) {
  return <CheckedInput autoComplete="address-level2" maxLength={60} {...props} check={(value) => cityError(value, props.required)} />;
}

export function TextInput({ min = 2, max = 120, label, ...props }: BaseProps & { min?: number; max?: number; label?: string }) {
  return (
    <CheckedInput
      maxLength={max}
      {...props}
      check={(value) => {
        const text = value.trim();
        if (!text) return props.required ? `${label ?? "This field"} is required.` : null;
        if (text.length < min) return `${label ?? "This"} is too short (at least ${min} characters).`;
        return null;
      }}
    />
  );
}

export function VehicleNumberInput(props: BaseProps) {
  return (
    <CheckedInput
      maxLength={16}
      placeholder="e.g. MH 12 AB 1234"
      {...props}
      className={`${props.className ?? ""} uppercase`}
      check={(value) => vehicleNumberError(value, Boolean(props.required))}
    />
  );
}

export function StateSelect({ className = "", value, defaultValue, onValueChange, required, ...rest }: Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "defaultValue" | "onChange"> & { value?: string | null; defaultValue?: string | null; onValueChange?: (value: string) => void }) {
  const [state, setState] = useFieldValue({ value, defaultValue, onValueChange }, (raw) => raw);
  // A state saved before this list existed stays selectable until it is changed.
  const legacy = state && !(INDIAN_STATES as readonly string[]).includes(state) ? state : null;
  return (
    <select {...rest} required={required} value={state} onChange={(event) => setState(event.target.value)} className={className}>
      <option value="">Select state / UT</option>
      {legacy && <option value={legacy}>{legacy} (please choose again)</option>}
      {INDIAN_STATES.map((name) => <option key={name} value={name}>{name}</option>)}
    </select>
  );
}
