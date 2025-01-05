import { z } from "zod";

import { encodeFunctionData } from "viem";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  henloContract,
  HENLO_ABI,
  HENLO_CONTRACT_ADDRESS,
  getWalletClient,
} from "~/server/api/contracts/henlo";
import { formatUnits } from "viem";

export const withdrawRouter = createTRPCRouter({
  executeWithdraw: publicProcedure
    .input(
      z.object({
        toAddress: z.string(),
        fromAddress: z.string(),
        amount: z.number(),
      }),
    )
    .query(async ({ input }) => {
      try {
        console.log("validating inputs...");

        if (input.fromAddress === input.toAddress) {
          return {
            success: false,
            error: "fromAddress cannot be identical to toAddress",
          };
        }

        if (
          input.fromAddress === ""
          // || !/^0x[a-fA-F0-9]{40}$/.test(input.fromAddress)
        ) {
          return {
            success: false,
            error: `fromAddress: ${input.fromAddress} is invalid`,
          };
        }

        if (
          input.toAddress === ""
          //|| !/^0x[a-fA-F0-9]{40}$/.test(input.toAddress)
        ) {
          return {
            success: false,
            error: `toAddress: ${input.toAddress} is invalid`,
          };
        }

        if (input.amount <= 0) {
          return {
            success: false,
            error: `amount is invalid or zero: ${input.fromAddress}`,
          };
        }

        console.log("inputs validated!");

        console.log(
          "\n performing withdraw... \n from address: ",
          input.fromAddress,
          "to address: ",
          input.toAddress,
          "with amount: ",
          input.amount,
        );

        //@dev
        //both examples,
        //getContract.write()... and walletClient.writeContract()...
        //do not work, "account not found"
        //.. as you can see from the logs in henlo.ts, the walletClient account is defined
        //some weird viem bug, I'm not sure...

        //const transaction = {
        //  account: input.fromAddress,
        //  to: HENLO_CONTRACT_ADDRESS,
        //  data: encodeFunctionData({
        //    abi: HENLO_ABI,
        //    functionName: "transfer",
        //    args: [input.toAddress, input.amount],
        //  }),
        //};

        //const walletClient = getWalletClient(input.fromAddress);
        //await walletClient.writeContract({
        //  address: HENLO_CONTRACT_ADDRESS,
        //  abi: HENLO_ABI,
        //  functionName: "transfer",
        //  args: [input.toAddress, input.amount],
        //  account: input.fromAddress,
        //});

        const contract = henloContract(input.fromAddress);
        await contract.write.transfer([input.toAddress, input.amount]);

        console.log("response success");
        console.log("input data: \n", input);
        return {
          success: true,
          data: input,
        };
      } catch (error) {
        console.error("\n Error withdrawing with error:", error);
        return {
          success: false,
          error: error,
        };
      }
    }),
});
