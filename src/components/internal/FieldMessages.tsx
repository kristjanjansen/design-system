import { Text } from "../Text/Text.tsx";
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
        <Text
          as="span"
          size="sm"
          id={errorId}
          aria-live="polite"
          className="ds-field-messages-error"
        >
          {error}
        </Text>
      )}
      {description && !error && (
        <Text as="span" size="sm" id={descriptionId} className="ds-field-messages-description">
          {description}
        </Text>
      )}
    </div>
  );
}
