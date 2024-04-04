const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-screen h-screen overflow-hidden bg-zinc-900 flex justify-center align-middle items-center">
        {children}
    </main>
  );
};

export default AuthenticationLayout;
