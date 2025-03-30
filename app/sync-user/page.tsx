import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

export default async function SyncUser() {
    const {userId } = await auth();

    if (!userId) {
        return redirect("/sign-in");
    }

const client = await clerkClient();
const user = await client.users.getUser(userId);
if(!user.emailAddresses[0]?.emailAddress) {
  return notFound();
}

await prisma.user.upsert({
    where: {
        id: userId,
    },
    update: {
        email: user.emailAddresses[0].emailAddress,
    },
    create: {
        id: userId,
        email: user.emailAddresses[0].emailAddress , 
        firstName: user.firstName ,
        lastName: user.lastName ,
        imageUrl: user.imageUrl,
    },
});


  return redirect("/dashboard");
}