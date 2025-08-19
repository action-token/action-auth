import { ShadowWrapper } from './ShadowWrapper';
import { AuthModal } from './AuthModal';
import type { createAuthClient } from "better-auth/react";

// This will be replaced with the actual CSS content during build
import shadowStyles from '../styles/shadow-styles.css?inline';

interface AuthWidgetProps {
  open: boolean;
  onClose: () => void;
  client?: ReturnType<typeof createAuthClient>;
  className?: string;
}

export function AuthWidget({ open, onClose, client, className }: AuthWidgetProps) {
  if (!open) return null;

  return (
    <ShadowWrapper css={shadowStyles} className={className}>
      <div className="auth-modal">
        <AuthModal open={true} onClose={onClose} client={client} />
      </div>
    </ShadowWrapper>
  );
}
