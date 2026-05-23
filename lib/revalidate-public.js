import { revalidatePath } from "next/cache";

/** Invalide le cache Next.js de la page d'accueil après une modification CMS */
export function revalidatePublicPages() {
  revalidatePath("/", "layout");
  revalidatePath("/");
}
