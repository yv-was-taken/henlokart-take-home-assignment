"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createWalletClient, custom, encodeFunctionData } from "viem";
import { base } from "viem/chains";
import { useForm, type SubmitHandler } from "react-hook-form";

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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HENLO_CONTRACT_ADDRESS, HENLO_ABI } from "~/app/constants";
import { api } from "~/trpc/react";

type FormInputs = {
  toAddress: string;
  amount: number;
};

type WalletClient = ReturnType<typeof createWalletClient>;

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
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [formData, setFormData] = useState<FormInputs>({
    toAddress: "",
    amount: 0,
  });

  useEffect(() => {
    if (!isConnected || !address || !window.ethereum) return;

    const client = createWalletClient({
      account: address,
      chain: base,
      transport: custom(window.ethereum),
    });
    setWalletClient(client);
  }, [address, isConnected]);

  const onSubmit: SubmitHandler<FormInputs> = (submitData) => {
    if (!walletClient || !address) return;
setFormData(submitData);
setIsValidating(true);
setIsSubmit(true);
  };

  const { data: withdrawResponse } = api.withdraw.executeWithdraw.useQuery(
    {
      fromAddress: address ?? "",
      toAddress: formData.toAddress,
      amount: formData.amount,
    },
    {
      enabled: isConnected && !!address && isSubmit && !!formData.toAddress && isValidating,
    },
  );

  
  useEffect(() => {
    const sendTransaction = async () => {
      // If we got a response from the server (success or error), stop validating
      if (withdrawResponse) {
        if (!withdrawResponse.success) {
          setIsValidating(false);
          return;
        }

          
          if (isValidating && walletClient && address && formData) {
          try {
            const request = await walletClient.prepareTransactionRequest({
              account: address,
              to: HENLO_CONTRACT_ADDRESS,
              data: encodeFunctionData({
                abi: HENLO_ABI,
                functionName: "transfer",
                args: [formData.toAddress as `0x${string}`, formData.amount.toString()],
              }),
            });
          
            const hash = await walletClient.sendTransaction(request);
            setSignature(hash);
          } catch (error) {
            console.error("Transaction failed:", error);
          } finally {
        setIsValidating(false);
                  }
                }
      }
    };

    sendTransaction();
  }, [withdrawResponse, walletClient, isValidating, address, formData]);

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
          {!isConnected && (
            <div className="rounded-md border border-red-300 bg-red-100 p-2 font-medium text-red-500">
              Wallet not connected
            </div>
          )}
          {withdrawResponse?.error && (
            <div className="rounded-md border border-red-300 bg-red-100 p-2 font-medium text-red-500">
              <span>Error: </span>
              {withdrawResponse.error instanceof Error
                ? withdrawResponse.error.message
                : typeof withdrawResponse.error === "object" && withdrawResponse.error !== null
                ? JSON.stringify(withdrawResponse.error)
                : String(withdrawResponse.error)}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Button
                type="submit"
                disabled={!isConnected || !walletClient || isValidating}
              >
                {!isConnected
                  ? "Connect Wallet"
                  : isValidating
                    ? "Processing..."
                    : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </div>
        
      </DialogContent>
    </Dialog>
  );
};
