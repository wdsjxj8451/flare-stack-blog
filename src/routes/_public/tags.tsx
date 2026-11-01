import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { siteDomainQuery } from "@/features/config/queries";
import { TagsPage } from "@/features/tags/components/tags-page";
import { tagsQueryOptions } from "@/features/tags/queries";
import { buildCanonicalUrl, canonicalLink } from "@/lib/seo";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_public/tags")({
  loader: async ({ context }) => {
    const [, domain] = await Promise.all([
      context.queryClient.ensureQueryData(tagsQueryOptions),
      context.queryClient.ensureQueryData(siteDomainQuery),
    ]);
    return {
      title: m.tags_title(),
      description: m.tags_description(),
      canonicalHref: buildCanonicalUrl(domain, "/tags"),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title },
      { name: "description", content: loaderData?.description },
    ],
    links: [canonicalLink(loaderData?.canonicalHref ?? "/tags")],
  }),
  component: TagsRoute,
});

function TagsRoute() {
  const { data: tags } = useSuspenseQuery(tagsQueryOptions);
  return <TagsPage tags={tags} />;
}
