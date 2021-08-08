import express from "express";
import expressWebsockets from "express-ws";
import { Server } from "@hocuspocus/server";
import { writeFile, readFileSync } from "fs";

// import { debounce } from "debounce";
import { TiptapTransformer } from "@hocuspocus/transformer";

import { supabase } from "./utils/supabaseClient.js";

import pkg from "debounce";

// extensions
// import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Code } from "@tiptap/extension-code";
import { Typography } from "@tiptap/extension-typography";
import { ColorHighlighter } from "./lib/Extensions/ColorHighlighter.js";
import { SmilieReplacer } from "./lib/Extensions/SmilieReplacer.js";

// @ts-ignore
// const StarterKit = WeirdStarterKitImportWithDefualt.default;

const { debounce } = pkg;

let debounced;

let activeRooms = [];

// Configure hocuspocus
const server = Server.configure({
  // ..

  // let status = 'on'

  async onCreateDocument(data) {
    console.log("onCreateDocument ran");
    console.log(data.document);

    var active = data.document.name
      ? activeRooms.indexOf(data.document.name) > -1
      : false;
    if (!active) {
      activeRooms.push(data.document.name);
    }

    if (active) return;

    try {
      // The tiptap collaboration extension uses shared types of a single y-doc
      // to store different fields in the same document.
      // The default field in tiptap is simply called "default"
      const fieldName = "default";

      // Check if the given field already exists in the given y-doc.
      // Important: Only import a document if it doesn't exist in the primary data storage!
      if (!data.document.isEmpty(fieldName)) {
        return;
      }

      // console.log(data);

      var id = data.documentName.split(".")[1];
      const { data: blockData, error } = await supabase
        .from("blocks")
        .select("content")
        .eq("id", id);

      if (error) {
        console.error(error);
        throw error;
      }

      // console.log("blockData[0].content.default", blockData;

      const json = blockData[0].content.default;
      // console.log("json", json);
      // console.log("type json", typeof json);

      // Convert the editor format to a y-doc. The TiptapTransformer requires you to pass the list
      // of extensions you use in the frontend to create a valid document
      return TiptapTransformer.toYdoc(json, fieldName);
      // return json;
    } catch (error) {
      console.error(error);
    }
  },

  async onChange(data) {
    const save = async () => {
      // Convert the y-doc to something you can actually use in your views.
      // In this example we use the TiptapTransformer to get JSON from the given
      // ydoc.

      // console.log(data.documentName);

      var id = data.documentName.split(".")[1];

      const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document);

      // console.log("prosemirrorJSON", prosemirrorJSON);
      // console.log("document name", data.documentName);

      try {
        const { data, error } = await supabase
          .from("blocks")
          .update([
            {
              content: prosemirrorJSON,
            },
          ])
          .eq("id", id);
        if (error) throw error;
        console.log("saved", data);
      } catch (error) {
        console.error(error);
      }

      // Maybe you want to store the user who changed the document?
      // Guess what, you have access to your custom context from the
      // onConnect hook here. See authorization & authentication for more
      // details
      // console.log(
      //   `Document ${data.documentName} changed by ${data.context.user.name}`
      // );
    };

    // debounced?.clear();
    // debounced = debounce(() => save, 4000);
    // debounced();
    save();
  },
});

// Setup your express instance using the express-ws extension
const { app } = expressWebsockets(express());

// A basic http route
app.get("/", (request, response) => {
  response.send("Hello World!");
});

// Add a websocket route for hocuspocus
// Note: make sure to include a parameter for the document name.
// You can set any contextual data like in the onConnect hook
// and pass it to the handleConnection method.
app.ws("/blocks/:document", (websocket, request) => {
  const context = {
    user: {
      id: 1234,
      name: "Jane",
    },
  };

  server.handleConnection(websocket, request, request.params.document, context);
});

// Start the server
app.listen(1234, () => console.log("Listening on http://127.0.0.1:1234"));
