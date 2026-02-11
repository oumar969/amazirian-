import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function useLoginViewModel() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo =
    ((location.state as LocationState | null)?.from?.pathname as string | undefined) ??
    "/";

  const canSubmit = username.trim().length > 0 && password.trim().length > 0;

  const submit = useCallback(async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await login(username, password);
      navigate(redirectTo, { replace: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Login fejlede.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [login, navigate, password, redirectTo, username]);

  return useMemo(
    () => ({
      username,
      setUsername,
      password,
      setPassword,
      error,
      isSubmitting,
      canSubmit,
      submit,
    }),
    [canSubmit, error, isSubmitting, password, submit, username],
  );
}
