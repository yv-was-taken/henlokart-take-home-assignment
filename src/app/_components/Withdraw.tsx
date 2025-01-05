"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";

export const Withdraw = () => {


  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const handleToAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow valid hex characters and limit to ethereum address format
    const value = e.target.value;
    if (value === "" || /^0x[a-fA-F0-9]{0,40}$/.test(value)) {
      setToAddress(value);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimals
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Withdraw</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Tokens</DialogTitle>
          <DialogDescription>
            Withdraw HENLO to an address.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              To:  
            </Label>
            <Input id="to" value={toAddress} onChange={handleToAddressChange} placeholder="0x..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Amount 
            </Label>
            <Input id="amount" value={amount} onChange={handleAmountChange} placeholder="0" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Withdraw</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

