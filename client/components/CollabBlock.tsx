import React, { useState, createRef, useRef, useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
// import { Editor, EditorContent } from "@tiptap/vue-2";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Code from "@tiptap/extension-code";
import Typography from "@tiptap/extension-typography";
import { ColorHighlighter } from "./../lib/Extensions/ColorHighlighter";
import { SmilieReplacer } from "./../lib/Extensions/SmilieReplacer";

// import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { useUser } from "../lib/UserContext";
import { supabase } from "../utils/supabaseClient";

const randomColors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
];

function CollabBlock(props: any) {
  const [users, setUsers] = useState(null);
  const [provider, setProvider] = useState(null);
  const [yDoc, setYDoc] = useState(null);
  const [currentUser, setCurrentUser] = useState({});

  const user: any = useUser().user;

  // console.log(user);

  let status = "connecting";
  let room = `rooms.${props.id}`;

  const {
    id,
    html: _html,
    tag: _tag,
    updatePage,
    addBlock,
    deleteBlock,
    handleChange,
    // handleUsersChange,
    isDragging,
  } = props;

  useEffect(() => {
    const randomColor = Math.floor(Math.random() * randomColors.length);

    setCurrentUser({
      // @ts-ignore
      name: user.email,
      color: randomColors[randomColor],
    });

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "ws://127.0.0.1:1234/blocks",
      room,
      ydoc
    );
    const indexdb = new IndexeddbPersistence(room, ydoc);

    // @ts-ignore
    setProvider(provider);
    // @ts-ignore
    setYDoc(ydoc);
  }, [room, id]);

  if (!provider && !yDoc) return <span>Loading provider</span>;

  //   window.ydoc = ydoc;

  //   provider.on("status", (event: any) => {
  //     status = event.status;
  //   });

  const contentEditable: any = createRef();

  const TiptapCollab = () => {
    const editor: any = useEditor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Code,
        Typography,
        ColorHighlighter,
        SmilieReplacer,
        Collaboration.configure({
          document: yDoc,
        }),
        CollaborationCursor.configure({
          provider: provider,
          user: currentUser,
          onUpdate: (users: any) => {
            // handleUsersChange(users, id);
          },
        }),
        CharacterCount.configure({
          limit: 10000,
        }),
      ],
    });
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    return <EditorContent editor={editor} />;
  };

  const TiptapDragging = () => {
    console.log("dragging");
    const editor: any = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Code,
        Typography,
        ColorHighlighter,
        SmilieReplacer,
        CharacterCount.configure({
          limit: 10000,
        }),
      ],
    });

    // async function fetchBlock() {
    //   console.log("id in fetch block", id);
    //   try {
    //     const { data, error }: any = await supabase
    //       .from("blocks")
    //       .select()
    //       .eq("id", id);

    //     if (error) throw error;

    //     console.log("fetch block data", data);

    //     editor.commands.setContent(data[0].content.default, true);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    // fetchBlock();

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    return <EditorContent editor={editor} />;
  };

  // console.log(users);

  return isDragging ? <TiptapDragging /> : <TiptapCollab />;
}

export default CollabBlock;
