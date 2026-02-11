import { useLoginViewModel } from "../features/auth/viewmodels/useLoginViewModel";

export default function Login() {
  const vm = useLoginViewModel();

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void vm.submit();
        }}
      >
        <label className="block mb-2 font-semibold">Brugernavn</label>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-4"
          value={vm.username}
          onChange={(e) => vm.setUsername(e.target.value)}
          autoComplete="username"
        />

        <label className="block mb-2 font-semibold">Adgangskode</label>
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          value={vm.password}
          onChange={(e) => vm.setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {vm.error && (
          <p className="text-red-600 mb-3" role="alert">
            {vm.error}
          </p>
        )}

        <button
          type="submit"
          disabled={!vm.canSubmit || vm.isSubmitting}
          className="bg-blue-600 text-white p-2 w-full disabled:opacity-50"
        >
          {vm.isSubmitting ? "Logger ind..." : "Log In"}
        </button>

        <p className="text-sm text-gray-500 mt-3">
          Demo: enhver kombination virker (localStorage).
        </p>
      </form>
    </div>
  );
}
