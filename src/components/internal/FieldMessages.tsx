import "./FieldMessages.css";

export interface FieldMessagesProps {
  error?: string;
  description?: string;
  errorId?: string;
  descriptionId?: string;
}

export function FieldMessages({ error, description, errorId, descriptionId }: FieldMessagesProps) {
  if (!error && !description) return null;

  return (
    <div className="ds-field-messages">
      {error && (
        <span id={errorId} aria-live="polite" className="ds-field-messages-error">
          {error}
        </span>
      )}
      {description && !error && (
        <span id={descriptionId} className="ds-field-messages-description">
          {description}
        </span>
      )}
    </div>
  );
}
