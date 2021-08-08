import React, { useEffect, useState, memo } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { setCaretToEnd } from "../../lib/setCaretToEnd";
import EditableBlock from "../../components/EditableBlock";
import DefaultLayout from "../../components/layouts/default";
import { supabase } from "../../utils/supabaseClient";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CollabBlock from "../../components/CollabBlock";

interface BlockProps {
  id: number;
  layout: any;
  tag: "p" | "h1" | "table";
}

interface PageProps {
  id: number;
  name: string;
  blocks: BlockProps[];
}

interface UsersProps {
  clientId: number;
  name: string;
  color: string;
}

interface activeUsersProps {
  id: UsersProps[];
}

function EditablePage() {
  const router = useRouter();
  const { pid }: any = router.query;

  /*
   * issue with useRouter not loading in time
   */
  if (!pid) return null;

  const [page, setPage] = useState<PageProps | undefined>();
  const [activeUsers, setActiveUsers] = useState<activeUsersProps>({});

  async function fetchDoc() {
    console.log("fetching...");
    try {
      const { data, error }: any = await supabase
        .from<PageProps>("pages")
        .select()
        .eq("id", pid);

      if (error) throw error;

      setPage(data[0]);

      console.log(data[0]);
    } catch (error) {
      console.error(error);
    }
  }

  function handleUsersChange(currentUsers: UsersProps[], id: number) {
    let _activeUsers: activeUsersProps = activeUsers;

    // @ts-ignore
    _activeUsers[id] = {
      ...currentUsers,
    };

    setActiveUsers(_activeUsers);
  }

  useEffect(() => {
    fetchDoc();
  }, [pid]);

  if (!page) return <span>loading...</span>;

  console.log("page", page);

  return (
    <DefaultLayout>
      <div className="max-w-5xl mx-auto py-16 px-6">
        {page &&
          page.blocks.map((block) => {
            return (
              <CollabBlock
                // block={block}
                handleUsersChange={handleUsersChange}
                id={block.id}
              />
            );
          })}
      </div>
    </DefaultLayout>
  );
}

export default EditablePage;
