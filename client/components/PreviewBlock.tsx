import React, { useState, useEffect } from "react";
import { EditorContent, Editor } from "@tiptap/react";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Code from "@tiptap/extension-code";
import Typography from "@tiptap/extension-typography";
import { ColorHighlighter } from "./../lib/Extensions/ColorHighlighter";
import { SmilieReplacer } from "./../lib/Extensions/SmilieReplacer";

// import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";

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

function PreviewBlock(props: any) {
  const [currentUser, setCurrentUser] = useState({});

  const user: any = useUser().user;

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
  }, [id]);

  const TiptapDragging = () => {
    // console.log("dragging");
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

    async function fetchBlock() {
      //   console.log("id in fetch block", id);
      try {
        const { data, error }: any = await supabase
          .from("blocks")
          .select()
          .eq("id", id);

        if (error) throw error;

        // console.log("fetch block data", data);

        editor.commands.setContent(data[0].content.default, true);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBlock();

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    return <EditorContent editor={editor} />;
  };

  return <TiptapDragging />;
}

export default PreviewBlock;
