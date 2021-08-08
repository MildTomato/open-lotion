// Imports

import React, { useState, createRef, useRef } from "react";
import ContentEditable from "react-contenteditable";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Code from "@tiptap/extension-code";
import Typography from "@tiptap/extension-typography";
import { ColorHighlighter } from "./../lib/Extensions/ColorHighlighter";
import { SmilieReplacer } from "./../lib/Extensions/SmilieReplacer";

interface BlockProps {
  //   onChangeHandler(x: any): void;
  html: any;
  tag: any;
  id: string;

  // need updating
  updatePage: any;
  addBlock: any;
  deleteBlock: any;
  handleChange: any;
}

function EditableBlock(props: BlockProps) {
  const {
    id,
    html: _html,
    tag: _tag,
    updatePage,
    addBlock,
    deleteBlock,
    handleChange,
  } = props;

  console.log("EditableBlock props", _html, _tag);

  const [html, setHtml] = useState(_html);
  const [tag, setTag] = useState(_tag);

  const contentEditable: any = createRef();

  const text = useRef(html);

  // const handleChange = (evt: any) => {
  //   text.current = evt.target.value;
  // };

  const handleBlur = () => {
    console.log(text.current);
  };

  function onKeyDownHandler(e: any) {
    if (e.key === "Backspace" && !text.current) {
      e.preventDefault();
      deleteBlock({
        id: id,
        ref: contentEditable.current,
      });
    }
    // this.setState({ previousKey: e.key });
  }

  const Tiptap = () => {
    const editor: any = useEditor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Code,
        Typography,
        ColorHighlighter,
        SmilieReplacer,
      ],
      content: html,
      // onUpdate: handleChange,
      onUpdate({ editor }) {
        // The content has changed.
        const html = editor.getHTML();
        handleChange({ id, html, tag });
      },
    });

    return <EditorContent editor={editor} />;
  };

  return <Tiptap />;
}

export default EditableBlock;
