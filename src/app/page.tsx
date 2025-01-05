import { ConnectWallet } from "./_components/connectWallet";
import { Withdraw } from "./_components/Withdraw"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <ConnectWallet />
      <Withdraw/>
    </main>
  );
}
