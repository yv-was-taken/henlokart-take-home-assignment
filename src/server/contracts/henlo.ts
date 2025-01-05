import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  getContract,
} from "viem";
import { base } from "viem/chains";
import { HENLO_ABI, HENLO_CONTRACT_ADDRESS } from "~/server/constants";

export const publicClient = createPublicClient({
  chain: base,
  transport: http("https://base-rpc.publicnode.com"),
});

export const henloContract = getContract({
  address: HENLO_CONTRACT_ADDRESS,
  abi: HENLO_ABI,
  client: {
    public: publicClient,
  },
});
