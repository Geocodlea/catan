"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Bold,
  Italic,
  Heading,
  Link,
  List,
  PasteFromOffice,
  Table,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

const Editor = ({ saveData, initialData, tab }) => {
  // const handleReady = (editor) => {
  //   console.log("Editor is ready to use!", editor);
  // };

  // const handleChange = (event, editor) => {
  //   console.log(event);
  // };

  const handleBlur = (event, editor) => {
    //  console.log("Blur.", editor);
    saveData(editor.getData(), tab);
  };

  // const handleFocus = (event, editor) => {
  //   console.log("Focus.", editor);
  // };

  const config = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "insertTable",
        "|",
        "undo",
        "redo",
      ],

      shouldNotGroupWhenFull: true,
    },
    plugins: [
      Heading,
      Essentials,
      Bold,
      Italic,
      Link,
      List,
      PasteFromOffice,
      Table,
      Undo,
    ],
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      config={config}
      data={initialData}
      //  onReady={handleReady}
      //  onChange={handleChange}
      onBlur={handleBlur}
      //  onFocus={handleFocus}
    />
  );
};

export default Editor;
