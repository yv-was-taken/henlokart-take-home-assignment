"use client";

import { useForm, submitHandler } from "react-hook-form";
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

type FormInputs = {
  toAddress: string;
  amount: number;
};

export const Withdraw = () => {
  const { register, handleSubmit, watch } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  //@TODO remove
  //console.log("amount change", watch("amount"))
  //console.log("toAddress change", watch("toAddress"))

  //@TODO remove come submission, may need parsing
  //const handleToAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //  // Only allow valid hex characters and limit to ethereum address format
  //  const value = e.target.value;
  //  if (value === "" || /^0x[a-fA-F0-9]{0,40}$/.test(value)) {
  //    (value);
  //  }
  //};

  //const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //  // Only allow numbers and decimals
  //  const value = e.target.value;
  //  if (value === "" || /^\d*\.?\d*$/.test(value)) {
  //    setAmount(value);
  //  }
  //};

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
              <Label htmlFor="name" className="text-right">
                To:
              </Label>
              <Input
                id="to"
                defaultValue="0x..."
                className="col-span-3"
                {...register("toAddress")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                defaultValue="0"
                className="col-span-3"
                {...register("amount")}
              />
            </div>
            <DialogFooter>
              <input type="submit" />
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
