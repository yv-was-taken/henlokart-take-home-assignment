"use client";
import { useAccount } from "wagmi";
import {
  createWalletClient,
  custom,
  http,
  getContract,
  encodeFunctionData,
  Account,
} from "viem";
import { base } from "viem/chains";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HENLO_CONTRACT_ADDRESS, HENLO_ABI } from "~/app/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

type FormInputs = {
  toAddress: string;
  amount: number;
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const Withdraw = () => {
  const { register, handleSubmit } = useForm<FormInputs>();
  const { address, isConnected } = useAccount();
  const [isSubmit, setIsSubmit] = useState(false);
  const [signature, setSignature] = useState<`0x${string}` | null>(null);
  const [walletClient, setWalletClient] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormInputs>({
    toAddress: "",
    amount: 0,
  });

  useEffect(() => {
    if (isConnected && address && window.ethereum) {
      try {
        const client = createWalletClient({
          account: address as `0x${string}`,
          chain: base,
          transport: custom(window.ethereum),
        });
        setWalletClient(client);
        setError(null);
      } catch (err) {
        setError("Failed to initialize wallet client");
        console.error("Wallet client initialization error:", err);
      }
    }
  }, [address, isConnected]);

  const onSubmit: SubmitHandler<FormInputs> = async (submitData) => {
    if (!walletClient || !address) {
      setError("Wallet not connected");
      return;
    }

    try {
      setFormData(submitData);
      setError(null);

      const request = await walletClient.prepareTransactionRequest({
        account: address as `0x${string}`,
        to: HENLO_CONTRACT_ADDRESS,
        data: encodeFunctionData({
          abi: HENLO_ABI,
          functionName: "transfer",
          args: [
            submitData.toAddress as `0x${string}`,
            submitData.amount.toString(),
          ],
        }),
      });

      const hash = await walletClient.sendTransaction(request);
      setSignature(hash);
      setIsSubmit(true);
    } catch (error) {
      const walletClientAddress = walletClient.account.address;
      console.log("MEOW MEOW MEOW");
      console.log(walletClientAddress === address);
      console.error("Transaction preparation failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Transaction preparation failed",
      );
    }
  };

  const { data: withdrawResponse } = api.withdraw.executeWithdraw.useQuery(
    {
      fromAddress: address ?? "",
      toAddress: formData.toAddress,
      amount: formData.amount,
      signature: signature,
    },
    {
      enabled:
        isConnected &&
        !!address &&
        isSubmit &&
        !!formData.toAddress &&
        formData.amount > 0 &&
        !!signature,
    },
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Withdraw</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Tokens</DialogTitle>
          <DialogDescription>Withdraw HENLO to an address.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <div className="rounded-md border border-red-300 bg-red-100 p-2 font-medium text-red-500">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="toAddress" className="text-right">
                To:
              </Label>
              <Input
                id="toAddress"
                defaultValue="0x..."
                className="col-span-3"
                {...register("toAddress")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                defaultValue="0"
                className="col-span-3"
                {...register("amount", { valueAsNumber: true })}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!isConnected || !walletClient}>
                {!isConnected ? "Connect Wallet" : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </div>
        {withdrawResponse?.error && (
          <div className="rounded-md border border-red-300 bg-red-100 p-2 font-medium text-red-500">
            {withdrawResponse.error.toString()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
