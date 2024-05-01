"use client";

// App.jsx / App.tsx
import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Test = () => {
  const handleReady = (editor) => {
    console.log("Editor is ready to use!", editor);
  };

  const handleChange = (event) => {
    console.log(event);
  };

  const handleBlur = (event, editor) => {
    console.log("Blur.", editor);
  };

  const handleFocus = (event, editor) => {
    console.log("Focus.", editor);
  };

  return (
    <div className="App">
      <h2>Using CKEditor&nbsp;5 build in React</h2>
      <CKEditor
        editor={ClassicEditor}
        data="<p>Hello from CKEditor&nbsp;5!</p>"
        onReady={handleReady}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    </div>
  );
};

export default Test;
