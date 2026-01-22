import { LoginForm } from "@/features/auth/components/login-form";

export default function Home() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
