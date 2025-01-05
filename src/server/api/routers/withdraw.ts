import { z } from "zod";

import { isAddress } from "viem";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

        if (input.fromAddress === "" || !isAddress(input.fromAddress)) {
          return {
            success: false,
            error: `fromAddress: ${input.fromAddress} is not a valid Ethereum address`,
          };
        }

        if (input.toAddress === "" || !isAddress(input.toAddress)) {
          return {
            success: false,
            error: `toAddress: ${input.toAddress} is not a valid Ethereum address`,
          };
        }

        if (input.amount <= 0) {
          return {
            success: false,
            error: `amount is invalid or zero: ${input.fromAddress}`,
          };
        }

        console.log("inputs validated!");

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
