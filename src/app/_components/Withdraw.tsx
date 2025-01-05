"use client";
import { useAccount } from "wagmi";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { api } from "~/trpc/react";

type FormInputs = {
  toAddress: string;
  amount: number;
};

export const Withdraw = () => {
  const { register, handleSubmit } = useForm<FormInputs>();
  const { address, isConnected } = useAccount();
  const [isSubmit, setIsSubmit] = useState(false);
  const [formData, setFormData] = useState<FormInputs>({
    toAddress: "",
    amount: 0,
  });

  const onSubmit: SubmitHandler<FormInputs> = (submitData) => {
    console.log(submitData);
    setIsSubmit(true);
    setFormData(submitData);
  };

  const { data: withdrawResponse } = api.withdraw.executeWithdraw.useQuery(
    {
      fromAddress: address ?? "",
      toAddress: formData.toAddress,
      amount: formData.amount,
    },
    {
      enabled:
        isConnected &&
        !!address &&
        isSubmit &&
        !!formData.toAddress &&
        formData.amount > 0,
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
              <Button type="submit">Submit</Button>
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
