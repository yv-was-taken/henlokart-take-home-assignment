import { ConnectWallet } from "./_components/connectWallet";
import { Withdraw } from "./_components/Withdraw";
import { EthPrice } from "./_components/EthPrice";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <EthPrice />
      <div className="flex gap-4">
        <ConnectWallet />
        <Withdraw />
      </div>
    </main>
  );
}
