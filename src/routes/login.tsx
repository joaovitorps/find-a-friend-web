import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, HeartHandshake, LogIn } from "lucide-react";
import {
  type HTMLInputTypeAttribute,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { AppShell } from "@/components/app-shell";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStoredOrgId, login, saveOrgSession } from "@/lib/auth";

interface LoginForm {
  email: string;
  password: string;
}

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

const initialForm: LoginForm = {
  email: "",
  password: "",
};

const fieldOrder: Array<keyof LoginForm> = ["email", "password"];

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (getStoredOrgId()) {
      void navigate({ to: "/pets/mine" });
    }
  }, [navigate]);

  function updateField(field: keyof LoginForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateLoginForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    setLoading(true);
    setServerError("");

    login({
      email: form.email.trim(),
      password: form.password,
    })
      .then((response) => {
        if (response.ok) {
          saveOrgSession(response.data);
          navigate({ to: "/pets/mine" });
        } else {
          setServerError(response.error ?? "Email ou senha inválidos.");
        }
      })
      .catch(() => {
        setServerError("Erro ao conectar ao servidor.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:py-12">
        <BackButton />

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <p className="font-black text-[#f15156] text-sm uppercase tracking-wide">
              Área da organização
            </p>
            <h1 className="mt-3 max-w-3xl font-black text-5xl text-[#0d3b66] leading-[0.95] sm:text-6xl">
              Entre para cuidar dos seus pets publicados
            </h1>
            <p className="mt-4 max-w-2xl font-semibold text-[#0d3b66]/65 text-base leading-7">
              Acesse sua organização para cadastrar pets, publicar rascunhos e acompanhar os animais
              disponíveis para adoção.
            </p>
          </div>

          <div className="rounded-xl bg-[#f15156] p-5 text-white">
            <HeartHandshake className="size-8 text-[#f4d35e]" />
            <p className="mt-5 font-black text-3xl leading-none">Login da ONG</p>
            <p className="mt-2 font-bold text-sm text-white/85 leading-6">
              Use o mesmo email e senha cadastrados para sua organização.
            </p>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl rounded-xl border border-[#0d3b66]/10 bg-white p-4 shadow-sm sm:p-6 lg:p-8"
          noValidate
        >
          <FormSection icon={<LogIn className="size-5" />} title="Acesso">
            <div className="grid gap-4">
              <TextField
                id="email"
                label="Email"
                type="email"
                placeholder="nome@email.com"
                value={form.email}
                error={errors.email}
                onChange={(value) => updateField("email", value)}
              />
              <PasswordTextField
                id="password"
                label="Senha"
                value={form.password}
                error={errors.password}
                visible={showPassword}
                onToggle={() => setShowPassword((current) => !current)}
                onChange={(value) => updateField("password", value)}
              />
            </div>
          </FormSection>

          {serverError ? (
            <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 font-bold text-red-600 text-sm">
              {serverError}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/register"
              className="inline-flex h-12 items-center justify-center rounded-full px-5 font-black text-[#0d3b66] text-sm transition hover:bg-[#0d3b66]/5"
            >
              Cadastrar minha organização
            </Link>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-full bg-[#0d3b66] px-7 font-black text-sm text-white hover:bg-[#0d3b66]/90"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>
      </main>
    </AppShell>
  );
}

function FormSection({
  icon,
  title,
  children,
}: {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2 text-[#0d3b66]">
        {icon ? <span className="text-[#f15156]">{icon}</span> : null}
        <h2 className="font-black text-[#0d3b66]/55 text-sm uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function TextField({
  id,
  label,
  value,
  error,
  placeholder,
  type = "text",
  onChange,
}: {
  id: keyof LoginForm;
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2" htmlFor={id}>
      <span className="font-black text-[#0d3b66]/55 text-xs uppercase">{label}</span>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-xl border-[#0d3b66]/15 bg-[#fff7ed] px-4 font-bold text-[#0d3b66] text-sm placeholder:text-[#0d3b66]/35 focus-visible:ring-2 focus-visible:ring-[#0d3b66]/25 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20"
      />
      {error ? (
        <span id={`${id}-error`} className="font-bold text-red-500 text-sm">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function PasswordTextField({
  id,
  label,
  value,
  error,
  visible,
  onToggle,
  onChange,
}: {
  id: "password";
  label: string;
  value: string;
  error?: string;
  visible: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2" htmlFor={id}>
      <span className="font-black text-[#0d3b66]/55 text-xs uppercase">{label}</span>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
          placeholder="***********"
          className="h-12 rounded-[8px] border-[#0d3b66]/15 bg-[#fff7ed] px-4 pr-12 font-bold text-[#0d3b66] text-sm placeholder:text-[#0d3b66]/35 focus-visible:ring-2 focus-visible:ring-[#0d3b66]/25 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-4 -translate-y-1/2 text-[#0d3b66]/45 transition hover:text-[#0d3b66]"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          onClick={onToggle}
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </Button>
      </div>
      {error ? (
        <span id={`${id}-error`} className="font-bold text-red-500 text-sm">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function focusFirstError(errors: LoginErrors) {
  const firstInvalidField = fieldOrder.find((field) => errors[field]);

  if (!firstInvalidField) return;

  window.requestAnimationFrame(() => {
    const input = document.getElementById(firstInvalidField);

    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus({ preventScroll: true });
  });
}

function validateLoginForm(form: LoginForm) {
  const errors: LoginErrors = {};

  if (!form.email.trim()) errors.email = "Email é obrigatório.";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Email inválido.";
  }
  if (!form.password) errors.password = "Senha é obrigatória.";

  return errors;
}
