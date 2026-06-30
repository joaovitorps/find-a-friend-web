import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, Eye, EyeOff, HeartHandshake } from "lucide-react";
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
import { getStoredOrgId, register } from "@/lib/auth";

interface RegisterForm {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  number: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  password: string;
  confirmPassword: string;
}

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

const initialForm: RegisterForm = {
  name: "",
  ownerName: "",
  email: "",
  phone: "",
  number: "",
  street: "",
  neighborhood: "",
  city: "",
  state: "",
  password: "",
  confirmPassword: "",
};

const fieldOrder: Array<keyof RegisterForm> = [
  "name",
  "ownerName",
  "email",
  "phone",
  "street",
  "number",
  "neighborhood",
  "city",
  "state",
  "password",
  "confirmPassword",
];

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (getStoredOrgId()) {
      void navigate({ to: "/pets/mine" });
    }
  }, [navigate]);

  function updateField(field: keyof RegisterForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateRegisterForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    setLoading(true);
    setServerError("");

    register({
      name: form.name.trim(),
      ownerName: form.ownerName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      address: {
        number: form.number.trim(),
        street: form.street.trim(),
        neighborhood: form.neighborhood.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
      },
    })
      .then((response) => {
        if (response.ok) {
          navigate({ to: "/login" });
        } else {
          setServerError(
            response.error ??
              "Erro ao cadastrar organização. Verifique os dados e tente novamente.",
          );
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
              Cadastro de organização
            </p>
            <h1 className="mt-3 max-w-3xl font-black text-5xl text-[#0d3b66] leading-[0.95] sm:text-6xl">
              Prepare sua ONG para encontrar novos lares
            </h1>
            <p className="mt-4 max-w-2xl font-semibold text-[#0d3b66]/65 text-base leading-7">
              Cadastre os dados da organização para publicar pets, gerenciar rascunhos e acompanhar
              suas adoções.
            </p>
          </div>

          <div className="rounded-xl bg-[#f15156] p-5 text-white">
            <HeartHandshake className="size-8 text-[#f4d35e]" />
            <p className="mt-5 font-black text-3xl leading-none">Perfil da ONG</p>
            <p className="mt-2 font-bold text-sm text-white/85 leading-6">
              Use um email ativo. Ele será usado para acessar a área da organização.
            </p>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[#0d3b66]/10 bg-white p-4 shadow-sm sm:p-6 lg:p-8"
          noValidate
        >
          <div className="flex flex-col gap-8">
            <FormSection icon={<Building2 className="size-5" />} title="Dados da organização">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  id="name"
                  label="Nome da organização"
                  placeholder="Amigos do Parque"
                  value={form.name}
                  error={errors.name}
                  onChange={(value) => updateField("name", value)}
                />
                <TextField
                  id="ownerName"
                  label="Nome do responsável"
                  placeholder="Antônio Bandeira"
                  value={form.ownerName}
                  error={errors.ownerName}
                  onChange={(value) => updateField("ownerName", value)}
                />
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="nome@email.com"
                  value={form.email}
                  error={errors.email}
                  onChange={(value) => updateField("email", value)}
                />
                <TextField
                  id="phone"
                  label="Whatsapp"
                  type="tel"
                  placeholder="81912345678"
                  value={form.phone}
                  error={errors.phone}
                  onChange={(value) => updateField("phone", value)}
                />
              </div>
            </FormSection>

            <FormSection title="Endereço">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_140px]">
                <TextField
                  id="street"
                  label="Rua"
                  placeholder="Rua do Meio"
                  value={form.street}
                  error={errors.street}
                  onChange={(value) => updateField("street", value)}
                />
                <TextField
                  id="number"
                  label="Número"
                  placeholder="123"
                  value={form.number}
                  error={errors.number}
                  onChange={(value) => updateField("number", value)}
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(180px,0.6fr)_96px]">
                <TextField
                  id="neighborhood"
                  label="Bairro"
                  placeholder="Boa Vista"
                  value={form.neighborhood}
                  error={errors.neighborhood}
                  onChange={(value) => updateField("neighborhood", value)}
                />
                <TextField
                  id="city"
                  label="Cidade"
                  placeholder="Recife"
                  value={form.city}
                  error={errors.city}
                  onChange={(value) => updateField("city", value)}
                />
                <TextField
                  id="state"
                  label="UF"
                  placeholder="PE"
                  value={form.state}
                  error={errors.state}
                  maxLength={2}
                  onChange={(value) => updateField("state", value.toUpperCase())}
                />
              </div>
            </FormSection>

            <FormSection title="Acesso">
              <div className="grid gap-4 md:grid-cols-2">
                <PasswordTextField
                  id="password"
                  label="Senha"
                  value={form.password}
                  error={errors.password}
                  visible={showPassword}
                  onToggle={() => setShowPassword((current) => !current)}
                  onChange={(value) => updateField("password", value)}
                />
                <PasswordTextField
                  id="confirmPassword"
                  label="Confirmar senha"
                  value={form.confirmPassword}
                  error={errors.confirmPassword}
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((current) => !current)}
                  onChange={(value) => updateField("confirmPassword", value)}
                />
              </div>
            </FormSection>
          </div>

          {serverError ? (
            <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 font-bold text-red-600 text-sm">
              {serverError}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/login"
              className="inline-flex h-12 items-center justify-center rounded-full px-5 font-black text-[#0d3b66] text-sm transition hover:bg-[#0d3b66]/5"
            >
              Já possui conta?
            </Link>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-full bg-[#0d3b66] px-7 font-black text-sm text-white hover:bg-[#0d3b66]/90"
            >
              {loading ? "Cadastrando..." : "Cadastrar organização"}
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
  maxLength,
  onChange,
}: {
  id: keyof RegisterForm;
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  maxLength?: number;
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
        maxLength={maxLength}
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
  id: "password" | "confirmPassword";
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
          className="h-12 rounded-xl border-[#0d3b66]/15 bg-[#fff7ed] px-4 pr-12 font-bold text-[#0d3b66] text-sm placeholder:text-[#0d3b66]/35 focus-visible:ring-2 focus-visible:ring-[#0d3b66]/25 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20"
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

function focusFirstError(errors: RegisterErrors) {
  const firstInvalidField = fieldOrder.find((field) => errors[field]);

  if (!firstInvalidField) return;

  window.requestAnimationFrame(() => {
    const input = document.getElementById(firstInvalidField);

    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus({ preventScroll: true });
  });
}

function validateRegisterForm(form: RegisterForm) {
  const errors: RegisterErrors = {};

  if (!form.name.trim()) errors.name = "Nome da organização é obrigatório.";
  if (!form.ownerName.trim()) {
    errors.ownerName = "Nome do responsável é obrigatório.";
  }
  if (!form.email.trim()) errors.email = "Email é obrigatório.";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Email inválido.";
  }
  if (!form.phone.trim()) errors.phone = "Whatsapp é obrigatório.";
  if (!form.street.trim()) errors.street = "Rua é obrigatória.";
  if (!form.number.trim()) errors.number = "Número é obrigatório.";
  if (!form.neighborhood.trim()) errors.neighborhood = "Bairro é obrigatório.";
  if (!form.city.trim()) errors.city = "Cidade é obrigatória.";
  if (!form.state.trim()) errors.state = "UF é obrigatória.";
  if (form.state && form.state.length !== 2) errors.state = "Use 2 letras.";
  if (!form.password) errors.password = "Senha é obrigatória.";
  if (form.password && form.password.length < 6) {
    errors.password = "Mínimo de 6 caracteres.";
  }
  if (!form.confirmPassword) {
    errors.confirmPassword = "Confirmação de senha é obrigatória.";
  }
  if (form.confirmPassword && form.confirmPassword !== form.password) {
    errors.confirmPassword = "As senhas não conferem.";
  }

  return errors;
}
