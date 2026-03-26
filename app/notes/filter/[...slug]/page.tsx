import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { NoteFilter } from "@/types/note";

interface AppProps {
  params: Promise<{ slug: string[] }>;
}

export default async function App({ params }: AppProps) {
  const { slug } = await params;
  const actualTag = slug[0] as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", actualTag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag: actualTag as NoteFilter,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={actualTag as NoteFilter | "all"} />
    </HydrationBoundary>
  );
}
