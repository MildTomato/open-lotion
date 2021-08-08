import React, { useEffect, useState, memo } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { setCaretToEnd } from "../../lib/setCaretToEnd";
import EditableBlock from "../../components/EditableBlock";
import DefaultLayout from "../../components/layouts/default";
import { supabase } from "../../utils/supabaseClient";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CollabBlock from "../../components/CollabBlock";
import PreviewBlock from "../../components/PreviewBlock";

type Options = "p" | "h1";

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

const grid = 8;
const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function EditablePage() {
  const router = useRouter();
  const { id, ref, pid }: any = router.query;

  /*
   * issue with useRouter not loading in time
   */
  if (!pid) return null;

  const [blocks, setBlocks] = useState<BlockProps[]>([]);
  const [page, setPage] = useState<PageProps | undefined>();
  const [updatingBlocks, setUpdatingBlocks] = useState(false);

  // let blocks: any = null;

  async function fetch() {
    try {
      const { data, error } = await supabase
        .from<PageProps>("pages")
        .select()
        .eq("id", pid);

      if (error) throw error;

      // console.log("data", data);

      // @ts-ignore
      setBlocks(data[0].blocks);
      // if (!data) {
      //   setBlocks([]);
      // }
      // @ts-ignore
      setPage(data[0]);

      // console.log("data", data);
    } catch (error) {
      console.error(error);
    }
  }

  // console.log("blocks", blocks);

  // async function handleChange(props: BlockProps) {
  //   let { id, html, tag } = props;
  //   let _blocks = [];
  //   _blocks = blocks;
  //   if (_blocks.length <= 0) return;
  //   let index = _blocks.findIndex((block) => block.id == id);
  //   // console.log("index", index);

  //   _blocks[index].html = html;

  //   setBlocks(_blocks);

  //   try {
  //     const { data, error } = await supabase
  //       .from("pages")
  //       .update({
  //         name: "john smith",
  //         content: _blocks,
  //       })
  //       .eq("id", pid);

  //     if (error) throw error;

  //     console.log("data", data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  useEffect(() => {
    fetch();
    // save();
  }, []);

  // function updatePageHandler(updatedBlock: BlockProps) {
  //   // const blocks = this.state.blocks;
  //   const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
  //   const updatedBlocks = [...blocks];
  //   updatedBlocks[index] = {
  //     ...updatedBlocks[index],
  //     tag: updatedBlock.tag,
  //     html: updatedBlock.html,
  //   };
  //   setBlocks(updatedBlocks);
  // }

  // function addBlockHandler(currentBlock: any) {
  //   const newBlock: BlockProps = initialBlock;
  //   // const blocks = blocks;
  //   const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
  //   const updatedBlocks = [...blocks];
  //   updatedBlocks.splice(index + 1, 0, newBlock);
  //   setBlocks(updatedBlocks);
  //   currentBlock.ref.nextElementSibling.focus();
  // }

  // function deleteBlockHandler(currentBlock: any) {
  //   console.log("currentBlock", currentBlock);
  //   console.log("previousBlock", currentBlock.ref.previousElementSibling);
  //   const previousBlock = currentBlock.ref.previousElementSibling;
  //   previousBlock.focus();
  //   if (previousBlock) {
  //     // const blocks = this.state.blocks;
  //     const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
  //     const updatedBlocks = [...blocks];
  //     updatedBlocks.splice(index, 1);
  //     setBlocks(updatedBlocks);
  //     setCaretToEnd(previousBlock);
  //     previousBlock.focus();
  //   }
  // }

  console.log("rendered", blocks);
  if (!page) return <span>loading...</span>;

  // const [state, setState] = useState({ quotes: initial });

  async function onDragEnd(result: any) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    console.log("result", result);

    let _blocks = page.blocks;
    let _page: PageProps = page;

    const items = reorder(
      _blocks,
      result.source.index,
      result.destination.index
    );

    _page.blocks = items;

    // console.log(items);
    console.log("UPDATING SUPABASE");
    const { data, error } = await supabase
      .from("pages")
      .update({
        blocks: items,
      })
      .eq("id", pid);

    if (error) console.error(error);
    console.log("updated pages", data);

    setPage(_page);
  }

  function checkOrder(newBlocks: any) {
    console.log("checkOrder", newBlocks);
    if (newBlocks && newBlocks !== blocks) {
      console.log("not the same");
    } else {
      console.log("the same");
    }
  }

  function mySubscription() {
    supabase
      .from(`pages:id=eq.${pid}`)
      .on("UPDATE", (payload) => {
        console.log("LISTENING, and got ", payload?.new?.blocks);
        // console.log("compared to ", blocks);
        checkOrder(payload?.new?.blocks);
        if (payload?.new?.blocks && payload?.new?.blocks !== blocks) {
          // setUpdatingBlocks(true);
          // let _page: any = {};
          // _page = page;
          // console.log("_page", _page);
          // _page["blocks"] = payload?.new?.blocks;
          // setBlocks(payload?.new?.blocks);
          // setUpdatingBlocks(false);
        }
        // setUpdatingBlocks(false);
      })
      .subscribe();
  }

  mySubscription();

  return (
    <DefaultLayout>
      {page.blocks && (
        <div className="Page max-w-5xl mx-auto py-16 blocks-container">
          {/* <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
              {(provided: any) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <QuoteList blocks={page?.blocks} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext> */}

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided: any, snapshot: any) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {page.blocks.map((item, index) => (
                    <Draggable
                      key={item.id.toString()}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided: any, snapshot: any) => {
                        const [dragged, setDragged] = useState(false);

                        useEffect(() => {
                          setDragged(snapshot.isDragging ? true : false);
                          if (snapshot.isDragging) {
                          } else {
                            // console.log("STOPPED DRAGGING");
                          }
                        }, [snapshot]);

                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            // {...provided.dragHandleProps}
                            className="relative w-full py-2 border-dashed px-6 group"
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="absolute opacity-0 transition-all group-hover:opacity-100 -ml-2.5 mt-1.5 bg-gray-200 border rounded hover:bg-gray-600 transition-colors h-3 w-3 mb-2"
                            ></div>
                            <div className="px-3">
                              {/* <div className="px-2 py-0.5 bg-red-500 bg-opacity-20">
                                {item.id}
                              </div> */}
                              {snapshot.isDragging || updatingBlocks ? (
                                <PreviewBlock id={item.id} />
                              ) : (
                                <CollabBlock
                                  // block={block}
                                  // handleUsersChange={handleUsersChange}
                                  // isDragging={snapshot.isDragging}
                                  id={item.id}
                                />
                              )}
                            </div>
                          </div>
                        );
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </DefaultLayout>
  );
}

export default EditablePage;
