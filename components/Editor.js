"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
        "|",
        "link",
        "imageUpload",
        "mediaEmbed",
        "insertTable",
        "|",
        "undo",
        "redo",
      ],

      shouldNotGroupWhenFull: true,
    },
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
