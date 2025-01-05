import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { henloContract } from "~/server/api/contracts/henlo";
import { formatUnits } from "viem";

export const getUserHenloBalanceRouter = createTRPCRouter({
  getBalance: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
      try {
        console.log("\nquerying balance for address: ", input.address);

        const contract = henloContract;
        const balance = await contract.read.balanceOf([input.address]);
        return {
          balance: formatUnits(balance, 18), // Assuming 18 decimals
          success: true,
        };
      } catch (error) {
        console.error("\n Error fetching HENLO balance:", error);
        return {
          balance: "0",
          success: false,
          error: "Failed to fetch balance",
        };
      }
    }),
});
