import { Skeleton } from "@/components/ui/skeleton";

export function HomePageSkeleton() {
  return (
    <div className="journal-home" aria-busy="true">
      <div className="home-cover">
        <div className="home-cover-shade" />
      </div>
      <div className="home-introduction">
        <div>
          <Skeleton className="mb-5 h-3 w-40" />
          <Skeleton className="mb-6 h-16 w-60" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="h-52 w-full rounded-2xl" />
      </div>
      <div className="journal-divider" aria-hidden="true">
        <span />
        <i />
        <span />
      </div>
      <div className="home-post-grid">
        {[0, 1].map((key) => (
          <div key={key} className="fuwari-card-base p-6">
            <Skeleton className="mb-5 h-3 w-32" />
            <Skeleton className="mb-5 h-6 w-4/5" />
            <Skeleton className="mb-3 h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
