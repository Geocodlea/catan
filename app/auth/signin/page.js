import { getProviders } from "next-auth/react";

import Providers from "./Providers";

export default async function Signin() {
  const providers = await getProviders();

  return <Providers providers={providers} />;
}
